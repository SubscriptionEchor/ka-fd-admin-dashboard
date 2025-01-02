// import React, { useState, useRef, useMemo } from 'react';
// import { validateFunc } from '../../constraints/constraints';
// import { withTranslation } from 'react-i18next';
// import { useMutation, gql, useQuery } from '@apollo/client';
// import { createRestaurant, getCuisines, restaurantByOwner } from '../../apollo';
// import defaultLogo from '../../assets/img/defaultLogo.png';
// import { IconButton } from '@mui/material';
// import Close from '@mui/icons-material/Close';
// import {
//   Box,
//   Alert,
//   Typography,
//   Button,
//   Input,
//   Switch,
//   Grid,
//   Checkbox,
//   InputLabel,
//   Select,
//   OutlinedInput,
//   MenuItem,
//   ListItemText
// } from '@mui/material';
// import ConfigurableValues from '../../config/constants';
// import useStyles from './styles';
// import useGlobalStyles from '../../utils/globalStyles';
// import InputAdornment from '@mui/material/InputAdornment';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import { SHOP_TYPE } from '../../utils/enums';
// import ImageCropper from '../../components/ImageCropper/ImageCropper';

// const CREATE_RESTAURANT = gql`
//   ${createRestaurant}
// `;
// const RESTAURANT_BY_OWNER = gql`
//   ${restaurantByOwner}
// `;
// const CUISINES = gql`
//   ${getCuisines}
// `;
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };

// const CreateRestaurant = props => {
//   const { ImgUrlS3 } = ConfigurableValues();
//   const { t } = props;
//   const owner = props.owner;
//   const [showPassword, setShowPassword] = useState(false);
//   const [imgUrl, setImgUrl] = useState('');
//   const [logoUrl, setLogoUrl] = useState('');
//   const [nameError, setNameError] = useState(null);
//   const [usernameError, setUsernameError] = useState(null);
//   const [passwordError, setPasswordError] = useState(null);
//   const [addressError, setAddressError] = useState(null);
//   const [deliveryTimeError, setDeliveryTimeError] = useState(null);
//   const [minimumOrderError, setMinimumOrderError] = useState(null);
//   const [salesTaxError, setSalesTaxError] = useState(null);
//   const [restaurantCuisines, setRestaurantCuisines] = useState([]);
//   const [errors, setErrors] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleCropComplete = (croppedImageUrl) => {
//     setImgUrl(croppedImageUrl); // Set the cropped image URL
//   };

//   const handleLogoCropComplete = (croppedLogoUrl) => {
//     setLogoUrl(croppedLogoUrl);
//   };

//   const onCompleted = data => {
//     setNameError(null);
//     setAddressError(null);
//     setUsernameError(null);
//     setPasswordError(null);
//     setDeliveryTimeError(null);
//     setMinimumOrderError(null);
//     setErrors('');
//     setSalesTaxError(null);
//     setSuccess(t('RestaurantAdded'));
//     clearFormValues();
//     setTimeout(hideAlert, 5000);
//   };

//   const onError = ({ graphQLErrors, networkError }) => {
//     setNameError(null);
//     setAddressError(null);
//     setUsernameError(null);
//     setPasswordError(null);
//     setDeliveryTimeError(null);
//     setMinimumOrderError(null);
//     setSalesTaxError(null);
//     setSuccess('');
//     if (graphQLErrors && graphQLErrors.length) {
//       setErrors(graphQLErrors[0].message);
//     }
//     if (networkError) {
//       setErrors(t('NetworkError'));
//     }
//     setTimeout(hideAlert, 5000);
//   };

//   const hideAlert = () => {
//     setErrors('');
//     setSuccess('');
//   };

//   const { data: cuisines } = useQuery(CUISINES);
//   const cuisinesInDropdown = useMemo(
//     () => cuisines?.cuisines?.map(item => item.name),
//     [cuisines]
//   );

//   const [mutate, { loading }] = useMutation(CREATE_RESTAURANT, {
//     onError,
//     onCompleted,
//     update
//   });

//   const formRef = useRef(null);




//   const uploadImageToCloudinary = async(uploadType) => {
//     if (!uploadType) return

//     const apiUrl = ImgUrlS3;
//     const token = JSON.parse(localStorage.getItem('user-enatega'));

//     try {
//         // If the uploadType is a base64 string, convert it to a blob
//         const fetchImageData = async(base64Data) => {
//             const response = await fetch(base64Data);
//             const blob = await response.blob();
//             return blob;
//         };

