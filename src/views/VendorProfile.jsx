import React, { useState, useRef, useMemo, useEffect } from 'react'
import { validateFunc } from '../constraints/constraints'
import { withTranslation, useTranslation } from 'react-i18next'
import Header from '../components/Headers/Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getRestaurantProfile, editRestaurant, getCuisines } from '../apollo'
import ConfigurableValues from '../config/constants'
import useStyles from '../components/Restaurant/styles'
import useGlobalStyles from '../utils/globalStyles'
import defaultLogo from '../assets/img/defaultLogo.png'
import {
  Box,
  Alert,
  Typography,
  Button,
  Input,
  Grid,
  Checkbox,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Paper, Tabs, Tab, Card, CardContent, Chip
} from '@mui/material'
import { Container, display } from '@mui/system'
import CustomLoader from '../components/Loader/CustomLoader'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { SHOP_TYPE } from '../utils/enums'
import Dropdown from '../components/Dropdown'
import ImageCropper from '../components/ImageCropper/ImageCropper'

const GET_PROFILE = gql`
  ${getRestaurantProfile}
`
const EDIT_RESTAURANT = gql`
  ${editRestaurant}
`
const CUISINES = gql`
  ${getCuisines}
`
const GET_VENDOR_PROFILE = gql`
  query GetRestaurantOnboardingApplicationById($restaurantId: String!, $applicationId: String!) {
    getRestaurantOnboardingApplicationById(restaurantId: $restaurantId, applicationId: $applicationId) {
      _id
      potentialVendor
      restaurantId
      beneficialOwners {
        name
        passportId
        email
        phone
        isPrimary
        emailVerified
        idCardDocuments
      }
      companyName
      restaurantName
      restaurantContactInfo {
        email
        phone
        emailVerified
      }
      location {
        location {
          coordinates
        }
        deliveryAddress
      }
      restaurantImages
      menuImages
      profileImage
      cuisines
      openingTimes {
        startTime
        endTime
      }
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
      resubmissionCount
      applicationStatus
      statusHistory {
        status
        changedBy {
          userId
          userType
        }
        reason
        timestamp
      }
      serviceFeePercentage
    }
  }
`;

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}
const GET_DOCUMENT_URLS = gql`
  query GetDocumentUrls($applicationId: ID!) {
    getDocumentUrlsForRestaurantOnboardingApplication(applicationId: $applicationId)
  }
`;



