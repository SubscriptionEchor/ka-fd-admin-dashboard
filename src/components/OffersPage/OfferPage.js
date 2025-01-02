// import React, { useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client';
// import { gql } from '@apollo/client';
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Switch,
//   IconButton,
//   Typography,
//   Box,
//   makeStyles
// } from '@material-ui/core';
// import { Container } from '@mui/system';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon
// } from '@material-ui/icons';
// import { Alert } from '@mui/material';

// // GraphQL Queries and Mutations
// const GET_PROMOTIONS = gql`
//   query Promotions {
//     adminDashboardBootstrap {
//       promotions {
//         _id
//         baseCode
//         displayName
//         createdAt
//         description
//         isActive
//         maxFlatDiscount
//         maxPercentageDiscount
//         minFlatDiscount
//         minPercentageDiscount
//         minimumOrderValue
//         promotionType
//         updatedAt
//         minimumMaxDiscount
//       }
//     }
//   }
// `;

// const GET_CAMPAIGNS = gql`
//   query RestaurantCampaignsForVendorDashboard($restaurantId: ID!) {
//     restaurantCampaignsForVendorDashboard(restaurantId: $restaurantId) {
//       _id
//       name
//       description
//       couponCode
//       campaignType
//       minimumOrderValue
//       percentageDiscount
//       maxDiscount
//       flatDiscount
//       startDate
//       endDate
//       startTime
//       endTime
//       isActive
//       createdBy
//       modifiedBy
//       createdAt
//       updatedAt
//       promotion
//       restaurant
//     }
//   }
// `;

// const CREATE_CAMPAIGN = gql`
//   mutation CreateCampaign($campaign: CampaignInput!) {
//     createCampaign(campaign: $campaign) {
//       _id
//       name
//       couponCode
//       campaignType
//       percentageDiscount
//       flatDiscount
//       maxDiscount
//       minimumOrderValue
//       startDate
//       endDate
//       startTime
//       endTime
//       isActive
//       createdBy
//       modifiedBy
//       createdAt
//     }
//   }
// `;

// const CREATE_PROMOTION = gql`
//   mutation CreatePromotion($promotionInput: PromotionInput!) {
//     createPromotion(promotionInput: $promotionInput) {
//       _id
//       displayName
//       baseCode
//       promotionType
//       minPercentageDiscount
//       maxPercentageDiscount
//       minFlatDiscount
//       maxFlatDiscount
//       minimumOrderValue
//       minimumMaxDiscount
//       isActive
//     }
//   }
// `;

// const CREATE_CAMPAIGN_FOR_PROMOTIONS = gql`
//   mutation CreateCampaignForPromotions($campaignInput: CampaignInputForPromotion!) {
//     createCampaignForPromotions(campaignInput: $campaignInput) {
//       _id
//       name
//       promotion
//       percentageDiscount
//       flatDiscount
//       minimumOrderValue
//       startDate
//       endDate
//       startTime
//       endTime
//     }
//   }
// `;

// const UPDATE_CAMPAIGN = gql`
//   mutation UpdateCampaign($id: ID!, $campaign: CampaignInput!) {
//     updateCampaign(id: $id, campaign: $campaign) {
//       _id
//       name
//       description
//       couponCode
//       campaignType
//       flatDiscount
//       percentageDiscount
//       maxDiscount
//       minimumOrderValue
//       startDate
//       endDate
//       startTime
//       endTime
//       isActive
//       modifiedBy
//       updatedAt
//     }
//   }
// `;

// const UPDATE_PROMOTION = gql`
//   mutation UpdatePromotion($id: ID!, $promotionInput: PromotionInput!) {
//     updatePromotion(id: $id, promotionInput: $promotionInput) {
//       _id
//       displayName
//       baseCode
//       isActive
//     }
//   }
// `;

// const DEACTIVATE_CAMPAIGN = gql`
//   mutation DeactivateCampaign($id: ID!, $restaurantId: ID!) {
//     deactivateCampaign(id: $id, restaurantId: $restaurantId) {
//       _id
//       isActive
//       deleted
//     }
//   }
// `;

// const DELETE_PROMOTION = gql`
//   mutation DeletePromotion($id: ID!) {
//     deletePromotion(id: $id) {
//       _id
//     }
//   }
// `;

// const DELETE_CAMPAIGN = gql`
//   mutation DeleteCampaign($id: ID!) {
//     deleteCampaign(id: $id) {
//       _id
//     }
//   }
// `;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     padding: theme.spacing(3),
//     fontFamily: 'Inter, sans-serif',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing(3),
//   },
//   tableContainer: {
//     marginTop: theme.spacing(2),
//     boxShadow: theme.shadows[3],
//     borderRadius: '8px',
//   },
//   tableHeader: {
//     backgroundColor: '#FFC107',
//   },
//   tableHeaderCell: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   tableRow: {
//     '&:hover': {
//       backgroundColor: '#FFF8E1',
//     },
//   },
//   dialogContent: {
//     minWidth: 400,
//   },
//   formField: {
//     marginBottom: theme.spacing(2),
//   },
//   dateTimeContainer: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: theme.spacing(2),
//   },
//   actions: {
//     display: 'flex',
//     gap: theme.spacing(1),
//   },
//   addButton: {
//     backgroundColor: '#FFB300',
//     color: '#fff',
//     '&:hover': {
//       backgroundColor: '#FF8F00',
//     },
//   },
//   createButton: {
//     backgroundColor: '#FFC107',
//     color: '#fff',
//     '&:hover': {
//       backgroundColor: '#FFB300',
//     },
//   },
//   cancelButton: {
//     color: '#FF8F00',
//   },
// }));

// const PromotionsPage = () => {
//   const classes = useStyles();
//   const [openMainDialog, setOpenMainDialog] = useState(false);
//   const [openTypeDialog, setOpenTypeDialog] = useState(false);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
//   const [selectedType, setSelectedType] = useState('');
//   const [selectedCampaign, setSelectedCampaign] = useState('');
//   const [editingItem, setEditingItem] = useState(null); // State for editing
//   const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
//   const [formData, setFormData] = useState({
//     baseCode: '',
//     name: '',
//     description: '',
//     mov: '',
//     maxDiscount: '',
//     value: '',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//   });

//   const restaurantId = localStorage.getItem('restaurantId');

//   // Apollo Queries
//   const { loading: loadingPromotions, data: promotionsData } = useQuery(GET_PROMOTIONS);
//   // In your PromotionsPage component, add the new mutation:
//   const [createCampaignForPromotions] = useMutation(CREATE_CAMPAIGN_FOR_PROMOTIONS, {
//     refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
//   });

//   const { loading: loadingCampaigns, data: campaignsData } = useQuery(GET_CAMPAIGNS, {
//     variables: { restaurantId }
//   });

//   // Apollo Mutations
//   const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
//     refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
//   });

//   const [createPromotion] = useMutation(CREATE_PROMOTION, {
//     refetchQueries: [{ query: GET_PROMOTIONS }]
//   });

//   const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
//     refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
//   });

//   const [updatePromotion] = useMutation(UPDATE_PROMOTION, {
//     refetchQueries: [{ query: GET_PROMOTIONS }]
//   });

//   const [deactivateCampaign] = useMutation(DEACTIVATE_CAMPAIGN);
//   const [deletePromotion] = useMutation(DELETE_PROMOTION, {
//     refetchQueries: [{ query: GET_PROMOTIONS }]
//   });
//   const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
//     refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
//   });

//   const handleTypeSelect = (value) => {
//     setSelectedType(value);
//     setOpenMainDialog(false);
//     setOpenTypeDialog(true);
//   };

//   const handleCampaignSelect = (value) => {
//     console.log(value, "setSelectedCampaign")
//     setSelectedCampaign(value);
//     setOpenTypeDialog(false);
//     setOpenDetailsDialog(true);
//   };

//   const validateCampaignLimits = (campaigns, selectedCampaign, formData) => {
//     // Check maximum campaign limit
//     if (campaigns.length >= 5) {
//       throw new Error('Maximum limit of 5 campaigns has been reached');
//     }

//     // Validate minimum values based on campaign type
//     if (selectedCampaign === 'percentage' || selectedCampaign === 'HAPPY HOUR' ||
//       (selectedCampaign === 'CHEF SPECIAL' && formData.discountType === 'percentage')) {
//       if (parseFloat(formData.value) < 30) {
//         throw new Error('Percentage discount must be at least 30%');
//       }
//     }