//         const formData = new FormData();

//         // Handle different types of image input
//         if (typeof uploadType === 'string' && uploadType.startsWith('data:')) {
//             // Handle base64 image
//             const blob = await fetchImageData(uploadType);
//             formData.append('file', blob, 'image.jpg');
//         } else if (uploadType instanceof File || uploadType instanceof Blob) {
//             // Handle File or Blob directly
//             formData.append('file', uploadType);
//         } else if (typeof uploadType === 'string' && uploadType.startsWith('http')) {
//             // Handle image URL
//             const response = await fetch(uploadType);
//             const blob = await response.blob();
//             formData.append('file', blob, 'image.jpg');
//         } else {
//             throw new Error('Invalid image format');
//         }

//         const result = await fetch(apiUrl, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'Authorization': `Bearer ${token.token}`
//             }
//         });

//         if (!result.ok) {
//             const errorData = await result.json();
//             throw new Error(errorData.message || 'Upload failed');
//         }

//         const imageData = await result.json();
//         return imageData.url;
//     } catch (e) {
//         console.error('Upload error:', e);
//         setErrors(t('ImageUploadFailed'));
//         throw new Error('Image upload failed: ' + e.message);
//     }
// };

//   const handleCloseModal = () => {
//     props.onClose();
//   };

//   const onSubmitValidaiton = data => {
//     const form = formRef.current;
//     const name = form.name.value;
//     const address = form.address.value;
//     const username = form.username.value;
//     const password = form.password.value;
//     const deliveryTime = form.deliveryTime.value;
//     const minimumOrder = form.minimumOrder.value;
//     const salesTax = +form.salesTax.value;

//     const nameError = !validateFunc({ name }, 'name');
//     const addressError = !validateFunc({ address }, 'address');
//     const deliveryTimeError = !validateFunc({ deliveryTime }, 'deliveryTime');
//     const minimumOrderError = !validateFunc({ minimumOrder }, 'minimumOrder');
//     const usernameError = !validateFunc({ name: username }, 'name');
//     const passwordError = !validateFunc({ password }, 'password');
//     const salesTaxError = !validateFunc({ salesTax }, 'salesTax');

//     if (deliveryTime < 0 || minimumOrder < 0 || salesTax < 0) {
//       setDeliveryTimeError(true);
//       setMinimumOrderError(true);
//       setSalesTaxError(true);
//       setErrors(t('Negative Values Not Allowed'));
//       return false;
//     }

//     setNameError(nameError);
//     setAddressError(addressError);
//     setUsernameError(usernameError);
//     setPasswordError(passwordError);
//     setDeliveryTimeError(deliveryTimeError);
//     setMinimumOrderError(minimumOrderError);
//     setSalesTaxError(salesTaxError);
//     if (
//       !(
//         nameError &&
//         addressError &&
//         usernameError &&
//         passwordError &&
//         deliveryTimeError &&
//         minimumOrderError &&
//         salesTaxError
//       )
//     ) {
//       setErrors(t('FieldsRequired'));
//     }
//     return (
//       nameError &&
//       addressError &&
//       usernameError &&
//       passwordError &&
//       deliveryTimeError &&
//       minimumOrderError &&
//       salesTaxError
//     );
//   };

//   function update(cache, { data: { createRestaurant } }) {
//     const { restaurantByOwner } = cache.readQuery({
//       query: RESTAURANT_BY_OWNER,
//       variables: { id: owner }
//     });
//     cache.writeQuery({
//       query: RESTAURANT_BY_OWNER,
//       variables: { id: owner },
//       data: {
//         restaurantByOwner: {
//           ...restaurantByOwner,
//           restaurants: [...restaurantByOwner.restaurants, createRestaurant]
//         }
//       }
//     });
//   }

//   const clearFormValues = () => {
//     const form = formRef.current;
//     form.name.value = '';
//     form.address.value = '';
//     form.username.value = '';
//     form.password.value = '';
//     form.deliveryTime.value = 20;
//     form.minimumOrder.value = 0;
//     setImgUrl('');
//   };

//   const handleCuisineChange = event => {
//     const {
//       target: { value }
//     } = event;
//     setRestaurantCuisines(
//       typeof value === 'string' ? value.split(',') : value
//     );
//   };

//   const classes = useStyles();
//   const globalClasses = useGlobalStyles();

