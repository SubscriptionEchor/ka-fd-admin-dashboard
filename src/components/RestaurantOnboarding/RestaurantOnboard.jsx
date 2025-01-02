import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Pagination,
  TextField,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material';
import { Visibility, Check, Close, ZoomIn } from '@mui/icons-material';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
// import { useMutation } from '@apollo/client';
import { updateCommission } from '../../apollo/mutations';

// Constants
const ITEMS_PER_PAGE = 5;

// GraphQL Queries and Mutations
const GET_ALL_APPLICATIONS = gql`
  query AdminViewApplications {
    getAllRestaurantOnboardingApplication {
      beneficialOwners {
        name
        passportId
        email
        phone
        isPrimary
        emailVerified
        idCardDocuments
      }
      restaurantName
      restaurantContactInfo {
        email
        phone
      }
      restaurantImages
      menuImages
      profileImage
      cuisines
      businessDocuments {
        hospitalityLicense
        registrationCertificate
        bankDetails {
          accountNumber
          bankName
          branchName
          bankIdentifierCode
          accountHolderName
          documentUrl
        }
        taxId {
          documentNumber
          documentUrl
        }
      }
      _id
      applicationStatus
      createdAt
      resubmissionCount
      potentialVendor
      statusHistory {
        status
        reason
        changedBy {
          userId
          userType
        }
        timestamp
      }
    }
  }
`;

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateRestaurantOnboardingApplicationStatus($applicationId: ID!, $status: RestaurantOnboardingStatus!, $reason: String, $fees: RestaurantFeesInput) {
  updateRestaurantOnboardingApplicationStatus(applicationId: $applicationId, status: $status, reason: $reason, fees: $fees) {
    _id
    applicationStatus
    statusHistory {
      status
      reason
      timestamp
      changedBy {
        userId
        userType
      }
    }
  }
}
`;

// Constants for status
const APPLICATION_STATUS = {
  REQUESTED_ONBOARDING: 'REQUESTED_ONBOARDING',
  ACCEPTED: 'ACCEPTED',
  OFFLINE_PROCESSING: 'OFFLINE_PROCESSING',
  ONBOARDED: 'ONBOARDED',
  PENDING_VENDOR_REVIEW: 'PENDING_VENDOR_REVIEW',
  LIVE: 'LIVE',
  REJECTED: 'REJECTED',
  REQUESTED_CHANGES: 'REQUESTED_CHANGES'
};

async function handleAction(app, action) {
  if (action === 'approve') {
    if (app.applicationStatus === 'REQUESTED_CHANGES') {
      alert("You must resubmit the application before approval.");
      return; // Prevent further action
    }

    try {
      await updateStatus({
        variables: {
          applicationId: app._id,
          status: APPLICATION_STATUS.ACCEPTED,
          reason: "Application approved"
        },
        refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }

  } else if (action === 'reject') {
    if (app.applicationStatus === 'REQUESTED_CHANGES') {
      // It needs to go back to REQUESTED_ONBOARDING before rejecting
      alert("You must reset the application to REQUESTED_ONBOARDING before rejecting.");
      return;
    }

    // Implement rejection logic for other statuses
    setSelectedApp(app);
    setActionType('reject');
    setShowDialog(true); // To gather rejection reason

  } else if (action === 'resubmit') {
    // Allow resubmit to change status back to initially editable state
    setSelectedApp(app);
    setActionType('resubmit');
    setShowDialog(true);
  }
}

async function handleConfirm() {
  if (!statusReason) {
    alert('Please provide a reason');
    return;
  }

  try {
    if (actionType === 'reject') {
      if (selectedApp.applicationStatus === 'REQUESTED_CHANGES') {
        // Change status back to REQUESTED_ONBOARDING before rejecting
        await updateStatus({
          variables: {
            applicationId: selectedApp._id,
            status: "REQUESTED_ONBOARDING",
            reason: "Resetting application for rejection"
          }
        });

        // Then reject the application
        await updateStatus({
          variables: {
            applicationId: selectedApp._id,
            status: "REJECTED",
            reason: statusReason
          }
        });
      } else {
        // Directly reject if in another state
        await updateStatus({
          variables: {
            applicationId: selectedApp._id,
            status: "REJECTED",
            reason: statusReason
          }
        });
      }
    } else if (actionType === 'resubmit') {
      // Change status to REQUESTED_ONBOARDING or relevant naive state
      await updateStatus({
        variables: {
          applicationId: selectedApp._id,
          status: "REQUESTED_ONBOARDING",
          reason: "Application resubmitted for changes"
        }
      });
    }

    // Final cleanup
    setShowDialog(false);
    setSelectedApp(null);
    setActionType(null);
    setStatusReason('');
  } catch (error) {
    console.error('Error updating application status:', error);
  }
}

const GET_DOCUMENT_URLS = gql`
  query GetDocumentUrlsForRestaurantOnboardingApplication($applicationId: ID!) {
    getDocumentUrlsForRestaurantOnboardingApplication(applicationId: $applicationId)
  }