//     if (selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ||
//       (selectedCampaign === 'CHEF SPECIAL' && formData.discountType === 'flat')) {
//       if (parseFloat(formData.value) < 5) {
//         throw new Error('Flat discount must be at least 5 Euro');
//       }
//     }

//     // Validate minimum order value
//     if (parseFloat(formData.mov) < 500) {
//       throw new Error('Minimum order value must be at least 500');
//     }
//   };

//   const validateCampaignUpdate = (formData, campaignType) => {
//     if (!formData.name || !formData.description) {
//       throw new Error('Name and description are required');
//     }

//     if (!formData.mov || parseFloat(formData.mov) < 0) {
//       throw new Error('Minimum order value must be a positive number');
//     }

//     if (!formData.value || parseFloat(formData.value) <= 0) {
//       throw new Error('Discount value must be a positive number');
//     }

//     if (campaignType === 'percentage') {
//       if (parseFloat(formData.value) > 100) {
//         throw new Error('Percentage discount cannot exceed 100%');
//       }
//       if (!formData.maxDiscount) {
//         throw new Error('Maximum discount is required for percentage campaigns');
//       }
//     }

//     if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
//       throw new Error('Start and end dates/times are required');
//     }

//     const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
//     const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);

//     if (endDateTime <= startDateTime) {
//       throw new Error('End date/time must be after start date/time');
//     }
//   };
//   const validateFormData = () => {
//     if (!formData.name) {
//       throw new Error('Name is required');
//     }
//     if (!formData.startDate || !formData.endDate) {
//       throw new Error('Start and end dates are required');
//     }
//     if (!formData.startTime || !formData.endTime) {
//       throw new Error('Start and end times are required');
//     }
//     if (!formData.value) {
//       throw new Error('Discount value is required');
//     }

//     // Validate dates
//     const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
//     const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);

//     if (endDateTime <= startDateTime) {
//       throw new Error('End date/time must be after start date/time');
//     }

//     // Specific validation for each promotion type
//     switch (selectedCampaign) {

//       case 'HAPPY HOUR':
//         if (!formData.mov) {
//           throw new Error('Minimum order value is required for Happy Hours');
//         }
//         break;
//       case 'SPECIAL DAY':
//         if (!formData.mov) {
//           throw new Error('Minimum order value is required for Special Day');
//         }
//         break;
//       // case 'CHEF SPECIAL':
//       //   if (!formData.discountType) {
//       //     throw new Error('Please select discount type for Chef\'s Special Offer');
//       //   }
//       //   break;
//     }
//   };

//   //   const handleSubmit = async () => {
//   //     try {
//   //       validateFormData();
//   // // Inside handleSubmit function, replace the campaign update section:
//   // if (selectedType === 'campaign') {
//   //   const campaignInput = {
//   //     restaurant: restaurantId,
//   //     name: formData.name,
//   //     description: formData.description,
//   //     couponCode: formData.baseCode,
//   //     campaignType: selectedCampaign === 'flat' ? 'FLAT' : 'PERCENTAGE',
//   //     minimumOrderValue: parseFloat(formData.mov),
//   //     startDate: formData.startDate,
//   //     endDate: formData.endDate,
//   //     startTime: formData.startTime,
//   //     endTime: formData.endTime,
//   //   };

//   //   // Add discount values based on campaign type
//   //   if (selectedCampaign === 'flat') {
//   //     campaignInput.flatDiscount = parseFloat(formData.value);
//   //   } else {
//   //     campaignInput.percentageDiscount = parseFloat(formData.value);
//   //     campaignInput.maxDiscount = parseFloat(formData.maxDiscount);
//   //   }

//   //   if (editingItem) {
//   //     await updateCampaign({
//   //       variables: {
//   //         id: editingItem._id,
//   //         campaign: campaignInput
//   //       },
//   //       onCompleted: (data) => {
//   //         console.log('Campaign updated successfully:', data);
//   //         setOpenSuccessDialog(true);
//   //       },
//   //       onError: (error) => {
//   //         setErrorDialog({
//   //           open: true,
//   //           message: error.message || 'Failed to update campaign'
//   //         });
//   //       }
//   //     });
//   //   } else {
//   //     // Create new campaign logic (existing code)
//   //     await createCampaign({
//   //       variables: { campaign: campaignInput }
//   //     });
//   //   }
//   // }else {
//   //         // Get existing campaigns
//   //         const existingCampaigns = campaignsData?.restaurantCampaignsForVendorDashboard || [];

//   //         // Validate campaign limits
//   //         validateCampaignLimits(existingCampaigns, selectedCampaign, formData);

//   //         // Find the selected promotion
//   //         const selectedPromotion = promotionsData?.adminDashboardBootstrap?.promotions.find(
//   //           (promotion) => promotion.displayName.toLowerCase() === selectedCampaign.toLowerCase()
//   //         );

//   //         if (!selectedPromotion) {
//   //           throw new Error(`Promotion not found for type: ${selectedCampaign}`);
//   //         }

//   //         // Check for existing active campaign for this promotion type
//   //         const activeCampaign = existingCampaigns.find(
//   //           (campaign) => {
//   //             // Check if the campaign is for the same promotion and is active
//   //             const isForSamePromotion = campaign.promotion === selectedPromotion._id;
//   //             const isActive = campaign.isActive;
//   //             return isForSamePromotion && isActive;
//   //           }
//   //         );

//   //         // If an active campaign exists, throw a detailed error
//   //         if (activeCampaign) {
//   //           throw new Error(
//   //             `You cannot create a new ${selectedCampaign} campaign.\n\n` +
//   //             `An active campaign already exists:\n` +
//   //             `Campaign Name: "${activeCampaign.name}"\n` +
//   //             `Coupon Code: "${activeCampaign.couponCode}"\n` +
//   //             `Start Date: ${formatTimestamp(activeCampaign.startDate)}\n` +
//   //             `End Date: ${formatTimestamp(activeCampaign.endDate)}\n\n` +
//   //             `Please deactivate the existing campaign before creating a new one.`
//   //           );
//   //         }

//   //         // If no active campaign exists, show all active campaigns
//   //         if (!activeCampaign && existingCampaigns.length > 0) {
//   //           // Filter campaigns to only show those with promotion IDs
//   //           const campaignsWithPromotions = existingCampaigns.filter(campaign => campaign.promotion);

//   //           console.log('Campaigns with promotions:', campaignsWithPromotions);
//   //           setErrorDialog({
//   //             open: true,
//   //             message: `Existing campaigns with promotions:\n` +
//   //               campaignsWithPromotions.map(campaign =>
//   //                 `Campaign Name: "${campaign.name}", ` +
//   //                 `Promotion ID: "${campaign.promotion}", ` +
//   //                 `Coupon Code: "${campaign.couponCode}", ` +
//   //                 `Start Date: ${formatTimestamp(campaign.startDate)}, ` +
//   //                 `End Date: ${formatTimestamp(campaign.endDate)}\n\n` +
//   //                 `Please deactivate the existing campaign before creating a new one.`

//   //               ).join('\n'),
//   //           });
//   //           return;
//   //         }
//   //         // Format dates properly
//   //         const formatDate = (date) => {
//   //           const d = new Date(date);
//   //           return d.toISOString().split('T')[0];
//   //         };

//   //         const formatTime = (time) => {
//   //           if (!time) return '00:00';
//   //           if (time.match(/^\d{2}:\d{2}$/)) return time;
//   //           const [hours, minutes] = time.split(':');
//   //           return `${hours.padStart(2, '0')}:${minutes ? minutes.padStart(2, '0') : '00'}`;
//   //         };

//   //         const campaignInput = {
//   //           restaurant: restaurantId,
//   //           name: formData.name,
//   //           promotion: selectedPromotion._id,
//   //           startDate: formatDate(formData.startDate),
//   //           endDate: formatDate(formData.endDate),
//   //           startTime: formatTime(formData.startTime),
//   //           endTime: formatTime(formData.endTime),
//   //         };

//   //         // Handle specific promotion types
//   //         switch (selectedCampaign.toUpperCase()) {
//   //           case 'HAPPY HOUR':
//   //             if (parseFloat(formData.value) < 30) {
//   //               throw new Error('Happy Hours requires minimum 30% discount');
//   //             }
//   //             campaignInput.percentageDiscount = parseFloat(formData.value);
//   //             campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
//   //             break;

//   //           case 'SPECIAL DAY':
//   //             if (parseFloat(formData.value) < 5) {
//   //               throw new Error('Special Day requires minimum €5 flat discount');
//   //             }
//   //             campaignInput.flatDiscount = parseFloat(formData.value);
//   //             campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
//   //             break;