//   const handleWheel = (e) => {
//     e.target.blur();
//   };

//   return (
//     <Box container className={classes.container}>
//       <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
//         <Box item className={classes.heading}>
//           <Typography variant="h6" className={classes.text}>
//             {t('AddRestaurant')}
//           </Typography>
//         </Box>
//         <Box ml={10} mt={1}>
//           <label>{t('Available')}</label>
//           <Switch defaultChecked style={{ color: 'black' }} />
//         </Box>
//         <IconButton onClick={handleCloseModal} style={{ position: 'absolute', right: 5, top: 35 }}>
//           <Close />
//         </IconButton>
//       </Box>

//       <Box className={classes.form}>
//         <form ref={formRef}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Username')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="username"
//                   id="input-type-username"
//                   placeholder={t('RestaurantUsername')}
//                   type="text"
//                   autoComplete="off"
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     usernameError === false
//                       ? globalClasses.inputError
//                       : usernameError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                   onChange={event => {
//                     event.target.value = event.target.value
//                       .trim()
//                       .replace(/\s/g, '')
//                   }}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Password')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="password"
//                   id="input-type-password"
//                   placeholder={t('RestaurantPassword')}
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   defaultValue={''}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     passwordError === false
//                       ? globalClasses.inputError
//                       : passwordError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <Checkbox
//                         checked={showPassword}
//                         onChange={() => setShowPassword(!showPassword)}
//                         color="primary"
//                         icon={<VisibilityOffIcon />}
//                         checkedIcon={<VisibilityIcon />}
//                       />
//                     </InputAdornment>
//                   }
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Name')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="name"
//                   id="input-type-name"
//                   placeholder={t('RestaurantName')}
//                   type="text"
//                   defaultValue={''}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     nameError === false
//                       ? globalClasses.inputError
//                       : nameError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Address')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="address"
//                   id="input-type-address"
//                   placeholder={t('RestaurantAddress')}
//                   type="text"
//                   defaultValue={''}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     addressError === false
//                       ? globalClasses.inputError
//                       : addressError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('DeliveryTime')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="deliveryTime"
//                   id="input-type-delivery-time"
//                   placeholder={t('DeliveryTime')}
//                   type="number"
//                   inputProps={{ min: 0, onWheel: handleWheel }}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     deliveryTimeError === false
//                       ? globalClasses.inputError
//                       : deliveryTimeError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('MinOrder')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="minimumOrder"
//                   id="input-type-minimum-order"
//                   placeholder={t('MinOrder')}
//                   type="number"
//                   inputProps={{ min: 0, onWheel: handleWheel }}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     minimumOrderError === false
//                       ? globalClasses.inputError
//                       : minimumOrderError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('SalesTax')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="salesTax"
//                   id="input-type-sales-tax"
//                   placeholder={t('SalesTax')}
//                   type="number"
//                   inputProps={{ min: 0, onWheel: handleWheel }}
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     salesTaxError === false
//                       ? globalClasses.inputError
//                       : salesTaxError === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Shop Category (Default)')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1, border: 0 }}
//                   value={SHOP_TYPE.RESTAURANT}
//                   name="shopType"
//                   id="shop-type"
//                   disabled
//                   disableUnderline
//                   className={[globalClasses.input, globalClasses.inputSuccess]}
//                 />
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Cuisines')}
//                 </Typography>
//                 <Select
//                   multiple
//                   value={restaurantCuisines}
//                   onChange={handleCuisineChange}
//                   input={<OutlinedInput />}
//                   displayEmpty
//                   renderValue={(selected) => {
//                     if (selected.length === 0) {
//                       return t('Select Cuisines');
//                     }
//                     return selected.join(', ');
//                   }}
//                   MenuProps={MenuProps}
//                   className={[globalClasses.input]}
//                   style={{ margin: '0 0 0 -20px', padding: '0px 0px', border: 0 }}>
//                   {cuisinesInDropdown?.map(cuisine => (
//                     <MenuItem
//                       key={'restaurant-cuisine-' + cuisine}
//                       value={cuisine}
//                       style={{ color: '#000000', textTransform: 'capitalize' }}>
//                       <Checkbox
//                         checked={restaurantCuisines.indexOf(cuisine) > -1}
//                       />
//                       <ListItemText primary={cuisine} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </Box>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography mt={3} variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                 Restaurant Image
//               </Typography>
//               <Box mt={3} style={{ alignItems: 'center' }} className={globalClasses.flex}>
//                 <ImageCropper onCropComplete={handleCropComplete} />
//                 {imgUrl && (
//                   <img
//                     src={imgUrl}
//                     alt="Cropped Image"
//                     style={{ maxWidth: '50%', maxHeight: '50%', marginTop: 5 }}
//                   />
//                 )}
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Typography mt={3} variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                 Restaurant Logo
//               </Typography>
//               <Box mt={3} style={{ alignItems: 'center' }} className={globalClasses.flex}>
//                 <ImageCropper onCropComplete={handleLogoCropComplete} />
//                 {logoUrl && (
//                   <img
//                     src={logoUrl}
//                     alt="Cropped Logo"
//                     style={{ maxWidth: '50%', maxHeight: '50%', marginTop: 5 }}
//                   />
//                 )}
//               </Box>
//             </Grid>
//           </Grid>