const VendorProfileDisplay = ({ data }) => {
  const [cuisines, setCuisines] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const applicationId = localStorage.getItem('applicationId');


  useEffect(() => {
    if (data?.cuisines) {
      setCuisines(data.cuisines);
    }
  }, [data?.cuisines]);

  if (!data) return <CustomLoader />;

  const token = JSON.parse(localStorage.getItem('user-enatega')); // Get token from localStorage


  const { data: documentUrls } = useQuery(GET_DOCUMENT_URLS, {
    variables: {
      applicationId: applicationId
    },
    context: {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    }
  });

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #f0f4f8, #e6f2ff)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Restaurant Name', value: data.restaurantName },
                  { label: 'Company Name', value: data.companyName },
                  { label: 'Vendor ID', value: data.potentialVendor },
                  { label: 'Application Status', value: data.applicationStatus }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography sx={{ color: "black" }}>{item.label}</Typography>
                    <Input
                      fullWidth
                      readOnly
                      defaultValue={item.value}
                      disableUnderline
                      sx={{
                        border: '1px solid black',
                        padding: '8px',
                        color: "black",
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Contact Information
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Email', value: data.restaurantContactInfo?.email },
                  { label: 'Phone', value: data.restaurantContactInfo?.phone },
                  { label: 'Email Verified', value: data.restaurantContactInfo?.emailVerified ? 'Yes' : 'No' }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography sx={{ color: "black" }}>{item.label}</Typography>
                    <Input
                      fullWidth
                      readOnly
                      defaultValue={item.value}
                      disableUnderline
                      sx={{
                        border: '1px solid black',
                        padding: '8px',
                        color: "black",
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Beneficial Owners */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Beneficial Owners
              </Typography>
              {data.beneficialOwners?.map((owner, index) => (
                <Grid container spacing={3} key={index} sx={{ mb: 2 }}>
                  {[
                    { label: 'Name', value: owner.name },
                    { label: 'Email', value: owner.email },
                    { label: 'Phone', value: owner.phone },
                    { label: 'Passport ID', value: owner.passportId },
                    { label: 'Primary Owner', value: owner.isPrimary ? 'Yes' : 'No' }
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Typography sx={{ color: "black" }}>{item.label}</Typography>
                      <Input
                        fullWidth
                        readOnly
                        defaultValue={item.value}
                        disableUnderline
                        sx={{
                          border: '1px solid black',
                          padding: '8px',
                          color: "black",
                          borderRadius: 1
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Paper>
          </Grid>

          {/* Cuisines */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Cuisines
              </Typography>
              <Select
                multiple
                readOnly
                fullWidth
                value={data.cuisines || []}
                renderValue={(selected) => selected.join(', ')}
                sx={{
                  '& .MuiSelect-select': {
                    border: '1px solid black',
                    padding: '8px',
                    color: 'black'
                  }
                }}
              >
                {data.cuisines?.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    <Checkbox checked={data.cuisines.indexOf(cuisine) > -1} />
                    <ListItemText primary={cuisine} />
                  </MenuItem>
                ))}
              </Select>
            </Paper>
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Bank Details
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Bank Name', value: data.businessDocuments?.bankDetails?.bankName },
                  { label: 'Bank Identifier Code', value: data.businessDocuments?.bankDetails?.bankIdentifierCode },
                  { label: 'Branch Name', value: data.businessDocuments?.bankDetails?.branchName },
                  { label: 'Account Number', value: data.businessDocuments?.bankDetails?.accountNumber },
                  { label: 'Account Holder Name', value: data.businessDocuments?.bankDetails?.accountHolderName }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography sx={{ color: "black" }}>{item.label}</Typography>
                    <Input
                      fullWidth
                      readOnly
                      defaultValue={item.value}
                      disableUnderline
                      sx={{
                        border: '1px solid black',
                        padding: '8px',
                        color: "black",
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Document URLs Section */}
          <Grid item xs={12}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FF8F00',
                  paddingBottom: 1,
                  marginBottom: 2
                }}
              >
                Restaurant All Documents of Vendor
              </Typography>
              <Grid container spacing={3}>
                {documentUrls?.getDocumentUrlsForRestaurantOnboardingApplication &&
                  Object.entries(documentUrls.getDocumentUrlsForRestaurantOnboardingApplication)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => window.open(
                            Array.isArray(value) ? value[0] : value,
                            '_blank'
                          )}
                          sx={{
                            height: 'auto',
                            minHeight: '100px',
                            padding: '15px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '1px solid #ccc',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '12px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              marginBottom: 1
                            }}
                          >
                            {key.replace(/([A-Z])/g, ' \$1').trim()}
                          </Typography>
                        </Button>
                      </Grid>
                    ))
                }
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const VendorProfile = () => {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD, ImgUrlS3 } = ConfigurableValues()

  const { t } = useTranslation()

  const restaurantId = localStorage.getItem('restaurantId')
  const token = JSON.parse(localStorage.getItem('user-enatega'))

  const [showPassword, setShowPassword] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [nameError, setNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [prefixError, setPrefixError] = useState(null)
  const [deliveryTimeError, setDeliveryTimeError] = useState(null)
  const [minimumOrderError, setMinimumOrderError] = useState(null)
  const [salesTaxError, setSalesTaxError] = useState(null)
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const [restaurantCuisines, setRestaurantCuisines] = useState([])
  const [activeTab, setActiveTab] = useState('update');
  // const isAdmin = userInfo.userType === "ADMIN"




  const handleCropComplete = (croppedImageUrl) => {
    setImgUrl(croppedImageUrl); // Set the cropped image URL
  };

  const handleLogoCropComplete = (croppedLogoUrl) => {
    setLogoUrl(croppedLogoUrl);
  };

  const onCompleted = data => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setErrors('')
    setSuccess(t('RestaurantUpdatedSuccessfully'))
    setTimeout(hideAlert, 5000)
  }

  const onError = ({ graphQLErrors, networkError }) => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setSuccess('')
    if (graphQLErrors) {
      setErrors(graphQLErrors[0].message)
    }
    if (networkError) {
      setErrors(networkError.result.errors[0].message)
    }
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setErrors('')
    setSuccess('')
  }
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_PROFILE,
    {
      variables: { id: restaurantId }
    }
  )

  const restaurantImage = data?.restaurant?.image
  const restaurantLogo = data?.restaurant?.logo
  const applicationId = data?.restaurant?.onboardingApplicationId
  console.log(applicationId, "-----applicationId")
  const appId = localStorage.setItem('applicationId', data?.restaurant?.onboardingApplicationId)


  const [mutate, { loading }] = useMutation(EDIT_RESTAURANT, {
    onError,
    onCompleted,
    refetchQueries: [GET_PROFILE]
  })

  // Add vendor profile query

  const { data: vendorData, loading: vendorLoading } = useQuery(GET_VENDOR_PROFILE, {
    variables: {
      restaurantId,
      applicationId
    },
    skip: !restaurantId && !applicationId,
    context: {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    },
    // skip: !isAdmin // Only fetch if user is admin
  });

  const formRef = useRef(null)

  const handleFileSelect = (event, type) => {
    let result
    result = filterImage(event)
    if (result) imageToBase64(result, type)
  }

  const filterImage = event => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i)
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    return images.length ? images[0] : undefined
  }

  const imageToBase64 = (imgUrl, type) => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      if (type === 'image' && fileReader.result) {
        setImgUrl(fileReader.result)
      } else if (type === 'logo' && fileReader.result) {
        setLogoUrl(fileReader.result)
      }
    }
    fileReader.readAsDataURL(imgUrl)
  }

  const uploadImageToCloudinary = async(uploadType) => {
    if (!uploadType) return

    const apiUrl = ImgUrlS3

    try {
      // If the uploadType is a base64 string, convert it to a blob
      const fetchImageData = async(base64Data) => {
        const response = await fetch(base64Data)
        const blob = await response.blob()
        return blob
      }

      const formData = new FormData()

      // Handle different types of image input
      if (typeof uploadType === 'string' && uploadType.startsWith('data:')) {
        // Handle base64 image
        const blob = await fetchImageData(uploadType)
        formData.append('file', blob, 'image.jpg')
      } else if (uploadType instanceof File || uploadType instanceof Blob) {
        // Handle File or Blob directly
        formData.append('file', uploadType)
      } else if (typeof uploadType === 'string' && uploadType.startsWith('http')) {
        // Handle image URL
        const response = await fetch(uploadType)
        const blob = await response.blob()
        formData.append('file', blob, 'image.jpg')
      } else {
        throw new Error('Invalid image format')
      }

      const result = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token.token}`
        }
      })

      if (!result.ok) {
        const errorData = await result.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const imageData = await result.json()
      return imageData.url
    } catch (e) {
      console.error('Upload error:', e)
      throw new Error('Image upload failed: ' + e.message)
    }
  }
  const onSubmitValidaiton = data => {
    const form = formRef.current
    const name = form.name.value
    const address = form.address.value
    const username = form.username.value
    const password = form.password.value
    // IMPORTANT!!!!
    const prefix = form.prefix.value
    const deliveryTime = form.deliveryTime.value
    const minimumOrder = form.minimumOrder.value
    const salesTax = +form.salesTax.value

    // Check if deliveryTime, minimumOrder, and salesTax are negative
    if (deliveryTime < 0) {
      setDeliveryTimeError(true)
      setErrors(t('DeliveryTime cannot be negative'))
      return false
    }
    if (minimumOrder < 0) {
      setMinimumOrderError(true)
      setErrors(t('Minimum Order cannot be negative'))
      return false
    }
    if (salesTax < 0) {
      setSalesTaxError(true)
      setErrors(t('Sales Tax cannot be negative'))
      return false
    }

    const nameErrors = !validateFunc({ name }, 'name')
    const addressErrors = !validateFunc({ address }, 'address')
    const prefixErrors = !validateFunc({ prefix: prefix }, 'prefix')
    const deliveryTimeErrors = !validateFunc(
      { deliveryTime: deliveryTime },
      'deliveryTime'
    )
    const minimumOrderErrors = !validateFunc(
      { minimumOrder: minimumOrder },
      'minimumOrder'
    )
    const usernameErrors = !validateFunc({ name: username }, 'name')
    const passwordErrors = !validateFunc({ password }, 'password')
    const salesTaxError = !validateFunc({ salesTax }, 'salesTax')
    setNameError(nameErrors)
    setAddressError(addressErrors)
    setPrefixError(prefixErrors)
    setUsernameError(usernameErrors)
    setPasswordError(passwordErrors)
    setDeliveryTimeError(deliveryTimeErrors)
    setMinimumOrderError(minimumOrderErrors)
    setSalesTaxError(salesTaxError)
    if (
      !(
        nameErrors &&
        addressErrors &&
        prefixErrors &&
        usernameErrors &&
        passwordErrors &&
        deliveryTimeErrors &&
        minimumOrderErrors &&
        salesTaxError
      )
    ) {
      setErrors(t('FieldsRequired'))
    }
    return (
      nameErrors &&
      addressErrors &&
      prefixErrors &&
      usernameErrors &&
      passwordErrors &&
      deliveryTimeErrors &&
      minimumOrderErrors &&
      salesTaxError
    )
  }

  const { data: cuisines } = useQuery(CUISINES)
  const cuisinesInDropdown = useMemo(
    () => cuisines?.cuisines?.map(item => item.name),
    [cuisines]
  )
  const handleCuisineChange = event => {
    const {
      target: { value }
    } = event
    setRestaurantCuisines(typeof value === 'string' ? value.split(',') : value)
  }

  // useEffect(() => {
  //   setRestaurantCuisines(data?.restaurant?.cuisines)
  // }, [data?.restaurant?.cuisines])

  useEffect(() => {
    if (cuisinesInDropdown && restaurantCuisines) {
      // Filter out any selected cuisines that are no longer in the available cuisines
      const validCuisines = restaurantCuisines.filter(cuisine =>
        cuisinesInDropdown.includes(cuisine)
      )

      // Update selected cuisines if there are any invalid ones
      if (validCuisines.length !== restaurantCuisines.length) {
        setRestaurantCuisines(validCuisines)
      }
    }
  }, [cuisinesInDropdown, restaurantCuisines])

  useEffect(() => {
    if (data?.restaurant?.cuisines && cuisinesInDropdown) {
      // Only set cuisines that still exist in the available options
      const validCuisines = data.restaurant.cuisines.filter(cuisine =>
        cuisinesInDropdown.includes(cuisine)
      )
      setRestaurantCuisines(validCuisines)
    }
  }, [data?.restaurant?.cuisines, cuisinesInDropdown])

  useEffect(() => {
    if (restaurantImage) setImgUrl(restaurantImage)
    if (restaurantLogo) setLogoUrl(restaurantLogo)
  }, [restaurantImage, restaurantLogo])

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  // Add this handler for number input scroll
  const handleWheel = (e) => {
    e.target.blur()
  }

  console.log(data, "data of restaurant ")
  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        <Box container className={classes.container}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Update Profile" value="update" />
            <Tab label="Vendor Profile" value="vendor" />
          </Tabs>

          {activeTab === 'update' ? (
            // Existing update profile form
            <Box>
              <Box style={{ alignItems: 'start' }} className={classes.flexRow}>

              </Box>
              {errorQuery && <span>{errorQuery.message}</span>}
              {loadingQuery ? (
                <CustomLoader />
              ) : (
                <Box className={classes.form}>
                  <form ref={formRef}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('RestaurantUsername')}
                          </Typography>
                          <Input
                            disabled
                            style={{ marginTop: -1 }}
                            name="username"
                            id="input-type-username"
                            placeholder={t('RestaurantUsername')}
                            type="text"
                            defaultValue={(data && data.restaurant.username) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              usernameError === false
                                ? globalClasses.inputError
                                : usernameError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                            onChange={event => {
                              if (event.target.value.includes(' ')) {
                                const usernameWithoutSpaces = event.target.value.replace(
                                  / /g,
                                  ''
                                )
                                event.target.value = usernameWithoutSpaces
                              }
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Password')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="password"
                            id="input-type-password"
                            placeholder={t('PHRestaurantPassword')}
                            type={showPassword ? 'text' : 'password'}
                            defaultValue={(data && data.restaurant.password) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              passwordError === false
                                ? globalClasses.inputError
                                : passwordError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                            endAdornment={
                              <InputAdornment position="end">
                                <Checkbox
                                  checked={showPassword}
                                  onChange={() => setShowPassword(!showPassword)}
                                  color="primary"
                                  icon={<VisibilityOffIcon />}
                                  checkedIcon={<VisibilityIcon />}
                                />
                              </InputAdornment>
                            }
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Restaurant Id')}
                          </Typography>
                          <Input
                            disabled
                            style={{ marginTop: -1 }}
                            name="Restaurant Id"
                            id="Restaurant Id"
                            placeholder={t('Restaurant Id')}
                            type="text"
                            defaultValue={(data && data.restaurant._id) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              usernameError === false
                                ? globalClasses.inputError
                                : usernameError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                            onChange={event => {
                              if (event.target.value.includes(' ')) {
                                const usernameWithoutSpaces = event.target.value.replace(
                                  / /g,
                                  ''
                                )
                                event.target.value = usernameWithoutSpaces
                              }
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Email')}
                          </Typography>
                          <Input
                            disabled
                            style={{ marginTop: -1 }}
                            name="Email"
                            id="Email"
                            placeholder={t('Email')}
                            type="text"
                            defaultValue={(data && data.restaurant.owner.email) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              usernameError === false
                                ? globalClasses.inputError
                                : usernameError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                            onChange={event => {
                              if (event.target.value.includes(' ')) {
                                const usernameWithoutSpaces = event.target.value.replace(
                                  / /g,
                                  ''
                                )
                                event.target.value = usernameWithoutSpaces
                              }
                            }}
                          />
                        </Box>
                      </Grid>


                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Phone')}
                          </Typography>
                          <Input
                            disabled
                            style={{ marginTop: -1 }}
                            name="Phone"
                            id="Phone"
                            placeholder={t('Phone')}
                            type="text"
                            defaultValue={(data && data.restaurant.phone) || ''}
                            disableUnderline
                            className={globalClasses.input}
                          />
                        </Box>
                      </Grid>

                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Name')}
                          </Typography>
                          <Input
                            disabled
                            style={{ marginTop: -1 }}
                            name="name"
                            id="input-type-name"
                            placeholder={t('PHRestaurantName')}
                            type="text"
                            defaultValue={(data && data.restaurant.name) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              nameError === false
                                ? globalClasses.inputError
                                : nameError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Address')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="address"
                            id="input-type-address"
                            placeholder={t('PHRestaurantAddress')}
                            type="text"
                            defaultValue={(data && data.restaurant.address) || ''}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              addressError === false
                                ? globalClasses.inputError
                                : addressError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('DeliveryTime')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="deliveryTime"
                            id="input-type-delivery-time"
                            placeholder={t('DeliveryTime')}
                            inputProps={{ min: 0, onWheel: handleWheel }}
                            type="number"
                            defaultValue={data && data.restaurant.deliveryTime}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              deliveryTimeError === false
                                ? globalClasses.inputError
                                : deliveryTimeError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('MinOrder')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="minimumOrder"
                            id="input-type-minimum-order"
                            placeholder={t('MinOrder')}
                            inputProps={{ min: 0, onWheel: handleWheel }}
                            type="number"
                            disableUnderline
                            defaultValue={data && data.restaurant.minimumOrder}
                            className={[
                              globalClasses.input,
                              minimumOrderError === false
                                ? globalClasses.inputError
                                : minimumOrderError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('SalesTax')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="salesTax"
                            id="input-type-sales-tax"
                            placeholder={t('SalesTax')}
                            inputProps={{ min: 0, onWheel: handleWheel }}
                            type="number"
                            defaultValue={data && data.restaurant.tax}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              salesTaxError === false
                                ? globalClasses.inputError
                                : salesTaxError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('OrderPrefix')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1 }}
                            name="prefix"
                            id="input-type-order_id_prefix"
                            placeholder={t('OrderPrefix')}
                            type="text"
                            defaultValue={data && data.restaurant.orderPrefix}
                            disableUnderline
                            className={[
                              globalClasses.input,
                              prefixError === false
                                ? globalClasses.inputError
                                : prefixError === true
                                  ? globalClasses.inputSuccess
                                  : ''
                            ]}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Shop Category (Default)')}
                          </Typography>
                          <Input
                            style={{ marginTop: -1, border: 0 }}
                            value={SHOP_TYPE.RESTAURANT}
                            name="shopType"
                            id="shop-type"
                            disabled
                            disableUnderline
                            className={[globalClasses.input, globalClasses.inputSuccess]}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography className={classes.labelText}>
                            {t('Cuisines')}
                          </Typography>
                          {/* <Select
                        multiple
                        onChange={handleCuisineChange}
                        input={<OutlinedInput />}
                        value={restaurantCuisines}
                        renderValue={selected => selected.join(', ')}
                        defaultValue={data?.restaurant?.cuisines}
                        MenuProps={MenuProps}
                        className={[globalClasses.input]}
                        style={{ margin: '0 0 0 -20px', padding: '0px 0px' }}>
                        {cuisinesInDropdown?.map(cuisine => (
                          <MenuItem
                            key={'restaurant-cuisine-' + cuisine}
                            value={cuisine}
                            style={{
                              color: '#000000',
                              textTransform: 'capitalize'
                            }}>
                            <Checkbox
                              checked={
                                restaurantCuisines?.indexOf(cuisine) > -1
                              }
                            />
                            <ListItemText primary={cuisine} />
                          </MenuItem>
                        ))}
                      </Select> */}
                          <Select
                            multiple
                            onChange={handleCuisineChange}
                            input={<OutlinedInput />}
                            value={restaurantCuisines || []}
                            displayEmpty={true} // Add this to show placeholder when empty
                            renderValue={(selected) => {
                              if (!selected || selected.length === 0) {
                                return <span style={{ color: '#9e9e9e' }}>{t('Select Cuisines')}</span>; // Placeholder text
                              }
                              return selected.join(', ');
                            }}
                            defaultValue={data?.restaurant?.cuisines}
                            MenuProps={MenuProps}
                            className={[globalClasses.input]}
                            style={{ margin: '0 0 0 -20px', padding: '0px 0px' }}>
                            {cuisinesInDropdown?.map(cuisine => (
                              <MenuItem
                                key={'restaurant-cuisine-' + cuisine}
                                value={cuisine}
                                style={{
                                  color: '#000000',
                                  textTransform: 'capitalize'
                                }}>
                                <Checkbox
                                  checked={restaurantCuisines?.indexOf(cuisine) > -1}
                                />
                                <ListItemText primary={cuisine} />
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography mt={3} variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Restaurant Image
                        </Typography>
                        <Box mt={3} style={{ alignItems: 'center' }} className={globalClasses.flex}>
                          <ImageCropper onCropComplete={handleCropComplete} />
                          {imgUrl && (
                            <img
                              src={imgUrl}
                              alt="Cropped Image"
                              style={{ maxWidth: '50%', maxHeight: '50%', marginTop: 5 }}
                            />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography mt={3} variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Restaurant Logo
                        </Typography>
                        <Box mt={3} style={{ alignItems: 'center' }} className={globalClasses.flex}>
                          <ImageCropper onCropComplete={handleLogoCropComplete} />
                          {logoUrl && (
                            <img
                              src={logoUrl}
                              alt="Cropped Logo"
                              style={{ maxWidth: '50%', maxHeight: '50%', marginTop: 5 }}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <Box>
                      <Button
                        className={globalClasses.button}
                        disabled={loading}
                        onClick={async e => {
                          e.preventDefault()
                          if (onSubmitValidaiton()) {
                            const imgUpload = await uploadImageToCloudinary(imgUrl)
                            const logoUpload = await uploadImageToCloudinary(
                              logoUrl
                            )
                            const form = formRef.current
                            const name = form.name.value
                            const address = form.address.value
                            const prefix = form.prefix.value // can we not update this?
                            const deliveryTime = form.deliveryTime.value
                            const minimumOrder = form.minimumOrder.value
                            const username = form.username.value
                            const password = form.password.value
                            const salesTax = form.salesTax.value
                            const shopType = form.shopType.value
                            mutate({
                              variables: {
                                restaurantInput: {
                                  _id: restaurantId,
                                  name,
                                  address,
                                  image:
                                    imgUpload ||
                                    data.restaurant.image ||
                                    'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp',
                                  logo: logoUpload || defaultLogo,
                                  orderPrefix: prefix,
                                  deliveryTime: Number(deliveryTime),
                                  minimumOrder: Number(minimumOrder),
                                  username: username,
                                  password: password,
                                  salesTax: +salesTax,
                                  shopType,
                                  cuisines: restaurantCuisines
                                }
                              }
                            })
                          }
                        }}>
                        {t('Save')}
                      </Button>
                    </Box>
                  </form>
                  <Box mt={2}>
                    {success && (
                      <Alert
                        className={globalClasses.alertSuccess}
                        variant="filled"
                        severity="success">
                        {success}
                      </Alert>
                    )}
                    {errors && (
                      <Alert
                        className={globalClasses.alertError}
                        variant="filled"
                        severity="error">
                        {errors}
                      </Alert>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            // New vendor profile display
            <VendorProfileDisplay data={vendorData?.getRestaurantOnboardingApplicationById} />
          )}
        </Box>
      </Container>
    </>
  )
}
export default withTranslation()(VendorProfile)