//   //           case 'CHEF SPECIAL':
//   //             if (formData.discountType === 'percentage') {
//   //               if (parseFloat(formData.value) < 30) {
//   //                 throw new Error("Chef's Special Offer requires minimum 30% discount");
//   //               }
//   //               campaignInput.percentageDiscount = parseFloat(formData.value);
//   //             } else {
//   //               campaignInput.flatDiscount = parseFloat(formData.value);
//   //             }
//   //             campaignInput.minimumOrderValue = 500;
//   //             break;

//   //           default:
//   //             throw new Error(`Invalid promotion type: ${selectedCampaign}`);
//   //         }

//   //         // Create the campaign
//   //         const response = await createCampaignForPromotions({
//   //           variables: {
//   //             campaignInput,
//   //           },
//   //         });

//   //         console.log('Response:', response);
//   //       }

//   //       // UNIVERSAL RESET LOGIC
//   //       resetForm();
//   //       setOpenMainDialog(false);
//   //       setOpenTypeDialog(false);
//   //       setOpenDetailsDialog(false);

//   //       // Ensure success dialog is opened
//   //       setOpenSuccessDialog(true);

//   //       // Reset all selection and editing states
//   //       setSelectedType('');
//   //       setSelectedCampaign('');
//   //       setEditingItem(null);
//   //     } catch (error) {
//   //       console.error('Error creating/updating offer:', error);

//   //       // Handle specific error for active promotion
//   //       if (error.message.includes('already has an active campaign')) {
//   //         setErrorDialog({
//   //           open: true,
//   //           message: error.message,
//   //         });
//   //       } else {
//   //         setErrorDialog({
//   //           open: true,
//   //           message: error.message || 'Failed to create campaign. Please try again.',
//   //         });
//   //       }
//   //     }
//   //   };


//   const handleSubmit = async() => {
//     try {
//       validateFormData();

//       // Add the new validation for editing
//       if (editingItem) {
//         try {
//           validateCampaignUpdate(formData, selectedCampaign);
//         } catch (error) {
//           setErrorDialog({
//             open: true,
//             message: error.message
//           });
//           return;
//         }
//       }

//       if (selectedType === 'campaign') {
//         const campaignInput = {
//           restaurant: restaurantId,
//           name: formData.name,
//           description: formData.description,
//           couponCode: formData.baseCode,
//           campaignType: selectedCampaign === 'flat' ? 'FLAT' : 'PERCENTAGE',
//           minimumOrderValue: parseFloat(formData.mov),
//           startDate: formData.startDate,
//           endDate: formData.endDate,
//           startTime: formData.startTime,
//           endTime: formData.endTime,
//         };

//         // Add discount values based on campaign type
//         if (selectedCampaign === 'flat') {
//           campaignInput.flatDiscount = parseFloat(formData.value);
//         } else {
//           campaignInput.percentageDiscount = parseFloat(formData.value);
//           campaignInput.maxDiscount = parseFloat(formData.maxDiscount);
//         }

//         if (editingItem) {
//           await updateCampaign({
//             variables: {
//               id: editingItem._id,
//               campaign: campaignInput
//             },
//             onCompleted: (data) => {
//               console.log('Campaign updated successfully:', data);
//               setOpenSuccessDialog(true);
//             },
//             onError: (error) => {
//               setErrorDialog({
//                 open: true,
//                 message: error.message || 'Failed to update campaign'
//               });
//             }
//           });
//         } else {
//           // Create new campaign logic
//           await createCampaign({
//             variables: { campaign: campaignInput }
//           });
//         }
//       } else {
//         // Get existing campaigns
//         const existingCampaigns = campaignsData?.restaurantCampaignsForVendorDashboard || [];

//         // Validate campaign limits
//         validateCampaignLimits(existingCampaigns, selectedCampaign, formData);

//         // Find the selected promotion
//         const selectedPromotion = promotionsData?.adminDashboardBootstrap?.promotions.find(
//           (promotion) => promotion.displayName.toLowerCase() === selectedCampaign.toLowerCase()
//         );

//         if (!selectedPromotion) {
//           throw new Error(`Promotion not found for type: ${selectedCampaign}`);
//         }

//         // Check for existing active campaign for this promotion type
//         const activeCampaign = existingCampaigns.find(
//           (campaign) => {
//             const isForSamePromotion = campaign.promotion === selectedPromotion._id;
//             const isActive = campaign.isActive;
//             return isForSamePromotion && isActive;
//           }
//         );

//         // If an active campaign exists, throw a detailed error
//         if (activeCampaign) {
//           throw new Error(
//             `You cannot create a new ${selectedCampaign} campaign.\n\n` +
//             `An active campaign already exists:\n` +
//             `Campaign Name: "${activeCampaign.name}"\n` +
//             `Coupon Code: "${activeCampaign.couponCode}"\n` +
//             `Start Date: ${formatTimestamp(activeCampaign.startDate)}\n` +
//             `End Date: ${formatTimestamp(activeCampaign.endDate)}\n\n` +
//             `Please deactivate the existing campaign before creating a new one.`
//           );
//         }

//         // If no active campaign exists, show all active campaigns
//         if (!activeCampaign && existingCampaigns.length > 0) {
//           const campaignsWithPromotions = existingCampaigns.filter(campaign => campaign.promotion);

//           console.log('Campaigns with promotions:', campaignsWithPromotions);
//           setErrorDialog({
//             open: true,
//             message: `Existing campaigns with promotions:\n` +
//               campaignsWithPromotions.map(campaign =>
//                 `Campaign Name: "${campaign.name}", ` +
//                 `Promotion ID: "${campaign.promotion}", ` +
//                 `Coupon Code: "${campaign.couponCode}", ` +
//                 `Start Date: ${formatTimestamp(campaign.startDate)}, ` +
//                 `End Date: ${formatTimestamp(campaign.endDate)}\n\n` +
//                 `Please deactivate the existing campaign before creating a new one.`
//               ).join('\n'),
//           });
//           return;
//         }

//         // Format dates properly
//         const formatDate = (date) => {
//           const d = new Date(date);
//           return d.toISOString().split('T')[0];
//         };

//         const formatTime = (time) => {
//           if (!time) return '00:00';
//           if (time.match(/^\d{2}:\d{2}$/)) return time;
//           const [hours, minutes] = time.split(':');
//           return `${hours.padStart(2, '0')}:${minutes ? minutes.padStart(2, '0') : '00'}`;
//         };

//         const campaignInput = {
//           restaurant: restaurantId,
//           name: formData.name,
//           promotion: selectedPromotion._id,
//           startDate: formatDate(formData.startDate),
//           endDate: formatDate(formData.endDate),
//           startTime: formatTime(formData.startTime),
//           endTime: formatTime(formData.endTime),
//         };

//         // Handle specific promotion types
//         switch (selectedCampaign.toUpperCase()) {
//           case 'HAPPY HOUR':
//             if (parseFloat(formData.value) < 30) {
//               throw new Error('Happy Hours requires minimum 30% discount');
//             }
//             campaignInput.percentageDiscount = parseFloat(formData.value);
//             campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
//             break;

//           case 'SPECIAL DAY':
//             if (parseFloat(formData.value) < 5) {
//               throw new Error('Special Day requires minimum €5 flat discount');
//             }
//             campaignInput.flatDiscount = parseFloat(formData.value);
//             campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
//             break;

//           case 'CHEF SPECIAL':
//             if (formData.discountType === 'percentage') {
//               if (parseFloat(formData.value) < 30) {
//                 throw new Error("Chef's Special Offer requires minimum 30% discount");
//               }
//               campaignInput.percentageDiscount = parseFloat(formData.value);
//             } else {
//               campaignInput.flatDiscount = parseFloat(formData.value);
//             }
//             campaignInput.minimumOrderValue = 500;
//             break;

//           default:
//             throw new Error(`Invalid promotion type: ${selectedCampaign}`);
//         }

//         // Create the campaign
//         const response = await createCampaignForPromotions({
//           variables: {
//             campaignInput,
//           },
//         });

//         console.log('Response:', response);
//       }

//       // UNIVERSAL RESET LOGIC
//       resetForm();
//       setOpenMainDialog(false);
//       setOpenTypeDialog(false);
//       setOpenDetailsDialog(false);
//       setOpenSuccessDialog(true);
//       setSelectedType('');
//       setSelectedCampaign('');
//       setEditingItem(null);

//     } catch (error) {
//       console.error('Error creating/updating offer:', error);