//           <Box>
//             <Button
//               className={globalClasses.button}
//               disabled={loading}
//               onClick={async e => {
//                 e.preventDefault();
//                 if (onSubmitValidaiton()) {
//                   const imgUpload = await uploadImageToCloudinary(imgUrl);
//                   const logoUpload = await uploadImageToCloudinary(logoUrl);
//                   const form = formRef.current;
//                   const name = form.name.value;
//                   const address = form.address.value;
//                   const deliveryTime = form.deliveryTime.value;
//                   const minimumOrder = form.minimumOrder.value;
//                   const username = form.username.value;
//                   const password = form.password.value;
//                   const shopType = form.shopType.value;

//                   mutate({
//                     variables: {
//                       owner,
//                       restaurant: {
//                         name,
//                         address,
//                         image: imgUpload || 'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp',
//                         logo: logoUpload || defaultLogo,
//                         deliveryTime: Number(deliveryTime),
//                         minimumOrder: Number(minimumOrder),
//                         username,
//                         password,
//                         shopType,
//                         cuisines: restaurantCuisines
//                       }
//                     }
//                   });
//                 }
//               }}>
//               {t('Save')}
//             </Button>
//           </Box>
//         </form>
//         <Box mt={2}>
//           {success && (
//             <Alert
//               className={globalClasses.alertSuccess}
//               variant="filled"
//               severity="success">
//               {success}
//             </Alert>
//           )}
//           {errors && (
//             <Alert
//               className={globalClasses.alertError}
//               variant="filled"
//               severity="error">
//               {errors}
//             </Alert>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default withTranslation()(CreateRestaurant);


import React, { useState, useRef, useMemo } from 'react';
import { validateFunc } from '../../constraints/constraints';
import { withTranslation } from 'react-i18next';
import { useMutation, gql, useQuery } from '@apollo/client';
import { createRestaurant, getCuisines, restaurantByOwner } from '../../apollo';
import defaultLogo from '../../assets/img/defaultLogo.png';
import { IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import {
  Box,
  Alert,
  Typography,
  Button,
  Input,
  Switch,
  Grid,
  Checkbox,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText
} from '@mui/material';
import ConfigurableValues from '../../config/constants';
import useStyles from './styles';
import useGlobalStyles from '../../utils/globalStyles';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SHOP_TYPE } from '../../utils/enums';
import ImageCropper from '../../components/ImageCropper/ImageCropper';