`;

const STATUS_STEPS = [
  { label: 'Accepted', value: APPLICATION_STATUS.ACCEPTED },
  { label: 'Offline Processing', value: APPLICATION_STATUS.OFFLINE_PROCESSING },
  { label: 'Onboarded', value: APPLICATION_STATUS.ONBOARDED },
  { label: 'Pending vendor review', value: APPLICATION_STATUS.PENDING_VENDOR_REVIEW },
  { label: 'Live', value: APPLICATION_STATUS.LIVE }
];
// Image Preview Component
const ImagePreview = ({ url, title, loading }) => {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '200px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        '&:hover .overlay': {
          opacity: 1,
        },
      }}
      onClick={handleClick}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f5f5f5',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <img
            src={url}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
          >
            <ZoomIn sx={{ color: 'white', fontSize: 40 }} />
          </Box>
        </>
      )}
    </Box>
  );
};

// Document Preview Component
const DocumentPreview = ({ url, title, loading }) => {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
      onClick={handleClick}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          <Box component="img"
            src={url}
            alt={title}
            sx={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        </>
      )}
    </Box>
  );
};

// Section Component for ApplicationViewModal
const Section = ({ title, children }) => (
  <Box mb={3}>
    <Typography variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Paper sx={{ p: 3, borderRadius: '12px' }}>
      {children}
    </Paper>
  </Box>
);

const ApplicationViewModal = ({ open, onClose, application }) => {
  const tok = JSON.parse(localStorage.getItem("user-enatega")); // Parse token from localStorage
  const [preSignedUrls, setPreSignedUrls] = useState({});
  const [fetchDocumentUrls, { data, loading, error }] = useLazyQuery(GET_DOCUMENT_URLS, {
    context: {
      headers: {
        Authorization: `Bearer ${tok?.token}`, // Send token in headers
      },
    },
  });

  useEffect(() => {
    if (application?._id) {
      fetchDocumentUrls({
        variables: { applicationId: application._id },
      });
    }
  }, [application, fetchDocumentUrls]);

  useEffect(() => {
    if (data?.getDocumentUrlsForRestaurantOnboardingApplication) {
      setPreSignedUrls(data.getDocumentUrlsForRestaurantOnboardingApplication);
    }
  }, [data]);


  const renderDocs = (docs) => {
    return docs?.map((doc, index) => {
      const url = preSignedUrls[doc] || doc; // Use pre-signed URL if available

      return (
        <Grid item xs={4} key={index}> {/* Adjust the width as needed */}
          <div style={{
            height: '200px',  // Fixed height for uniformity
            overflow: 'hidden', // Prevent overflow
            position: 'relative', // For absolute positioning of img
            transition: 'transform 0.3s ease', // Transition for scale 
            borderRadius: "10px"
          }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', height: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }} // Scale up on hover
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} // Scale down when not hovering
            >
              <img
                src={url} // Assuming the doc URL is an image
                alt={`Document ${index + 1}`}
                style={{
                  width: '32%', // Ensures the image takes the full width of the container
                  height: '100%',
                  objectFit: 'cover', // Ensures the image covers the container
                  position: 'absolute', // Position to fill the div
                  top: 0,
                  left: 0,
                  transition: 'transform 0.3s ease' // Transition for the img element too
                }}
              />
            </a>
          </div>

        </Grid>
      );
    });
  };

  const renderImages = (images) => {
    return images?.map((image, index) => {
      const url = preSignedUrls[image] || image; // Use pre-signed URL if available

      return (
        <Grid item xs={4} key={index}>
          <div style={{
            height: '200px',  // Fixed height for uniformity
            overflow: 'hidden', // Prevent overflow
            position: 'relative', // For absolute positioning of img
            transition: 'transform 0.3s ease', // Transition for scale 
            borderRadius: "10px"
          }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', height: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }} // Scale up on hover
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} // Scale down when not hovering
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures the image covers the container
                  position: 'absolute', // Position to fill the div
                  top: 0,
                  left: 0,
                  transition: 'transform 0.3s ease' // Transition for the img element too
                }}
              />
            </a>
          </div>
        </Grid>
      );
    });
  };
  const Section = ({ title, children }) => (
    <Box mb={3}>
      <Typography variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Paper className="p-4">{children}</Paper>
    </Box>
  );

  if (!application) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="overflow-y-auto"
    >
      <DialogTitle>
        <Typography sx={{ color: 'black' }} variant="h5">
          {application.restaurantName} - Application Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box className="space-y-6">
          {/* Basic Information */}
          <Section title="Basic Information">
            <Grid container spacing={2} sx={{ color: 'black' }}>
              <Grid item xs={6}>
                <Typography>Restaurant Name</Typography>
                <Typography>{application.restaurantName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Application Status</Typography>
                <Typography>{application.applicationStatus}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Created Date</Typography>
                <Typography>{new Date(parseInt(application.createdAt)).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Vendor ID</Typography>
                <Typography>{application.potentialVendor || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Section>

          {/* Restaurant Contact Info */}
          <Section title="Restaurant Contact Info" >
            <Typography sx={{ color: "black" }}>Email: {application.restaurantContactInfo?.email}</Typography>
            <Typography sx={{ color: "black" }}>Phone: {application.restaurantContactInfo?.phone}</Typography>
          </Section>

          {/* Cuisines */}
          <Section title="Cuisines" >
            <Typography sx={{ color: "black" }}>{application.cuisines?.join(', ')}</Typography>
          </Section>

          {/* Beneficial Owners */}
          <Section title="Beneficial Owners" >
            {application.beneficialOwners?.map((owner, index) => (
              <Box key={index} mb={2} sx={{ color: "black" }}>
                <Typography>Name: {owner.name}</Typography>
                <Typography>Passport ID: {owner.passportId}</Typography>
                <Typography>Email: {owner.email}</Typography>
                <Typography>Phone: {owner.phone}</Typography>
                <Typography>Is Primary: {owner.isPrimary ? 'Yes' : 'No'}</Typography>
                <Typography>Email Verified: {owner.emailVerified ? 'Yes' : 'No'}</Typography>
                <Typography>ID Card Documents:</Typography>
                {renderDocs(owner.idCardDocuments)}
              </Box>
            ))}
          </Section>

          {/* Restaurant Images */}
          <Section title="Restaurant Images">
            <Grid container spacing={2} sx={{ color: 'black' }}>
              {renderImages(application.restaurantImages)}
            </Grid>
          </Section>

          {/* Menu Images */}
          <Section title="Menu Images">
            <Grid container spacing={2} sx={{ color: 'black' }}>
              {renderImages(application.menuImages)}
            </Grid>
          </Section>

          {/* Profile Image */}
          <Section title="Profile Image">
            <Grid container spacing={2} sx={{ color: 'black' }}>
              {renderImages([application.profileImage])}
            </Grid>
          </Section>
          {/* Business Documents */}
          <Section title="Business Documents" >
            <Typography sx={{ color: "black" }}>Hospitality License:</Typography>
            {renderDocs([application.businessDocuments?.hospitalityLicense])}
            <Typography sx={{ color: "black" }}>Registration Certificate:</Typography>
            {renderDocs([application.businessDocuments?.registrationCertificate])}
            <Typography sx={{ color: "black" }}>Tax ID Document:</Typography>
            {renderDocs([application.businessDocuments?.taxId?.documentUrl])}
            <Section title="Business Documents">
              <Typography sx={{ color: "black" }}>Bank Details:</Typography>
              <Typography sx={{ color: "black" }}>Account Number: {application.businessDocuments?.bankDetails?.accountNumber}</Typography>
              <Typography sx={{ color: "black" }}>Bank Name: {application.businessDocuments?.bankDetails?.bankName}</Typography>
              <Typography sx={{ color: "black" }}>Branch Name: {application.businessDocuments?.bankDetails?.branchName}</Typography>
              <Typography sx={{ color: "black" }}>Account Holder Name: {application.businessDocuments?.bankDetails?.accountHolderName}</Typography>
              <Typography sx={{ color: "black" }}>Bank Identifier Code: {application.businessDocuments?.bankDetails?.bankIdentifierCode}</Typography>
              <Typography sx={{ color: "black" }}>Bank Document:</Typography>
              {renderDocs([application.businessDocuments?.bankDetails?.documentUrl])}
            </Section>
          </Section>

          {/* Status History */}
          <Section title="Status History">
            {application.statusHistory?.length > 0 ? (
              application.statusHistory.map((historyItem, index) => (
                <Box key={index} mb={2} sx={{ color: "black" }}>
                  <Typography>
                    Status: {historyItem.status}
                  </Typography>
                  <Typography>
                    Changed By: {historyItem.changedBy.userType} (User ID: {historyItem.changedBy.userId})
                  </Typography>
                  <Typography>
                    Timestamp: {new Date(parseInt(historyItem.timestamp)).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No status history available.</Typography>
            )}
          </Section>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// Main Restaurant Onboard Component
function RestaurantOnboard() {
  // States
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('active');
  const [activeView, setActiveView] = useState('fresh');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [serviceFee, setServiceFee] = useState('');
  const [commissionRate, setCommissionRate] = useState('')
  const [merchantCancellationFee, setMerchantCancellationFee] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);


  // Get token from localStorage
  const tok = JSON.parse(localStorage.getItem("user-enatega"));

  // GraphQL Hooks
  const [updateStatus] = useMutation(UPDATE_APPLICATION_STATUS);
  const { data, loading, error } = useQuery(GET_ALL_APPLICATIONS, {
    context: {
      headers: {
        Authorization: `Bearer ${tok?.token}`,
      },
    },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  // const [updateCommissionMutation] = useMutation(updateCommission);

  // Filter applications based on status
  const applications = data?.getAllRestaurantOnboardingApplication || [];
  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'active') {
      if (activeView === 'fresh') return app.applicationStatus === 'REQUESTED_ONBOARDING';
      if (activeView === 'resubmitted') return app.applicationStatus === 'REQUESTED_CHANGES';
    }
    if (activeTab === 'approved') {
      // Include ACCEPTED status in approved tab
      return ['ACCEPTED', 'OFFLINE_PROCESSING', 'ONBOARDED', 'PENDING_VENDOR_REVIEW', 'LIVE'].includes(app.applicationStatus);
    }
    if (activeTab === 'rejected') return app.applicationStatus === 'REJECTED';
    return true;
  });

  async function handleAction(app, action) {
    try {
      if (action === 'approve') {
        // For REQUESTED_CHANGES, first reset to REQUESTED_ONBOARDING
        if (app.applicationStatus === 'REQUESTED_CHANGES') {
          await updateStatus({
            variables: {
              applicationId: app._id,
              status: "REQUESTED_ONBOARDING", // Reset to initial state
              reason: "Preparing for final approval"
            }
          });
        }

        // Then proceed to ACCEPTED
        await updateStatus({
          variables: {
            applicationId: app._id,
            status: "ACCEPTED",
            reason: "Application approved after review"
          },
          refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
        });
      } else if (action === 'reject') {
        // For REQUESTED_CHANGES, first reset to REQUESTED_ONBOARDING
        if (app.applicationStatus === 'REQUESTED_CHANGES') {
          await updateStatus({
            variables: {
              applicationId: app._id,
              status: "REQUESTED_ONBOARDING", // Reset to initial state
              reason: "Resetting before final decision"
            }
          });
        }

        // Then proceed to REJECTED
        await updateStatus({
          variables: {
            applicationId: app._id,
            status: "REJECTED",
            reason: "Application rejected"
          },
          refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
        });
      } else if (action === 'resubmit') {
        // Handle resubmission logic
        if (app.resubmissionCount === 0) {
          await updateStatus({
            variables: {
              applicationId: app._id,
              status: "REQUESTED_CHANGES",
              reason: "Resubmission requested"
            },
            refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
          });
        } else {
          // If max resubmissions reached, move to REJECTED
          await updateStatus({
            variables: {
              applicationId: app._id,
              status: "REJECTED",
              reason: "Maximum resubmissions exceeded"
            },
            refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
          });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);

      // Specific error handling
      if (error.message.includes('Invalid status transition')) {
        alert('Unable to update application status. Please contact support.');
      }
    }
  }
  // Confirmation handler remains the same
  async function handleConfirm(statusReason) {
    if (!statusReason) {
      alert('Please provide a reason');
      return;
    }

    try {
      await updateStatus({
        variables: {
          applicationId: selectedApp._id,
          status: actionType === 'reject' ? "REJECTED" : "REQUESTED_CHANGES",
          reason: statusReason
        },
        refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
      });

      // Reset dialog state
      setShowDialog(false);
      setSelectedApp(null);
      setActionType(null);
      setStatusReason('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  // Modified handleStatusChange for progression
  // async function handleStatusChange(app, newStatus) {
  //   try {
  //     if (newStatus === APPLICATION_STATUS.ONBOARDED ||
  //       newStatus === APPLICATION_STATUS.PENDING_VENDOR_REVIEW ||
  //       newStatus === APPLICATION_STATUS.LIVE) {
  //       // These statuses require fees
  //       setSelectedApp(app);
  //       setNewStatus(newStatus);
  //       setShowCommissionDialog(true);
  //     } else if (app.applicationStatus === APPLICATION_STATUS.ACCEPTED &&
  //       newStatus === APPLICATION_STATUS.OFFLINE_PROCESSING) {
  //       // Moving from ACCEPTED to OFFLINE_PROCESSING
  //       await updateStatus({
  //         variables: {
  //           applicationId: app._id,
  //           status: APPLICATION_STATUS.OFFLINE_PROCESSING,
  //           reason: "Moving to processing"

  //         },
  //         refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //   }
  // }
  async function handleStatusChange(app, newStatus) {
    try {
      // Only show commission dialog for ONBOARDED status
      if (newStatus === APPLICATION_STATUS.ONBOARDED) {
        setSelectedApp(app);
        setNewStatus(newStatus);
        setShowCommissionDialog(true);
      }
      // Show confirmation dialog for LIVE and PENDING_VENDOR_REVIEW
      else if (newStatus === APPLICATION_STATUS.LIVE ||
        newStatus === APPLICATION_STATUS.PENDING_VENDOR_REVIEW) {
        setSelectedApp(app);
        setNewStatus(newStatus);
        setShowConfirmationDialog(true);
      }
      // Direct update for OFFLINE_PROCESSING
      else if (app.applicationStatus === APPLICATION_STATUS.ACCEPTED &&
        newStatus === APPLICATION_STATUS.OFFLINE_PROCESSING) {
        await updateStatus({
          variables: {
            applicationId: app._id,
            status: APPLICATION_STATUS.OFFLINE_PROCESSING,
            reason: "Moving to processing"
          },
          refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Error updating status');
    }
  }


  async function handleFeesUpdate() {
    if (!commissionRate) {
      alert('Please enter commission rate');
      return;
    }

    try {
      await updateStatus({
        variables: {
          applicationId: selectedApp._id,
          status: newStatus,
          reason: "All documents verified and approved",
          fees: {
            serviceFeePercentage: parseFloat(commissionRate)  // Ensure it's a number
          }
        },
        refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
      });

      // Reset states
      setShowCommissionDialog(false);
      setCommissionRate('');
      setStatusReason('');
      setSelectedApp(null);
      setNewStatus(null);
    } catch (error) {
      console.error('Error updating fees:', error);
    }
  }


  async function handleConfirmStatusChange() {
    try {
      await updateStatus({
        variables: {
          applicationId: selectedApp._id,
          status: newStatus,
          reason: "Status progression confirmed"
        },
        refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
      });

      setShowConfirmationDialog(false);
      setSelectedApp(null);
      setNewStatus(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Error updating status');
    }
  }
  // Hook for the updateCommission mutation


  async function handleConfirm() {
    if (!statusReason) {
      alert('Please provide a reason');
      return;
    }

    try {
      await updateStatus({
        variables: {
          applicationId: selectedApp._id,
          status: actionType === 'reject' ? APPLICATION_STATUS.REJECTED
            : APPLICATION_STATUS.REQUESTED_CHANGES,
          reason: statusReason
        },
        refetchQueries: [{ query: GET_ALL_APPLICATIONS }]
      });

      setShowDialog(false);
      setSelectedApp(null);
      setActionType(null);
      setStatusReason('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  // Utility functions
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const timeMs = Number(timestamp);
    const date = new Date(timeMs);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Progress Steps Component
  const ProgressSteps = ({ currentStep, application }) => {
    const currentIndex = STATUS_STEPS.findIndex(step => step.value === currentStep);

    return (
      <Box display="flex" alignItems="center" gap={1}>
        {STATUS_STEPS.map((step, index) => (
          <React.Fragment key={step.value}>
            <Button
              variant="contained"
              size="small"
              color={index <= currentIndex ? 'primary' : 'inherit'}
              onClick={() => handleStatusChange(application, step.value)}
              disabled={index > currentIndex + 1}
            >
              {step.label}
            </Button>
            {index < STATUS_STEPS.length - 1 && (
              <Box
                width={30}
                height={4}
                bgcolor={index < currentIndex ? 'primary.main' : 'grey.300'}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Box p={4} sx={{ backgroundColor: '#f5f5f5', color: 'black' }}>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => {
          setActiveTab(newValue);
          setCurrentPage(1);
        }}
      >
        <Tab label="Active" value="active" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {/* Active Tab Filters */}
      {activeTab === 'active' && (
        <Box mt={2} mb={2} display="flex" gap={2}>
          <Button
            variant={activeView === 'fresh' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('fresh')}
          >
            Fresh
          </Button>
          <Button
            variant={activeView === 'resubmitted' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('resubmitted')}
          >
            Re-submitted
          </Button>
        </Box>
      )}

      {/* Applications Table */}
      <Box mt={4}>
        <TableContainer component={Paper} sx={{
          '& .MuiTableCell-root': {
            color: 'black !important',
            borderColor: 'rgba(0,0,0,0.1)'
          },
          '& .MuiTableHead-root': {
            backgroundColor: '#f0f0f0'
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                {activeTab !== 'rejected' && <TableCell>Vendor ID</TableCell>}
                <TableCell>Onboarding ID</TableCell>
                <TableCell>Restaurant Name</TableCell>
                {activeTab === 'active' && activeView === 'fresh' && <TableCell>Application Date</TableCell>}
                {activeTab === 'active' && activeView === 'resubmitted' && <TableCell>Re-submitted Date</TableCell>}
                {activeTab === 'approved' && <TableCell>Progress</TableCell>}
                {activeTab === 'approved' && <TableCell>Last Edited</TableCell>}
                {activeTab === 'rejected' && <TableCell>Rejected Date</TableCell>}
                {activeTab === 'rejected' && <TableCell>Reason</TableCell>}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginateData(filteredApplications).map((app, index) => (
                <TableRow key={app._id}>
                  <TableCell>
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  {activeTab !== 'rejected' && <TableCell>{app.potentialVendor}</TableCell>}
                  <TableCell>{app._id}</TableCell>
                  <TableCell>{app.restaurantName}</TableCell>
                  {activeTab === 'active' && activeView === 'fresh' && (
                    <TableCell>{formatTimestamp(app.createdAt)}</TableCell>
                  )}
                  {activeTab === 'active' && activeView === 'resubmitted' && (
                    <TableCell>
                      {formatTimestamp(app.resubmittedAt || app.createdAt)}
                    </TableCell>
                  )}
                  {activeTab === 'approved' && (
                    <TableCell>
                      <ProgressSteps currentStep={app.applicationStatus} application={app} />
                    </TableCell>
                  )}
                  {activeTab === 'approved' && (
                    <TableCell>{formatTimestamp(app.createdAt)}</TableCell>
                  )}
                  {activeTab === 'rejected' && (
                    <TableCell>{formatTimestamp(app.createdAt)}</TableCell>
                  )}
                  {activeTab === 'rejected' && (
                    <TableCell>
                      {app.statusHistory?.[app.statusHistory.length - 1]?.reason || 'N/A'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        '& .MuiIconButton-root': {
                          border: '1px solid #e0e0e0',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'flex',
                          gap: '4px',
                          fontSize: '13px',
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: '#2196f3' }}
                        onClick={() => {
                          setSelectedApp(app);
                          setViewModalOpen(true);
                        }}
                      >
                        <Visibility fontSize="small" />
                        <span>View</span>
                      </IconButton>

                      {activeTab === 'active' && (
                        <>
                          <IconButton
                            size="small"
                            sx={{
                              color: 'success.main',
                              '&:hover': { backgroundColor: 'success.light' },
                            }}
                            onClick={() => handleAction(app, 'approve')}
                          >
                            <Check fontSize="small" />
                            <span>Approve</span>
                          </IconButton>
                          {activeView === 'fresh' ? (
                            <IconButton
                              size="small"
                              sx={{
                                color: 'warning.main',
                                '&:hover': { backgroundColor: 'warning.light' },
                              }}
                              onClick={() => handleAction(app, 'resubmit')}
                            >
                              <Close fontSize="small" />
                              <span>Re-submit</span>
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              sx={{
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'error.light' },
                              }}
                              onClick={() => handleAction(app, 'reject')}
                            >
                              <Close fontSize="small" />
                              <span>Reject</span>
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            sx={{ backgroundColor: "#FFC107", borderRadius: "1rem", padding: "2px" }}
            count={Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
          />
        </Box>
      </Box>

      {/* Action Confirmation Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>
          {actionType === 'reject' ? 'Reject Application' : 'Request Changes'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason"
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={!statusReason}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fees Dialog */}
      <Dialog
        open={showCommissionDialog}
        onClose={() => setShowCommissionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "black" }}>Update Fees</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>

            <TextField
              fullWidth
              label="Status Update Reason"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              multiline
              rows={2}
              sx={{ display: "none" }}
            />
            <TextField
              fullWidth
              label="commission Percentage %"
              value={commissionRate}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                  setCommissionRate(value);
                }
              }}
              multiline
              rows={2}
              inputProps={{
                style: { color: 'red' },
                min: 0,
                max: 100
              }}
              type="number"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowCommissionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFeesUpdate}
            color="primary"
            disabled={!commissionRate}
          >
            Update & Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{color:"black"}}>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status to {newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmationDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmStatusChange}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application View Modal */}
      <ApplicationViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
      />
    </Box>
  );
}

export default RestaurantOnboard;