//       if (error.message.includes('already has an active campaign')) {
//         setErrorDialog({
//           open: true,
//           message: error.message,
//         });
//       } else {
//         setErrorDialog({
//           open: true,
//           message: error.message || 'Failed to create campaign. Please try again.',
//         });
//       }
//     }
//   };
//   const resetForm = () => {
//     setFormData({
//       baseCode: '',
//       name: '',
//       description: '',
//       mov: '',
//       maxDiscount: '',
//       value: '',
//       startDate: '',
//       startTime: '',
//       endDate: '',
//       endTime: '',
//     });
//     setSelectedType('');
//     setSelectedCampaign('');
//     setEditingItem(null); // Reset editing state
//   };

//   const toggleStatus = async(id, type, currentStatus) => {
//     try {
//       if (type === 'promotion') {
//         // Find the promotion data
//         const promotion = promotionsData.adminDashboardBootstrap.promotions.find(p => p._id === id);

//         if (!promotion) {
//           throw new Error('Promotion not found');
//         }

//         // Prepare the promotion input based on the promotionType
//         const promotionInput = {
//           baseCode: promotion.baseCode,
//           displayName: promotion.displayName,
//           description: promotion.description,
//           promotionType: promotion.promotionType,
//           minimumOrderValue: promotion.minimumOrderValue,
//           minimumMaxDiscount: promotion.minimumMaxDiscount || 0,
//           isActive: !currentStatus, // Toggle the status
//           ...(promotion.promotionType === 'FLAT' && {
//             minFlatDiscount: promotion.minFlatDiscount || 0,
//             maxFlatDiscount: promotion.maxFlatDiscount || 0,
//           }),
//           ...(promotion.promotionType === 'PERCENTAGE' && {
//             minPercentageDiscount: promotion.minPercentageDiscount || 0,
//             maxPercentageDiscount: promotion.maxPercentageDiscount || 0,
//           }),
//         };

//         // Call the updatePromotion mutation
//         await updatePromotion({
//           variables: { id, promotionInput },
//         });
//       } else if (type === 'campaign') {
//         if (currentStatus) {
//           await deactivateCampaign({
//             variables: { id, restaurantId },
//           });
//         } else {
//           // Reactivate campaign logic here (if applicable)
//         }
//       }
//     } catch (error) {
//       console.error('Error toggling status:', error);
//       alert('Failed to update status');
//     }
//   };

//   const handleEditCampaign = (campaign) => {
//     setEditingItem(campaign);
//     setSelectedType('campaign');
//     setSelectedCampaign(campaign.campaignType === 'FLAT' ? 'flat' : 'percentage');

//     setFormData({
//       baseCode: campaign.couponCode,
//       name: campaign.name,
//       description: campaign.description,
//       mov: campaign.minimumOrderValue?.toString(),
//       maxDiscount: campaign.maxDiscount?.toString() || '',
//       value: (campaign.campaignType === 'FLAT' ?
//         campaign.flatDiscount : campaign.percentageDiscount)?.toString() || '',
//       startDate: campaign.startDate?.split('T')[0] || '',
//       startTime: campaign.startTime || '',
//       endDate: campaign.endDate?.split('T')[0] || '',
//       endTime: campaign.endTime || '',
//     });

//     setOpenDetailsDialog(true);
//   };

//   const handleEditPromotion = (promotion) => {
//     setEditingItem(promotion);
//     setFormData({
//       baseCode: promotion.baseCode,
//       name: promotion.displayName,
//       description: promotion.description,
//       mov: promotion.minimumOrderValue,
//       maxDiscount: promotion.maxFlatDiscount || '',
//       value: promotion.maxPercentageDiscount || '',
//       startDate: '', // Not applicable for promotions
//       startTime: '', // Not applicable for promotions
//       endDate: '', // Not applicable for promotions
//       endTime: '', // Not applicable for promotions
//     });
//     setOpenDetailsDialog(true);
//   };

//   const handleDeleteCampaign = async(id) => {
//     if (window.confirm('Are you sure you want to delete this campaign?')) {
//       await deleteCampaign({ variables: { id } });
//     }
//   };

//   const handleDeletePromotion = async(id) => {
//     if (window.confirm('Are you sure you want to delete this promotion?')) {
//       await deletePromotion({ variables: { id } });
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     const date = new Date(parseInt(timestamp));
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loadingPromotions || loadingCampaigns) {
//     return (
//       <Box sx={{ padding: '20px' }}>
//         <p>Loading...</p>
//       </Box>
//     );
//   }


//   const ErrorDialog = ({ open, message, onClose }) => {
//     return (
//       <Dialog open={open} onClose={onClose}>
//         <DialogContent>
//           <Alert severity="error" style={{ marginBottom: '10px' }}>
//             {message}
//           </Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         background: 'linear-gradient(135deg, #FFFDE7, #FFF8E1)',
//         minHeight: '100vh',
//         padding: '20px',
//       }}
//     >
//       <Container maxWidth="lg">
//         <div className={classes.header}>
//           <Button
//             variant="contained"
//             className={classes.addButton}
//             startIcon={<AddIcon />}
//             onClick={() => setOpenMainDialog(true)}
//           >
//             Start Promotion or Campaign
//           </Button>
//         </div>

//         {/* Campaigns Table */}
//         <div style={{ marginTop: "1rem", fontWeight: "bold", fontSize: "1.9rem" }}>Campaigns Table</div>
//         <TableContainer component={Paper} className={classes.tableContainer}>
//           <Table>
//             <TableHead className={classes.tableHeader}>
//               <TableRow>
//                 <TableCell className={classes.tableHeaderCell}>Campaign Type</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Coupon Code</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Description</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Start Date</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Start Time</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>End Date</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>End Time</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>PERCENTAGE</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>FLAT</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Max Discount</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>MOV</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Status</TableCell>
//                 <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {campaignsData?.restaurantCampaignsForVendorDashboard?.map((campaign) => (
//                 <TableRow key={campaign._id} className={classes.tableRow}>
//                   {/* <TableCell>{campaign.campaignType || 'N/A'}</TableCell> */}
//                   <TableCell>
//                     {campaign.promotion ? (
//                       promotionsData?.adminDashboardBootstrap?.promotions.find(
//                         p => p._id === campaign.promotion
//                       )?.displayName || 'N/A'
//                     ) : (
//                       campaign.campaignType || 'N/A'
//                     )}
//                   </TableCell>
//                   <TableCell>{campaign.couponCode || 'N/A'}</TableCell>
//                   <TableCell>{campaign.description || 'N/A'}</TableCell>
//                   <TableCell>{campaign.startDate ? formatTimestamp(campaign.startDate) : 'N/A'}</TableCell>
//                   <TableCell>{campaign.startTime || 'N/A'}</TableCell>
//                   <TableCell>{campaign.endDate ? formatTimestamp(campaign.endDate) : 'N/A'}</TableCell>
//                   <TableCell>{campaign.endTime || 'N/A'}</TableCell>
//                   <TableCell>{campaign.percentageDiscount ? `${campaign.percentageDiscount}%` : 'N/A'}</TableCell>
//                   <TableCell>{campaign.flatDiscount ? `${campaign.flatDiscount}` : 'N/A'}</TableCell>
//                   <TableCell>€{campaign.maxDiscount || 'N/A'}</TableCell>
//                   <TableCell>€{campaign.minimumOrderValue || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={campaign.isActive}
//                       onChange={() => toggleStatus(campaign._id, 'campaign', campaign.isActive)}
//                       color="primary"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <div className={classes.actions}>
//                       <IconButton size="small" color="primary" onClick={() => handleEditCampaign(campaign)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton size="small" color="secondary" onClick={() => handleDeleteCampaign(campaign._id)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Main Dialog */}
//         <Dialog open={openMainDialog} onClose={() => setOpenMainDialog(false)} maxWidth="sm" fullWidth>
//           <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
//             Select Type
//           </p>
//           <DialogContent className={classes.dialogContent}>
//             <FormControl fullWidth className={classes.formField}>
//               <InputLabel style={{ color: '#000' }}>Select type</InputLabel>
//               <Select
//                 value={selectedType}
//                 onChange={(e) => handleTypeSelect(e.target.value)}
//                 style={{ color: '#000' }}
//               >
//                 <MenuItem value="campaign">Campaign</MenuItem>
//                 <MenuItem value="promotion">Promotion</MenuItem>
//               </Select>
//             </FormControl>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenMainDialog(false)} className={classes.cancelButton}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 if (selectedType) {
//                   setOpenMainDialog(false);
//                   setOpenTypeDialog(true);
//                 } else {
//                   alert('Please select a type.');
//                 }
//               }}
//               className={classes.createButton}
//             >
//               Next
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Type Dialog */}
//         {/* Type Dialog */}
//         <Dialog open={openTypeDialog} onClose={() => setOpenTypeDialog(false)} maxWidth="sm" fullWidth>
//           <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
//             {selectedType === 'campaign' ? 'Select Campaign Type' : 'Select Promotion Type'}
//           </p>
//           <DialogContent className={classes.dialogContent}>
//             <FormControl fullWidth className={classes.formField}>
//               <InputLabel style={{ color: '#000' }}>Select type</InputLabel>
//               <Select
//                 value={selectedCampaign}
//                 onChange={(e) => handleCampaignSelect(e.target.value)}
//                 style={{ color: '#000' }}
//               >
//                 {selectedType === 'campaign' ? (
//                   // Campaign types
//                   [
//                     <MenuItem key="percentage" value="percentage">% Off</MenuItem>,
//                     <MenuItem key="flat" value="flat">Flat Off</MenuItem>,
//                   ]
//                 ) : (
//                   // Filter only specific promotion types from API response
//                   promotionsData?.adminDashboardBootstrap?.promotions
//                     .filter(promotion =>
//                       ['HAPPY HOUR', 'SPECIAL DAY', 'CHEF SPECIAL'].includes(promotion.displayName)
//                     )
//                     .map(promotion => (
//                       <MenuItem
//                         key={promotion._id}
//                         value={promotion.displayName}
//                       >
//                         {promotion.displayName}
//                       </MenuItem>
//                     ))
//                 )}
//               </Select>
//             </FormControl>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => {
//                 setOpenTypeDialog(false);
//                 setOpenMainDialog(true);
//               }}
//               className={classes.cancelButton}
//             >
//               Previous
//             </Button>
//             <Button
//               onClick={() => {
//                 if (selectedCampaign) {
//                   setOpenTypeDialog(false);
//                   setOpenDetailsDialog(true);
//                 } else {
//                   alert('Please select a type.');
//                 }
//               }}
//               className={classes.createButton}
//             >
//               Next
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Details Dialog */}
//         <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
//           <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
//             Enter Offer Details
//           </p>
//           <DialogContent className={classes.dialogContent}>
//             <Box className={classes.formField}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </Box>
//             <Box className={classes.formField}>
//               <TextField
//                 fullWidth
//                 label="Base Code"
//                 value={formData.baseCode}
//                 onChange={(e) => setFormData({ ...formData, baseCode: e.target.value })}
//               />
//             </Box>
//             <Box className={classes.formField}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 multiline
//                 rows={2}
//               />
//             </Box>