const CREATE_RESTAURANT = gql`
  ${createRestaurant}
`;
const RESTAURANT_BY_OWNER = gql`
  ${restaurantByOwner}
`;
const CUISINES = gql`
  ${getCuisines}
`;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const CreateRestaurant = props => {
  const { ImgUrlS3 } = ConfigurableValues();
  const { t } = props;
  const owner = props.owner;
  const [showPassword, setShowPassword] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [nameError, setNameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [deliveryTimeError, setDeliveryTimeError] = useState(null);
  const [minimumOrderError, setMinimumOrderError] = useState(null);
  const [salesTaxError, setSalesTaxError] = useState(null);
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');

  const handleCropComplete = (croppedImageUrl) => {
    setImgUrl(croppedImageUrl); // Set the cropped image URL
  };

  const handleLogoCropComplete = (croppedLogoUrl) => {
    setLogoUrl(croppedLogoUrl);
  };

  const onCompleted = data => {
    clearFormValues();
    setSuccess(t('RestaurantAdded'));
    setTimeout(() => {
        hideAlert();
        props.onClose(); // Close the modal
    }, 3000);
};

  const onError = ({ graphQLErrors, networkError }) => {
    setNameError(null);
    setAddressError(null);
    setUsernameError(null);
    setPasswordError(null);
    setDeliveryTimeError(null);
    setMinimumOrderError(null);
    setSalesTaxError(null);
    setSuccess('');
    if (graphQLErrors && graphQLErrors.length) {
      setErrors(graphQLErrors[0].message);
    }
    if (networkError) {
      setErrors(t('NetworkError'));
    }
    setTimeout(hideAlert, 5000);
  };

  const hideAlert = () => {
    setErrors('');
    setSuccess('');
  };

  const { data: cuisines } = useQuery(CUISINES);
  const cuisinesInDropdown = useMemo(
    () => cuisines?.cuisines?.map(item => item.name),
    [cuisines]
  );

  const [mutate, { loading }] = useMutation(CREATE_RESTAURANT, {
    onError,
    onCompleted,
    update
  });

  const formRef = useRef(null);




  const uploadImageToCloudinary = async(uploadType) => {
    if (!uploadType) return

    const apiUrl = ImgUrlS3;
    const token = JSON.parse(localStorage.getItem('user-enatega'));

    try {
        // If the uploadType is a base64 string, convert it to a blob
        const fetchImageData = async(base64Data) => {
            const response = await fetch(base64Data);
            const blob = await response.blob();
            return blob;
        };

        const formData = new FormData();

        // Handle different types of image input
        if (typeof uploadType === 'string' && uploadType.startsWith('data:')) {
            // Handle base64 image
            const blob = await fetchImageData(uploadType);
            formData.append('file', blob, 'image.jpg');
        } else if (uploadType instanceof File || uploadType instanceof Blob) {
            // Handle File or Blob directly
            formData.append('file', uploadType);
        } else if (typeof uploadType === 'string' && uploadType.startsWith('http')) {
            // Handle image URL
            const response = await fetch(uploadType);
            const blob = await response.blob();
            formData.append('file', blob, 'image.jpg');
        } else {
            throw new Error('Invalid image format');
        }

        const result = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        });

        if (!result.ok) {
            const errorData = await result.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        const imageData = await result.json();
        return imageData.url;
    } catch (e) {
        console.error('Upload error:', e);
        setErrors(t('ImageUploadFailed'));
        throw new Error('Image upload failed: ' + e.message);
    }
};

  const handleCloseModal = () => {
    props.onClose();
  };

  const onSubmitValidaiton = data => {
    const form = formRef.current;
    const name = form.name.value;
    const address = form.address.value;
    const username = form.username.value;
    const password = form.password.value;
    const deliveryTime = form.deliveryTime.value;
    const minimumOrder = form.minimumOrder.value;
    const salesTax = +form.salesTax.value;

    const nameError = !validateFunc({ name }, 'name');
    const addressError = !validateFunc({ address }, 'address');
    const deliveryTimeError = !validateFunc({ deliveryTime }, 'deliveryTime');
    const minimumOrderError = !validateFunc({ minimumOrder }, 'minimumOrder');
    const usernameError = !validateFunc({ name: username }, 'name');
    const passwordError = !validateFunc({ password }, 'password');
    const salesTaxError = !validateFunc({ salesTax }, 'salesTax');

    if (deliveryTime < 0 || minimumOrder < 0 || salesTax < 0) {
      setDeliveryTimeError(true);
      setMinimumOrderError(true);
      setSalesTaxError(true);
      setErrors(t('Negative Values Not Allowed'));
      return false;
    }

    setNameError(nameError);
    setAddressError(addressError);
    setUsernameError(usernameError);
    setPasswordError(passwordError);
    setDeliveryTimeError(deliveryTimeError);
    setMinimumOrderError(minimumOrderError);
    setSalesTaxError(salesTaxError);
    if (
      !(
        nameError &&
        addressError &&
        usernameError &&
        passwordError &&
        deliveryTimeError &&
        minimumOrderError &&
        salesTaxError
      )
    ) {
      setErrors(t('FieldsRequired'));
    }
    return (
      nameError &&
      addressError &&
      usernameError &&
      passwordError &&
      deliveryTimeError &&
      minimumOrderError &&
      salesTaxError
    );
  };

  function update(cache, { data: { createRestaurant } }) {
    const { restaurantByOwner } = cache.readQuery({
      query: RESTAURANT_BY_OWNER,
      variables: { id: owner }
    });
    cache.writeQuery({
      query: RESTAURANT_BY_OWNER,
      variables: { id: owner },
      data: {
        restaurantByOwner: {
          ...restaurantByOwner,
          restaurants: [...restaurantByOwner.restaurants, createRestaurant]
        }
      }
    });
  }

  const clearFormValues = () => {
    const form = formRef.current;
    // Clear all text/number inputs
    form.name.value = '';
    form.address.value = '';
    form.username.value = '';
    form.password.value = '';
    form.deliveryTime.value = '20'; // Default delivery time
    form.minimumOrder.value = '0';  // Default minimum order
    form.salesTax.value = '0';      // Default sales tax
    
    // Clear all state variables
    setImgUrl('');
    setLogoUrl('');
    setRestaurantCuisines([]);
    setShowPassword(false);
    
    // Reset all error states
    setNameError(null);
    setAddressError(null);
    setUsernameError(null);
    setPasswordError(null);
    setDeliveryTimeError(null);
    setMinimumOrderError(null);
    setSalesTaxError(null);
    
    // Clear any alerts/errors
    setErrors('');
};

  const handleCuisineChange = event => {
    const {
      target: { value }
    } = event;
    setRestaurantCuisines(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const handleWheel = (e) => {
    e.target.blur();
  };

  return (
    <Box container className={classes.container}>
      <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('AddRestaurant')}
          </Typography>
        </Box>
        <Box ml={10} mt={1}>
          <label>{t('Available')}</label>
          <Switch defaultChecked style={{ color: 'black' }} />
        </Box>
        <IconButton onClick={handleCloseModal} style={{ position: 'absolute', right: 5, top: 35 }}>
          <Close />
        </IconButton>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Username')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="username"
                  id="input-type-username"
                  placeholder={t('RestaurantUsername')}
                  type="text"
                  autoComplete="off"
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
                    event.target.value = event.target.value
                      .trim()
                      .replace(/\s/g, '')
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
                  placeholder={t('RestaurantPassword')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  defaultValue={''}
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
                  {t('Name')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="name"
                  id="input-type-name"
                  placeholder={t('RestaurantName')}
                  type="text"
                  defaultValue={''}
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
                  placeholder={t('RestaurantAddress')}
                  type="text"
                  defaultValue={''}
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
                  type="number"
                  inputProps={{ min: 0, onWheel: handleWheel }}
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
                  type="number"
                  inputProps={{ min: 0, onWheel: handleWheel }}
                  disableUnderline
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
                  type="number"
                  inputProps={{ min: 0, onWheel: handleWheel }}
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
                <Select
                  multiple
                  value={restaurantCuisines}
                  onChange={handleCuisineChange}
                  input={<OutlinedInput />}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return t('Select Cuisines');
                    }
                    return selected.join(', ');
                  }}
                  MenuProps={MenuProps}
                  className={[globalClasses.input]}
                  style={{ margin: '0 0 0 -20px', padding: '0px 0px', border: 0 }}>
                  {cuisinesInDropdown?.map(cuisine => (
                    <MenuItem
                      key={'restaurant-cuisine-' + cuisine}
                      value={cuisine}
                      style={{ color: '#000000', textTransform: 'capitalize' }}>
                      <Checkbox
                        checked={restaurantCuisines.indexOf(cuisine) > -1}
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
                e.preventDefault();
                if (onSubmitValidaiton()) {
                  const imgUpload = await uploadImageToCloudinary(imgUrl);
                  const logoUpload = await uploadImageToCloudinary(logoUrl);
                  const form = formRef.current;
                  const name = form.name.value;
                  const address = form.address.value;
                  const deliveryTime = form.deliveryTime.value;
                  const minimumOrder = form.minimumOrder.value;
                  const username = form.username.value;
                  const password = form.password.value;
                  const shopType = form.shopType.value;

                  mutate({
                    variables: {
                      owner,
                      restaurant: {
                        name,
                        address,
                        image: imgUpload || 'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp',
                        logo: logoUpload || defaultLogo,
                        deliveryTime: Number(deliveryTime),
                        minimumOrder: Number(minimumOrder),
                        username,
                        password,
                        shopType,
                        cuisines: restaurantCuisines
                      }
                    }
                  });
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
    </Box>
  );
};

export default withTranslation()(CreateRestaurant);