//             <TextField
//               fullWidth
//               label="Minimum Order Value"
//               type="number"
//               value={formData.mov}
//               onChange={(e) => setFormData({ ...formData, mov: e.target.value })}
//               InputProps={{
//                 inputProps: {
//                   min: 500 // Set minimum value to 500
//                 }
//               }}
//               helperText="Minimum order value must be at least 500"
//             />

//             <TextField
//               fullWidth
//               label={selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 'Flat Value' : 'Percentage'}
//               type="number"
//               value={formData.value}
//               onChange={(e) => setFormData({ ...formData, value: e.target.value })}
//               InputProps={{
//                 inputProps: {
//                   min: selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 5 : 30
//                 }
//               }}
//               helperText={`Minimum ${selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 'flat discount is 5 Euro' : 'percentage is 30%'}`}
//             />


//             {selectedCampaign !== 'HAPPY HOUR' && selectedCampaign !== 'CHEF SPECIAL' && (
//               <Box className={classes.formField}>
//                 <TextField
//                   fullWidth
//                   label="Maximum Discount"
//                   type="number"
//                   value={formData.maxDiscount}
//                   onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
//                   disabled={selectedCampaign === 'flat'} // Disable for flat campaign type
//                 />
//               </Box>
//             )}
//             <>
//               <Box className={classes.dateTimeContainer}>
//                 <TextField
//                   label="Start Date"
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                   label="Start Time"
//                   type="time"
//                   value={formData.startTime}
//                   onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Box>
//               <Box className={classes.dateTimeContainer}>
//                 <TextField
//                   label="End Date"
//                   type="date"
//                   value={formData.endDate}
//                   onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                   label="End Time"
//                   type="time"
//                   value={formData.endTime}
//                   onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Box>
//             </>

//             {/* {selectedType === 'promotion' && selectedCampaign !== 'SPECIAL DAY' && (
//               <Box className={classes.formField}>
//                 <TextField
//                   fullWidth
//                   label="Minimum Max Discount"
//                   type="number"
//                   value={formData.minimumMaxDiscount}
//                   onChange={(e) => setFormData({ ...formData, minimumMaxDiscount: e.target.value })}
//                   InputProps={{
//                     inputProps: {
//                       min: 0
//                     }
//                   }}
//                 />
//               </Box>
//             )} */}

//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => {
//                 setOpenDetailsDialog(false);
//                 setOpenTypeDialog(true);
//               }}
//               className={classes.cancelButton}
//             >
//               Previous
//             </Button>
//             <Button onClick={handleSubmit} className={classes.createButton}>
//               {editingItem ? 'Update Offer' : 'Create Offer'}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Success Dialog */}
//         <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
//           <DialogContent>
//             <div style={{ color: '#4CAF50', textAlign: 'center' }}>
//               Offer has been set up successfully!
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add the Error Dialog here */}
//         <ErrorDialog
//           open={errorDialog.open}
//           message={errorDialog.message}
//           onClose={() => setErrorDialog({ open: false, message: '' })}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default PromotionsPage;



import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  IconButton,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import { Container, display } from '@mui/system';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@material-ui/icons';
import { Alert } from '@mui/material';

// GraphQL Queries and Mutations
const GET_PROMOTIONS = gql`
  query Promotions {
    adminDashboardBootstrap {
      promotions {
        _id
        baseCode
        displayName
        createdAt
        description
        isActive
        maxFlatDiscount
        maxPercentageDiscount
        minFlatDiscount
        minPercentageDiscount
        minimumOrderValue
        promotionType
        updatedAt
        minimumMaxDiscount
      }
    }
  }
`;

const GET_CAMPAIGNS = gql`
  query RestaurantCampaignsForVendorDashboard($restaurantId: ID!) {
    restaurantCampaignsForVendorDashboard(restaurantId: $restaurantId) {
      _id
      name
      description
      couponCode
      campaignType
      minimumOrderValue
      percentageDiscount
      maxDiscount
      flatDiscount
      startDate
      endDate
      startTime
      endTime
      isActive
      createdBy
      modifiedBy
      createdAt
      updatedAt
      promotion
      restaurant
    }
  }
`;

const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($campaign: CampaignInput!) {
    createCampaign(campaign: $campaign) {
      _id
      name
      couponCode
      campaignType
      percentageDiscount
      flatDiscount
      maxDiscount
      minimumOrderValue
      startDate
      endDate
      startTime
      endTime
      isActive
      createdBy
      modifiedBy
      createdAt
    }
  }
`;

const CREATE_PROMOTION = gql`
  mutation CreatePromotion($promotionInput: PromotionInput!) {
    createPromotion(promotionInput: $promotionInput) {
      _id
      displayName
      baseCode
      promotionType
      minPercentageDiscount
      maxPercentageDiscount
      minFlatDiscount
      maxFlatDiscount
      minimumOrderValue
      minimumMaxDiscount
      isActive
    }
  }
`;

const CREATE_CAMPAIGN_FOR_PROMOTIONS = gql`
  mutation CreateCampaignForPromotions($campaignInput: CampaignInputForPromotion!) {
    createCampaignForPromotions(campaignInput: $campaignInput) {
      _id
      name
      promotion
      percentageDiscount
      flatDiscount
      minimumOrderValue
      startDate
      endDate
      startTime
      endTime
    }
  }
`;

const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $campaign: CampaignInput!) {
    updateCampaign(id: $id, campaign: $campaign) {
      _id
      name
      description
      couponCode
      campaignType
      flatDiscount
      percentageDiscount
      maxDiscount
      minimumOrderValue
      startDate
      endDate
      startTime
      endTime
      isActive
      modifiedBy
      updatedAt
    }
  }
`;

const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: ID!, $promotionInput: PromotionInput!) {
    updatePromotion(id: $id, promotionInput: $promotionInput) {
      _id
      displayName
      baseCode
      isActive
    }
  }
`;

const DEACTIVATE_CAMPAIGN = gql`
  mutation toggleCampaignActiveStatus($id: ID!, $restaurantId: ID!) {
    toggleCampaignActiveStatus(id: $id, restaurantId: $restaurantId) {
      _id
      isActive
      deleted
    }
  }
`;

const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id) {
      _id
    }
  }
`;

const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      _id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    boxShadow: theme.shadows[3],
    borderRadius: '8px',
  },
  tableHeader: {
    backgroundColor: '#FFC107',
  },
  tableHeaderCell: {
    color: 'black',
    fontWeight: 'bold',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#FFF8E1',
    },
  },
  dialogContent: {
    minWidth: 400,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  dateTimeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  addButton: {
    backgroundColor: '#FFB300',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#FF8F00',
    },
  },
  createButton: {
    backgroundColor: '#FFC107',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#FFB300',
    },
  },
  cancelButton: {
    color: '#FF8F00',
  },
}));

const PromotionsPage = () => {
  const classes = useStyles();
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [editingItem, setEditingItem] = useState(null); // State for editing
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [formData, setFormData] = useState({
    baseCode: '',
    name: '',
    description: '',
    mov: '',
    maxDiscount: '',
    value: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const restaurantId = localStorage.getItem('restaurantId');

  // Apollo Queries
  const { loading: loadingPromotions, data: promotionsData } = useQuery(GET_PROMOTIONS);
  const [createCampaignForPromotions] = useMutation(CREATE_CAMPAIGN_FOR_PROMOTIONS, {
    refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
  });

  const { loading: loadingCampaigns, data: campaignsData } = useQuery(GET_CAMPAIGNS, {
    variables: { restaurantId }
  });

  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
  });

  const [createPromotion] = useMutation(CREATE_PROMOTION, {
    refetchQueries: [{ query: GET_PROMOTIONS }]
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
  });

  const [updatePromotion] = useMutation(UPDATE_PROMOTION, {
    refetchQueries: [{ query: GET_PROMOTIONS }]
  });

  const [deactivateCampaign] = useMutation(DEACTIVATE_CAMPAIGN);
  const [deletePromotion] = useMutation(DELETE_PROMOTION, {
    refetchQueries: [{ query: GET_PROMOTIONS }]
  });
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS, variables: { restaurantId } }]
  });

  const handleTypeSelect = (value) => {
    setSelectedType(value);
    setOpenMainDialog(false);
    setOpenTypeDialog(true);
  };

  const handleCampaignSelect = (value) => {
    console.log(value, "setSelectedCampaign")
    setSelectedCampaign(value);
    setOpenTypeDialog(false);
    setOpenDetailsDialog(true);
  };

  const validateCampaignLimits = (campaigns, selectedCampaign, formData) => {
    // Check maximum campaign limit
    if (campaigns.length >= 5) {
      throw new Error('Maximum limit of 5 campaigns has been reached');
    }

    if (selectedCampaign === 'percentage' || selectedCampaign === 'HAPPY HOUR' ||
      (selectedCampaign === 'CHEF SPECIAL' && formData.discountType === 'percentage')) {
      if (parseFloat(formData.value) < 30) {
        throw new Error('Percentage discount must be at least 30%');
      }
    }

    if (selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ||
      (selectedCampaign === 'CHEF SPECIAL' && formData.discountType === 'flat')) {
      if (parseFloat(formData.value) < 5) {
        throw new Error('Flat discount must be at least 5 Euro');
      }
    }

    // Validate minimum order value
    // if (parseFloat(formData.mov) < 500) {
    //   throw new Error('Minimum order value must be at least 500');
    // }
  };

  const validateCampaignUpdate = (formData, campaignType) => {

    // if (!formData.mov || parseFloat(formData.mov) < 500) {
    //   throw new Error('Minimum order value must be at least 500');
    // }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      throw new Error('Discount value must be a positive number');
    }

    if (campaignType === 'percentage') {
      if (parseFloat(formData.value) < 30) {
        throw new Error('Percentage discount must be at least 30%');
      }
      if (parseFloat(formData.value) > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      if (!formData.maxDiscount) {
        throw new Error('Maximum discount is required for percentage campaigns');
      }
    } else if (campaignType === 'flat') {
      if (parseFloat(formData.value) < 5) {
        throw new Error('Flat discount must be at least 5 Euro');
      }
    }

    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      throw new Error('Start and end dates/times are required');
    }

    const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      throw new Error('End date/time must be after start date/time');
    }
  };


  const validateFormData = () => {

    if (!formData.startDate || !formData.endDate) {
      throw new Error('Start and end dates are required');
    }
    if (!formData.startTime || !formData.endTime) {
      throw new Error('Start and end times are required');
    }
    if (!formData.value) {
      throw new Error('Discount value is required');
    }

    // Validate dates
    const startDateTime = new Date(`${formData.startDate} ${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate} ${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      throw new Error('End date/time must be after start date/time');
    }

    // Specific validation for campaign types
    if (selectedCampaign === 'percentage') {
      if (parseFloat(formData.value) < 30) {
        throw new Error('Percentage discount must be at least 30%');
      }
      if (parseFloat(formData.value) > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      if (!formData.maxDiscount) {
        throw new Error('Maximum discount is required for percentage campaigns');
      }
    } else if (selectedCampaign === 'flat') {
      if (parseFloat(formData.value) < 5) {
        throw new Error('Flat discount must be at least 5 Euro');
      }
    }

    // Validate minimum order value
    // if (!formData.mov || parseFloat(formData.mov) < 500) {
    //   throw new Error('Minimum order value must be at least 500');
    // }
  };
  const handleSubmit = async() => {
    try {
      // Validate form data for both creating and editing
      validateFormData();

      if (editingItem) {
        // Additional validation for editing
        validateCampaignUpdate(formData, selectedCampaign);
      }

      if (selectedType === 'campaign') {
        // Prepare the campaign input
        const campaignInput = {
          restaurant: restaurantId,
          couponCode: formData.baseCode,
          campaignType: selectedCampaign === 'flat' ? 'FLAT' : 'PERCENTAGE',
          minimumOrderValue: parseFloat(formData.mov),
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
        };

        // Add discount values based on campaign type
        if (selectedCampaign === 'flat') {
          campaignInput.flatDiscount = parseFloat(formData.value);
        } else {
          campaignInput.percentageDiscount = parseFloat(formData.value);
          campaignInput.maxDiscount = parseFloat(formData.maxDiscount);
        }

        if (editingItem) {
          // Update campaign
          await updateCampaign({
            variables: {
              id: editingItem._id,
              campaign: campaignInput,
            },
            onCompleted: (data) => {
              console.log('Campaign updated successfully:', data);

              // Reset form and close dialogs after successful edit
              resetForm();
              setOpenDetailsDialog(false);
              setOpenSuccessDialog(true);
            },
            onError: (error) => {
              setErrorDialog({
                open: true,
                message: error.message || 'Failed to update campaign',
              });
            },
          });
        } else {
          // Create new campaign
          await createCampaign({
            variables: { campaign: campaignInput },
            onCompleted: (data) => {
              console.log('Campaign created successfully:', data);

              // Reset form and close dialogs after successful creation
              resetForm();
              setOpenDetailsDialog(false);
              setOpenSuccessDialog(true);
            },
            onError: (error) => {
              setErrorDialog({
                open: true,
                message: error.message || 'Failed to create campaign',
              });
            },
          });
        }
      } else {
        // Handle promotion logic (if applicable)
        const existingCampaigns = campaignsData?.restaurantCampaignsForVendorDashboard || [];

        // Validate campaign limits
        validateCampaignLimits(existingCampaigns, selectedCampaign, formData);

        // Find the selected promotion
        const selectedPromotion = promotionsData?.adminDashboardBootstrap?.promotions.find(
          (promotion) => promotion.displayName.toLowerCase() === selectedCampaign.toLowerCase()
        );

        if (!selectedPromotion) {
          throw new Error(`Promotion not found for type: ${selectedCampaign}`);
        }

        // Check for existing active campaign for this promotion type
        const activeCampaign = existingCampaigns.find(
          (campaign) => {
            const isForSamePromotion = campaign.promotion === selectedPromotion._id;
            const isActive = campaign.isActive;
            return isForSamePromotion && isActive;
          }
        );

        if (activeCampaign) {
          throw new Error(
            `You cannot create a new ${selectedCampaign} campaign.\n\n` +
            `An active campaign already exists:\n` +
            `Campaign Name: "${activeCampaign.name}"\n` +
            `Coupon Code: "${activeCampaign.couponCode}"\n` +
            `Start Date: ${formatTimestamp(activeCampaign.startDate)}\n` +
            `End Date: ${formatTimestamp(activeCampaign.endDate)}\n\n` +
            `Please deactivate the existing campaign before creating a new one.`
          );
        }

        // Format dates properly
        const formatDate = (date) => {
          const d = new Date(date);
          return d.toISOString().split('T')[0];
        };

        const formatTime = (time) => {
          if (!time) return '00:00';
          if (time.match(/^\d{2}:\d{2}$/)) return time;
          const [hours, minutes] = time.split(':');
          return `${hours.padStart(2, '0')}:${minutes ? minutes.padStart(2, '0') : '00'}`;
        };

        const campaignInput = {
          restaurant: restaurantId,
          promotion: selectedPromotion._id,
          startDate: formatDate(formData.startDate),
          endDate: formatDate(formData.endDate),
          startTime: formatTime(formData.startTime),
          endTime: formatTime(formData.endTime),
        };

        // Handle specific promotion types
        switch (selectedCampaign.toUpperCase()) {
          case 'HAPPY HOUR':
            if (parseFloat(formData.value) < 30) {
              throw new Error('Happy Hours requires minimum 30% discount');
            }
            campaignInput.percentageDiscount = parseFloat(formData.value);
            campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
            break;

          case 'SPECIAL DAY':
            if (parseFloat(formData.value) < 5) {
              throw new Error('Special Day requires minimum €5 flat discount');
            }
            campaignInput.flatDiscount = parseFloat(formData.value);
            campaignInput.minimumOrderValue = parseFloat(formData.mov) || 0;
            break;

          case 'CHEF SPECIAL':
            if (formData.discountType === 'percentage') {
              if (parseFloat(formData.value) < 30) {
                throw new Error("Chef's Special Offer requires minimum 30% discount");
              }
              campaignInput.percentageDiscount = parseFloat(formData.value);
            } else {
              campaignInput.flatDiscount = parseFloat(formData.value);
            }
            campaignInput.minimumOrderValue = 500;
            break;

          default:
            throw new Error(`Invalid promotion type: ${selectedCampaign}`);
        }

        // Create the campaign
        const response = await createCampaignForPromotions({
          variables: {
            campaignInput,
          },
        });

        console.log('Response:', response);

        // Reset form and close dialogs after successful creation
        resetForm();
        setOpenDetailsDialog(false);
        setOpenSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error creating/updating offer:', error);

      setErrorDialog({
        open: true,
        message: error.message || 'Failed to create/update campaign. Please try again.',
      });
    }
  };


  const resetForm = () => {
    setFormData({
      baseCode: '',
      name: '',
      description: '',
      mov: '',
      maxDiscount: '',
      value: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
    setSelectedType('');
    setSelectedCampaign('');
    setEditingItem(null); // Reset editing state
  };

  // const toggleStatus = async(id, type, currentStatus) => {
  //   try {
  //     if (type === 'promotion') {
  //       // Find the promotion data
  //       const promotion = promotionsData.adminDashboardBootstrap.promotions.find(p => p._id === id);

  //       if (!promotion) {
  //         throw new Error('Promotion not found');
  //       }

  //       // Prepare the promotion input based on the promotionType
  //       const promotionInput = {
  //         baseCode: promotion.baseCode,
  //         displayName: promotion.displayName,
  //         description: promotion.description,
  //         promotionType: promotion.promotionType,
  //         minimumOrderValue: promotion.minimumOrderValue,
  //         minimumMaxDiscount: promotion.minimumMaxDiscount || 0,
  //         isActive: !currentStatus, // Toggle the status
  //         ...(promotion.promotionType === 'FLAT' && {
  //           minFlatDiscount: promotion.minFlatDiscount || 0,
  //           maxFlatDiscount: promotion.maxFlatDiscount || 0,
  //         }),
  //         ...(promotion.promotionType === 'PERCENTAGE' && {
  //           minPercentageDiscount: promotion.minPercentageDiscount || 0,
  //           maxPercentageDiscount: promotion.maxPercentageDiscount || 0,
  //         }),
  //       };

  //       // Call the updatePromotion mutation
  //       await updatePromotion({
  //         variables: { id, promotionInput },
  //       });
  //     } else if (type === 'campaign') {
  //       if (currentStatus) {
  //         await deactivateCampaign({
  //           variables: { id, restaurantId },
  //         });
  //       } else {
  //         // Reactivate campaign logic here (if applicable)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error toggling status:', error);
  //     alert('Failed to update status');
  //   }
  // };
  const toggleStatus = async(id, type, currentStatus) => {
    try {
      if (type === 'promotion') {
        // Promotion toggle logic remains the same
        const promotion = promotionsData.adminDashboardBootstrap.promotions.find(p => p._id === id);

        if (!promotion) {
          throw new Error('Promotion not found');
        }

        const promotionInput = {
          baseCode: promotion.baseCode,
          displayName: promotion.displayName,
          description: promotion.description,
          promotionType: promotion.promotionType,
          minimumOrderValue: promotion.minimumOrderValue,
          minimumMaxDiscount: promotion.minimumMaxDiscount || 0,
          isActive: !currentStatus,
          ...(promotion.promotionType === 'FLAT' && {
            minFlatDiscount: promotion.minFlatDiscount || 0,
            maxFlatDiscount: promotion.maxFlatDiscount || 0,
          }),
          ...(promotion.promotionType === 'PERCENTAGE' && {
            minPercentageDiscount: promotion.minPercentageDiscount || 0,
            maxPercentageDiscount: promotion.maxPercentageDiscount || 0,
          }),
        };

        await updatePromotion({
          variables: { id, promotionInput },
        });
      } else if (type === 'campaign') {
        // Use the same deactivateCampaign mutation for both activation and deactivation
        await deactivateCampaign({
          variables: {
            id,
            restaurantId
          },
          update: (cache, { data }) => {
            // Update the cache to reflect the new status
            const updatedCampaign = data?.toggleCampaignActiveStatus;
            if (updatedCampaign) {
              const existingData = cache.readQuery({
                query: GET_CAMPAIGNS,
                variables: { restaurantId }
              });

              if (existingData) {
                const updatedCampaigns = existingData.restaurantCampaignsForVendorDashboard.map(campaign =>
                  campaign._id === id ? {
                    ...campaign,
                    isActive: !currentStatus
                  } : campaign
                );

                cache.writeQuery({
                  query: GET_CAMPAIGNS,
                  variables: { restaurantId },
                  data: {
                    restaurantCampaignsForVendorDashboard: updatedCampaigns
                  }
                });
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setErrorDialog({
        open: true,
        message: error.message || 'Failed to update status'
      });
    }
  };
  const handleEditCampaign = (campaign) => {
    console.log('Editing campaign:', campaign); // Debugging

    const formatDate = (timestamp) => {
      if (!timestamp) return ''; // Handle null or undefined timestamps
      const parsedDate = new Date(parseInt(timestamp)); // Convert timestamp to Date object
      if (isNaN(parsedDate.getTime())) return ''; // Handle invalid timestamps
      return parsedDate.toISOString().split('T')[0]; // Format as yyyy-MM-dd
    };

    setEditingItem(campaign);
    setSelectedType('campaign');
    setSelectedCampaign(campaign.campaignType === 'FLAT' ? 'flat' : 'percentage');

    setFormData({
      baseCode: campaign.couponCode,
      name: campaign.name,
      description: campaign.description,
      mov: campaign.minimumOrderValue?.toString(),
      maxDiscount: campaign.maxDiscount?.toString() || '',
      value: (campaign.campaignType === 'FLAT'
        ? campaign.flatDiscount
        : campaign.percentageDiscount
      )?.toString() || '',
      startDate: formatDate(campaign.startDate), // Convert timestamp to date
      startTime: campaign.startTime || '',
      endDate: formatDate(campaign.endDate), // Convert timestamp to date
      endTime: campaign.endTime || '',
    });

    setOpenDetailsDialog(true); // Open the dialog
  };

  const handleEditPromotion = (promotion) => {
    setEditingItem(promotion);
    setFormData({
      baseCode: promotion.baseCode,
      name: promotion.displayName,
      description: promotion.description,
      mov: promotion.minimumOrderValue,
      maxDiscount: promotion.maxFlatDiscount || '',
      value: promotion.maxPercentageDiscount || '',
      startDate: '', // Not applicable for promotions
      startTime: '', // Not applicable for promotions
      endDate: '', // Not applicable for promotions
      endTime: '', // Not applicable for promotions
    });
    setOpenDetailsDialog(true);
  };

  const handleDeleteCampaign = async(id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await deleteCampaign({ variables: { id } });
    }
  };

  const handleDeletePromotion = async(id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      await deletePromotion({ variables: { id } });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingPromotions || loadingCampaigns) {
    return (
      <Box sx={{ padding: '20px' }}>
        <p>Loading...</p>
      </Box>
    );
  }


  const ErrorDialog = ({ open, message, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Alert severity="error" style={{ marginBottom: '10px' }}>
            {message}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FFFDE7, #FFF8E1)',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Button
            variant="contained"
            className={classes.addButton}
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm(); // Reset form data
              setOpenMainDialog(true); // Open the main dialog
            }}
          >
            Start Promotion or Campaign
          </Button>
        </div>

        {/* Campaigns Table */}
        <div style={{ marginTop: "1rem", fontWeight: "bold", fontSize: "1.9rem" }}>Campaigns Table</div>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>Campaign Type</TableCell>
                <TableCell className={classes.tableHeaderCell}>Coupon Code</TableCell>
                <TableCell className={classes.tableHeaderCell}>Description</TableCell>
                <TableCell className={classes.tableHeaderCell}>Start Date</TableCell>
                <TableCell className={classes.tableHeaderCell}>Start Time</TableCell>
                <TableCell className={classes.tableHeaderCell}>End Date</TableCell>
                <TableCell className={classes.tableHeaderCell}>End Time</TableCell>
                <TableCell className={classes.tableHeaderCell}>PERCENTAGE</TableCell>
                <TableCell className={classes.tableHeaderCell}>FLAT</TableCell>
                <TableCell className={classes.tableHeaderCell}>Max Discount</TableCell>
                <TableCell className={classes.tableHeaderCell}>MOV</TableCell>
                <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignsData?.restaurantCampaignsForVendorDashboard?.map((campaign) => (
                <TableRow key={campaign._id} className={classes.tableRow}>
                  {/* <TableCell>{campaign.campaignType || 'N/A'}</TableCell> */}
                  <TableCell>
                    {campaign.promotion ? (
                      promotionsData?.adminDashboardBootstrap?.promotions.find(
                        p => p._id === campaign.promotion
                      )?.displayName || 'N/A'
                    ) : (
                      campaign.campaignType || 'N/A'
                    )}
                  </TableCell>
                  <TableCell>{campaign.couponCode || 'N/A'}</TableCell>
                  <TableCell>{campaign.description || 'N/A'}</TableCell>
                  <TableCell>{campaign.startDate ? formatTimestamp(campaign.startDate) : 'N/A'}</TableCell>
                  <TableCell>{campaign.startTime || 'N/A'}</TableCell>
                  <TableCell>{campaign.endDate ? formatTimestamp(campaign.endDate) : 'N/A'}</TableCell>
                  <TableCell>{campaign.endTime || 'N/A'}</TableCell>
                  <TableCell>{campaign.percentageDiscount ? `${campaign.percentageDiscount}%` : 'N/A'}</TableCell>
                  <TableCell>{campaign.flatDiscount ? `${campaign.flatDiscount}` : 'N/A'}</TableCell>
                  <TableCell>€{campaign.maxDiscount || 'N/A'}</TableCell>
                  <TableCell>€{campaign.minimumOrderValue || 'N/A'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={campaign.isActive}
                      onChange={() => toggleStatus(campaign._id, 'campaign', campaign.isActive)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className={classes.actions}>
                      <IconButton size="small" color="primary" onClick={() => handleEditCampaign(campaign)}>
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton size="small" color="secondary" onClick={() => handleDeleteCampaign(campaign._id)}>
                        <DeleteIcon />
                      </IconButton> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Main Dialog */}
        <Dialog open={openMainDialog} onClose={() => setOpenMainDialog(false)} maxWidth="sm" fullWidth>
          <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
            Select Type
          </p>
          <DialogContent className={classes.dialogContent}>
            <FormControl fullWidth className={classes.formField}>
              <InputLabel style={{ color: '#000' }}>Select type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => handleTypeSelect(e.target.value)}
                style={{ color: '#000' }}
              >
                <MenuItem value="campaign">Campaign</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMainDialog(false)} className={classes.cancelButton}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedType) {
                  setOpenMainDialog(false);
                  setOpenTypeDialog(true);
                } else {
                  alert('Please select a type.');
                }
              }}
              className={classes.createButton}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>

        {/* Type Dialog */}
        <Dialog open={openTypeDialog} onClose={() => setOpenTypeDialog(false)} maxWidth="sm" fullWidth>
          <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
            {selectedType === 'campaign' ? 'Select Campaign Type' : 'Select Promotion Type'}
          </p>
          <DialogContent className={classes.dialogContent}>
            <FormControl fullWidth className={classes.formField}>
              <InputLabel style={{ color: '#000' }}>Select type</InputLabel>
              <Select
                value={selectedCampaign}
                onChange={(e) => handleCampaignSelect(e.target.value)}
                style={{ color: '#000' }}
              >
                {selectedType === 'campaign' ? (
                  // Campaign types
                  [
                    <MenuItem key="percentage" value="percentage">% Off</MenuItem>,
                    <MenuItem key="flat" value="flat">Flat Off</MenuItem>,
                  ]
                ) : (
                  // Filter only specific promotion types from API response
                  promotionsData?.adminDashboardBootstrap?.promotions
                    .filter(promotion =>
                      ['HAPPY HOUR', 'SPECIAL DAY', 'CHEF SPECIAL'].includes(promotion.displayName)
                    )
                    .map(promotion => (
                      <MenuItem
                        key={promotion._id}
                        value={promotion.displayName}
                      >
                        {promotion.displayName}
                      </MenuItem>
                    ))
                )}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenTypeDialog(false);
                setOpenMainDialog(true);
              }}
              className={classes.cancelButton}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (selectedCampaign) {
                  setOpenTypeDialog(false);
                  setOpenDetailsDialog(true);
                } else {
                  alert('Please select a type.');
                }
              }}
              className={classes.createButton}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
          <p style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
            Enter Offer Details
          </p>
          <DialogContent className={classes.dialogContent}>
            {selectedType === 'campaign' && (
              <Box className={classes.formField}>
                <TextField
                  fullWidth
                  label="Base Code"
                  value={formData.baseCode}
                  onChange={(e) => setFormData({ ...formData, baseCode: e.target.value })}
                />
              </Box>
            )}
            
              <TextField
              fullWidth
              label="Minimum Order Value"
              type="number"
              value={formData.mov}
              onChange={(e) => setFormData({ ...formData, mov: e.target.value })}
              InputProps={{

              }}
              // helperText="Minimum order value must be at least 500"
            />


            <TextField
              fullWidth
              label={selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 'Flat Value' : 'Percentage'}
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              InputProps={{
                inputProps: {
                  min: selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 5 : 30
                }
              }}
              helperText={`Minimum ${selectedCampaign === 'flat' || selectedCampaign === 'SPECIAL DAY' ? 'flat discount is 5 Euro' : 'percentage is 30%'}`}
            />


            {selectedCampaign !== 'HAPPY HOUR' && selectedCampaign !== 'CHEF SPECIAL' && (
              <Box className={classes.formField}>
                <TextField
                  fullWidth
                  label="Maximum Discount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  disabled={selectedCampaign === 'flat'} // Disable for flat campaign type
                />
              </Box>
            )}
            <>
              <Box className={classes.dateTimeContainer}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate} // Bind to formData.startDate
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Start Time"
                  type="time"
                  value={formData.startTime} // Bind to formData.startTime
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box className={classes.dateTimeContainer}>
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate} // Bind to formData.endDate
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={formData.endTime} // Bind to formData.endTime
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </>

          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDetailsDialog(false);
                setOpenTypeDialog(true);
              }}
              className={classes.cancelButton}
            >
              Previous
            </Button>
            <Button onClick={handleSubmit} className={classes.createButton}>
              {editingItem ? 'Update Offer' : 'Create Offer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
          <DialogContent>
            <div style={{ color: '#4CAF50', textAlign: 'center' }}>
              Offer has been set up successfully!
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add the Error Dialog here */}
        <ErrorDialog
          open={errorDialog.open}
          message={errorDialog.message}
          onClose={() => setErrorDialog({ open: false, message: '' })}
        />
      </Container>
    </Box>
  );
};

export default PromotionsPage;