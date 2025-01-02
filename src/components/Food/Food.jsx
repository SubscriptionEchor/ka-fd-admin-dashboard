// import React, { useState, useRef, useEffect } from 'react';
// import { useQuery, useMutation, gql } from '@apollo/client';
// import { validateFunc } from '../../constraints/constraints';
// import { withTranslation } from 'react-i18next';
// import ConfigurableValues from '../../config/constants';
// import { getRestaurantDetail, createFood, editFood } from '../../apollo';
// import AddonComponent from '../Addon/Addon';
// import useStyles from './styles';
// import useGlobalStyles from '../../utils/globalStyles';
// import {
//   Box,
//   Typography,
//   Input,
//   Alert,
//   Modal,
//   Button,
//   Select,
//   MenuItem,
//   Grid,
//   Checkbox,
//   FormControlLabel,
//   useTheme
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ImageCropper from '../ImageCropper/ImageCropper';

// const CREATE_FOOD = gql`
//   ${createFood}
// `;
// const EDIT_FOOD = gql`
//   ${editFood}
// `;
// const GET_CATEGORIES = gql`
//   ${getRestaurantDetail}
// `;
// const GET_ADDONS = gql`
//   ${getRestaurantDetail}
// `;
// const GET_DIETARY_OPTIONS = gql`
//   query GetDietaryOptions {
//     bootstrap {
//       dietaryOptions {
//         enumVal
//         displayName
//         isActive
//       }
//     }
//   }
// `;
// const GET_TAGS = gql`
//   query GetFoodTags {
//     bootstrap {
//       foodTags {
//         enumVal
//         displayName
//         isActive
//         restaurantDetailHandlingType
//       }
//     }
//   }
// `;

// function Food(props) {
//   const theme = useTheme();

//   const { ImgUrlS3 } = ConfigurableValues();
//   const formRef = useRef();
//   const mutation = props.food ? EDIT_FOOD : CREATE_FOOD;
//   const [title, setTitle] = useState(props.food ? props.food.title : '');
//   const [description, setDescription] = useState(
//     props.food ? props.food.description : ''
//   );
//   const [category, setCategory] = useState(
//     props.food ? props.food.categoryId : ''
//   );
//   const [dietaryOption, setDietaryOption] = useState('');
//   const [tags, setTags] = useState([]);
//   const [imgMenu, imgMenuSetter] = useState(props.food ? props.food.image : '');
//   const [variationIndex, variationIndexSetter] = useState(0);
//   const [mainError, mainErrorSetter] = useState('');
//   const [success, successSetter] = useState('');
//   const [titleError, titleErrorSetter] = useState(null);
//   const [categoryError, categoryErrorSetter] = useState(null);
//   const [addonModal, addonModalSetter] = useState(false);
//   const [variation, variationSetter] = useState(
//     props.food
//       ? props.food.variations.map(({ title, price, discounted, addons }) => {
//         return {
//           title,
//           price,
//           discounted,
//           addons,
//           titleError: null,
//           priceError: null
//         };
//       })
//       : [
//         {
//           title: '',
//           price: '',
//           discounted: '',
//           addons: [],
//           titleError: null,
//           priceError: null
//         }
//       ]
//   );

//   const restaurantId = localStorage.getItem('restaurantId');

//   const handleDescriptionChange = (e) => {
//     const newValue = e.target.value;
//     if (newValue.length <= 18) {
//       setDescription(newValue);
//     }
//   };

//   const clearFields = () => {
//     variationSetter([
//       {
//         title: '',
//         price: '',
//         discounted: '',
//         addons: [],
//         titleError: null,
//         priceError: null
//       }
//     ]);
//     imgMenuSetter('');
//     titleErrorSetter(null);
//     categoryErrorSetter(null);
//   };

//   const onDismiss = () => {
//     successSetter('');
//     mainErrorSetter('');
//   };

//   const onError = (error) => {
//     mainErrorSetter(`${t('ActionFailedTryAgain')} ${error}`);
//     successSetter('');
//     setTimeout(onDismiss, 3000);
//   };
//   const onCompleted = (data) => {
//     if (!props.food) clearFields();
//     const message = props.food
//       ? t('FoodUpdatedSuccessfully')
//       : t('FoodAddedSuccessfully');
//     mainErrorSetter('');
//     successSetter(message);
//     setTitle('');
//     setDescription('');
//     setTimeout(onDismiss, 3000);
//   };
//   const [mutate, { loading: mutateLoading }] = useMutation(mutation, {
//     onError,
//     onCompleted
//   });

//   const {
//     data: dataCategories,
//     error: errorCategories,
//     loading: loadingCategories
//   } = useQuery(GET_CATEGORIES, {
//     variables: {
//       id: restaurantId
//     }
//   });

//   const {
//     data: dataAddons,
//     error: errorAddons,
//     loading: loadingAddons
//   } = useQuery(GET_ADDONS, {
//     variables: {
//       id: restaurantId
//     }
//   });

//   const {
//     data: dataDietaryOptions,
//     error: errorDietaryOptions,
//     loading: loadingDietaryOptions
//   } = useQuery(GET_DIETARY_OPTIONS);

//   const {
//     data: dataTags,
//     error: errorTags,
//     loading: loadingTags
//   } = useQuery(GET_TAGS);

//   const onBlur = (setter, field, state) => {
//     setter(!validateFunc({ [field]: state }, field));
//   };
//   const filterImage = (event) => {
//     let images = [];
//     for (var i = 0; i < event.target.files.length; i++) {
//       images[i] = event.target.files.item(i);
//     }
//     images = images.filter((image) => image.name.match(/\.(jpg|jpeg|png|gif)$/));
//     return images.length ? images[0] : undefined;
//   };

//   const imageToBase64 = (imgUrl) => {
//     const fileReader = new FileReader();
//     fileReader.onloadend = () => {
//       imgMenuSetter(fileReader.result);
//     };
//     fileReader.readAsDataURL(imgUrl);
//   };

//   const selectImage = (event, state) => {
//     const result = filterImage(event);
//     if (result) imageToBase64(result);
//   };

//   const onAdd = (index) => {
//     const variations = variation;
//     if (index === variations.length - 1) {
//       variations.push({
//         title: '',
//         price: '',
//         discounted: '',
//         addons: [],
//         titleError: null,
//         priceError: null
//       });
//     } else {
//       variations.splice(index + 1, 0, {
//         title: '',
//         price: '',
//         discounted: '',
//         addons: [],
//         titleError: null,
//         priceError: null
//       });
//     }
//     variationSetter([...variations]);
//   };
//   const onRemove = (index) => {
//     if (variation.length === 1 && index === 0) {
//       return;
//     }
//     const variations = variation;
//     variations.splice(index, 1);
//     variationSetter([...variations]);
//   };
//   const handleVariationChange = (event, index, type) => {
//     const variations = variation;

//     if (type === 'title') {
//       variations[index][type] =
//         event.target.value.length === 1
//           ? event.target.value.toUpperCase()
//           : event.target.value;
//       variationSetter([...variations]);
//     } else if (type === 'discounted') {
//       const newValue =
//         event.target.value === '' ? '' : Math.max(0, parseFloat(event.target.value));
//       variations[index][type] = newValue;
//       variationSetter([...variations]);
//     } else {
//       variations[index][type] = event.target.value;
//       variationSetter([...variations]);
//     }
//   };

//   const onSubmitValidaiton = () => {
//     const titleError = !validateFunc(
//       { title: formRef.current['input-title'].value },
//       'title'
//     );
//     const categoryError = !validateFunc(
//       { category: formRef.current['input-category'].value },
//       'category'
//     );
//     const variations = variation;
//     variations.map((variationItem) => {
//       variationItem.priceError = !validateFunc(
//         { price: variationItem.price },
//         'price'
//       );
//       let error = false;
//       const occ = variation.filter((v) => v.title === variationItem.title);
//       if (occ.length > 1) error = true;
//       variationItem.titleError = error
//         ? !error
//         : variations.length > 1
//           ? !validateFunc({ title: variationItem.title }, 'title')
//           : true;

//       return variationItem;
//     });
//     const variationsError = !variation.filter(
//       (variationItem) => !variationItem.priceError || !variationItem.titleError
//     ).length;
//     titleErrorSetter(titleError);
//     categoryErrorSetter(categoryError);
//     variationSetter([...variations]);
//     return titleError && categoryError && variationsError;
//   };

//   const onBlurVariation = (index, type) => {
//     const variations = [...variation];
//     if (type === 'title') {
//       const occ = variations.filter((v) => v.title === variations[index][type]);
//       if (occ.length > 1) {
//         variations[index][type + 'Error'] = false;
//       } else {
//         variations[index][type + 'Error'] =
//           variations.length > 1
//             ? !validateFunc({ [type]: variations[index][type] }, type)
//             : true;
//       }
//     }

//     if (type === 'price') {
//       variations[index][type + 'Error'] = !validateFunc(
//         { [type]: variations[index][type] },
//         type
//       );
//     }
//     variationSetter([...variations]);
//   };

//   const updateAddonsList = (ids) => {
//     const variations = variation;
//     variations[variationIndex].addons = variations[
//       variationIndex
//     ].addons.concat(ids);
//     variationSetter([...variations]);
//   };

//   const toggleModal = (index) => {
//     addonModalSetter((prev) => !prev);
//     variationIndexSetter(index);
//   };
//   const onSelectAddon = (index, id) => {
//     const variations = variation;
//     const addon = variations[index].addons.indexOf(id);
//     if (addon < 0) variations[index].addons.push(id);
//     else variations[index].addons.splice(addon, 1);
//     variationSetter([...variations]);
//   };

//   const uploadImageToCloudinary = async() => {
//     if (imgMenu === '') return imgMenu;
//     if (props.food && props.food.image === imgMenu) return imgMenu;

//     const apiUrl = ImgUrlS3;
//     const token = JSON.parse(localStorage.getItem('user-enatega'));

//     try {
//         // If the imgMenu is a base64 string, convert it to a blob
//         const fetchImageData = async(base64Data) => {
//             const response = await fetch(base64Data);
//             const blob = await response.blob();
//             return blob;
//         };

//         const formData = new FormData();

//         // Handle different types of image input
//         if (typeof imgMenu === 'string' && imgMenu.startsWith('data:')) {
//             // Handle base64 image
//             const blob = await fetchImageData(imgMenu);
//             formData.append('file', blob, 'image.jpg');
//         } else if (imgMenu instanceof File || imgMenu instanceof Blob) {
//             // Handle File or Blob directly
//             formData.append('file', imgMenu);
//         } else if (typeof imgMenu === 'string' && imgMenu.startsWith('http')) {
//             // Handle image URL
//             const response = await fetch(imgMenu);
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
//         throw new Error('Image upload failed: ' + e.message);
//     }
// };

//   const { t } = props;
//   const classes = useStyles();
//   const globalClasses = useGlobalStyles();

//   const handleWheel = (e) => {
//     e.target.blur();
//   };

//   useEffect(() => {
//     if (!props.food) {
//       return
//     }
//     console.clear()
//     console.log(props.food)
//     setDietaryOption(props.food?.dietaryType || "")
//     setTags(props.food?.tags || [])
//   }, [])

//   return (
//     <Box container className={[classes.container, classes.width60]}>
//       <Box className={classes.flexRow}>
//         <Box
//           item
//           className={props.food ? classes.headingBlack : classes.heading}
//         >
//           <Typography variant="h6" className={classes.textWhite}>
//             {props.food ? t('Edit Food') : t('Add Food')}
//           </Typography>
//         </Box>
//       </Box>
//       <Box className={classes.form}>
//         <form ref={formRef}>
//           <Box>
//             <Typography className={classes.labelText}>{t('Title')}</Typography>
//             <Input
//               style={{ marginTop: -1 }}
//               id="input-title"
//               name="input-title"
//               placeholder={t('Title')}
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               onBlur={(event) =>
//                 onBlur(titleErrorSetter, 'title', event.target.value)
//               }
//               disableUnderline
//               className={[
//                 globalClasses.input,
//                 titleError === false
//                   ? globalClasses.inputError
//                   : titleError === true
//                     ? globalClasses.inputSuccess
//                     : ''
//               ]}
//             />
//             <Typography className={classes.labelText}>
//               {t('Description')}
//             </Typography>
//             <Input
//               style={{ marginTop: -1 }}
//               id="input-description"
//               name="input-description"
//               placeholder={t('Description')}
//               type="text"
//               value={description}
//               // onChange={(e) => setDescription(e.target.value)}
//               onChange={handleDescriptionChange}
//               disableUnderline
//               className={[globalClasses.input]}
//             />
//             {loadingCategories && <div>Loading...</div>}
//             {errorCategories && <div>Error {errorCategories.message}</div>}

//             <Box className={globalClasses.flexRow}>
//               <Select
//                 id="input-category"
//                 name="input-category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 onBlur={(event) =>
//                   onBlur(categoryErrorSetter, 'category', event.target.value)
//                 }
//                 displayEmpty
//                 renderValue={(selected) => {
//                   if (!selected) {
//                     return t('Select Category');
//                   }
//                   return dataCategories?.restaurant.categories.find(
//                     (cat) => cat._id === selected
//                   )?.title;
//                 }}
//                 inputProps={{ 'aria-label': 'Without label' }}
//                 className={[
//                   globalClasses.input,
//                   categoryError === false
//                     ? globalClasses.inputError
//                     : categoryError === true
//                       ? globalClasses.inputSuccess
//                       : ''
//                 ]}
//               >
//                 {dataCategories &&
//                   Array.from(
//                     new Set(
//                       dataCategories.restaurant.categories
//                         .filter(
//                           (category) => category.title !== 'Default Category'
//                         )
//                         .map((category) => category.title.toLowerCase())
//                     )
//                   ).map((uniqueTitle) => {
//                     const category = dataCategories.restaurant.categories.find(
//                       (cat) => cat.title.toLowerCase() === uniqueTitle
//                     );
//                     return (
//                       <MenuItem
//                         value={category._id}
//                         key={category._id}
//                         style={{ color: 'black' }}
//                       >
//                         {category.title}
//                       </MenuItem>
//                     );
//                   })}
//               </Select>
//             </Box>

//             {loadingDietaryOptions && <div>Loading...</div>}
//             {errorDietaryOptions && (
//               <div>Error {errorDietaryOptions.message}</div>
//             )}

//             <Box className={globalClasses.flexRow}>
//               <Select
//                 id="input-dietary-option"
//                 name="input-dietary-option"
//                 value={dietaryOption}
//                 onChange={(e) => setDietaryOption(e.target.value)}
//                 displayEmpty
//                 renderValue={(selected) => {
//                   if (!selected) {
//                     return t('Select Dietary Option');
//                   }
//                   return dataDietaryOptions?.bootstrap.dietaryOptions.find(
//                     (option) => option.enumVal === selected
//                   )?.displayName;
//                 }}
//                 inputProps={{ 'aria-label': 'Without label' }}
//                 className={[globalClasses.input]}
//               >
//                 {dataDietaryOptions &&
//                   dataDietaryOptions.bootstrap.dietaryOptions
//                     .filter((option) => option.isActive)
//                     .map((option) => (
//                       <MenuItem
//                         value={option.enumVal}
//                         key={option.enumVal}
//                         style={{ color: 'black' }}
//                       >
//                         {option.displayName}
//                       </MenuItem>
//                     ))}
//               </Select>
//             </Box>

//             {loadingTags && <div>Loading...</div>}
//             {errorTags && <div>Error {errorTags.message}</div>}

//             <Box className={globalClasses.flexRow}>
//               <Select
//                 id="input-tags"
//                 name="input-tags"
//                 multiple
//                 value={tags}
//                 onChange={(e) => setTags(e.target.value)}
//                 displayEmpty
//                 renderValue={(selected) => {
//                   if (selected.length === 0) {
//                     return t('Select Tags');
//                   }
//                   return selected
//                     .map(
//                       (value) =>
//                         dataTags?.bootstrap.foodTags.find(
//                           (tag) => tag.enumVal === value
//                         )?.displayName
//                     )
//                     .join(', ');
//                 }}
//                 inputProps={{ 'aria-label': 'Without label' }}
//                 className={[globalClasses.input]}
//               >
//                 {dataTags &&
//                   dataTags.bootstrap.foodTags
//                     .filter((tag) => tag.isActive)
//                     .map((tag) => (
//                       <MenuItem
//                         value={tag.enumVal}
//                         key={tag.enumVal}
//                         style={{ color: 'black' }}
//                       >
//                         {tag.displayName}
//                       </MenuItem>
//                     ))}
//               </Select>
//             </Box>

//             <Box
//               mt={3}
//               style={{ alignItems: 'center' }}
//               className={globalClasses.flex}
//             >

//               {imgMenu && (
//                 <img
//                   className={classes.image}
//                   alt="..."
//                   src={
//                     imgMenu
//                   }
//                 />
//               )}

//               <ImageCropper
//                 onCropComplete={(croppedImage) => {
//                   imgMenuSetter(croppedImage);
//                 }}
//               />
//             </Box>

//             <Box className={classes.container}>
//               <Box className={classes.flexRow}>
//                 <Box item className={classes.heading}>
//                   <Typography variant="p" className={classes.textWhite}>
//                     {t('Variations')}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box classes={classes.form}>
//                 {variation.map((variationItem, index) => (
//                   <Box key={variationItem._id} pl={1} pr={1}>
//                     <Box className={globalClasses.flexRow}>
//                       <Grid container>
//                         <Grid item xs={12} sm={6}>
//                           <Box mt={2}>
//                             <Typography className={classes.labelText}>
//                               {t('UniqueTitle')}
//                             </Typography>
//                             <Input
//                               style={{ marginTop: -1 }}
//                               id="input-type"
//                               placeholder={t('Title')}
//                               type="text"
//                               value={variationItem.title}
//                               onChange={(event) => {
//                                 handleVariationChange(
//                                   event,
//                                   index,
//                                   'title',
//                                   'variations'
//                                 );
//                               }}
//                               onBlur={(event) => {
//                                 onBlurVariation(index, 'title');
//                               }}
//                               disableUnderline
//                               className={[
//                                 globalClasses.input,
//                                 variationItem.titleError === false
//                                   ? globalClasses.inputError
//                                   : variationItem.titleError === true
//                                     ? globalClasses.inputSuccess
//                                     : ''
//                               ]}
//                             />
//                           </Box>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Box mt={2}>
//                             <Typography className={classes.labelText}>
//                               {t('Price')}
//                             </Typography>
//                             <Input
//                               style={{ marginTop: -1 }}
//                               value={variationItem.price}
//                               id="input-price"
//                               placeholder={t('Price')}
//                               inputProps={{ min: 0, onWheel: handleWheel }}
//                               type="number"
//                               onChange={(event) => {
//                                 handleVariationChange(
//                                   event,
//                                   index,
//                                   'price',
//                                   'variations'
//                                 );
//                               }}
//                               onBlur={(event) => {
//                                 onBlurVariation(index, 'price');
//                               }}
//                               disableUnderline
//                               className={[
//                                 globalClasses.input,
//                                 variationItem.priceError === false
//                                   ? globalClasses.inputError
//                                   : variationItem.priceError === true
//                                     ? globalClasses.inputSuccess
//                                     : ''
//                               ]}
//                             />
//                           </Box>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Box mt={2}>
//                             <Typography className={classes.labelText}>
//                               {t('Discounted')}
//                             </Typography>
//                             <Input
//                               style={{ marginTop: -1 }}
//                               value={variationItem.discounted}
//                               id="input-discounted"
//                               placeholder={t('Discounted')}
//                               inputProps={{ min: 0, onWheel: handleWheel }}
//                               type="number"
//                               onChange={(event) => {
//                                 handleVariationChange(
//                                   event,
//                                   index,
//                                   'discounted',
//                                   'variations'
//                                 );
//                               }}
//                               onBlur={(event) => {
//                                 onBlurVariation(index, 'discounted');
//                               }}
//                               disableUnderline
//                               className={[globalClasses.input]}
//                             />
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </Box>

//                     <Box>
//                       <RemoveIcon
//                         style={{
//                           backgroundColor: theme.palette.common.black,
//                           color: theme.palette.warning.dark,
//                           borderRadius: '50%',
//                           marginTop: 12,
//                           marginRight: 10
//                         }}
//                         onClick={() => {
//                           onRemove(index);
//                         }}
//                       />
//                       <AddIcon
//                         style={{
//                           backgroundColor: theme.palette.warning.dark,
//                           color: theme.palette.common.black,
//                           borderRadius: '50%',
//                           marginTop: 12
//                         }}
//                         onClick={() => {
//                           onAdd(index);
//                         }}
//                       />
//                     </Box>
//                     <Box>
//                       {loadingAddons && t('LoadingDots')}
//                       {errorAddons && t('ErrorDots')}
//                       {dataAddons &&
//                         dataAddons.restaurant.addons
//                           .filter((addon) => addon.title !== 'Default Addon')
//                           .map((addon) => (
//                             <Grid
//                               item
//                               xs={12}
//                               md={6}
//                               key={addon._id}
//                               style={{ textAlign: 'left', paddingLeft: 20 }}
//                             >
//                               <FormControlLabel
//                                 control={
//                                   <Checkbox
//                                     value={addon._id}
//                                     checked={variation[index].addons.includes(
//                                       addon._id
//                                     )}
//                                     onChange={() =>
//                                       onSelectAddon(index, addon._id)
//                                     }
//                                   />
//                                 }
//                                 label={`${addon.title} (Description: ${addon.description})(Min: ${addon.quantityMinimum})(Max: ${addon.quantityMaximum})`}
//                               />
//                             </Grid>
//                           ))}
//                     </Box>
//                     <Button
//                       className={classes.button}
//                       onClick={() => toggleModal(index)}
//                     >
//                       {t('NewAddon')}
//                     </Button>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           </Box>
//           <Box>
//             <Button
//               className={globalClasses.button}
//               disabled={mutateLoading}
//               onClick={async(e) => {
//                 e.preventDefault();
//                 if (onSubmitValidaiton() && !mutateLoading) {
//                   mutate({
//                     variables: {
//                       foodInput: {
//                         restaurant: restaurantId,
//                         _id: props.food ? props.food._id : '',
//                         title: formRef.current['input-title'].value,
//                         description: formRef.current['input-description'].value,
//                         image: await uploadImageToCloudinary(),
//                         category: formRef.current['input-category'].value,
//                         dietaryType: dietaryOption, // Use the correct field name
//                         tags: tags,
//                         variations: variation.map(({ title, price, discounted, addons }) => ({
//                           title,
//                           price: +price,
//                           discounted: +discounted,
//                           addons
//                         }))
//                       }
//                     }
//                   });
//                   setTimeout(() => {
//                     props.onClose();
//                     if (props?.refreshData) {
//                       props.refreshData()
//                     }
//                   }, 4000);
//                 }
//               }}
//             >
//               {t('Save')}
//             </Button>
//           </Box>
//           <Box mt={2}>
//             {success && (
//               <Alert
//                 className={globalClasses.alertSuccess}
//                 variant="filled"
//                 severity="success"
//               >
//                 {success}
//               </Alert>
//             )}
//             {mainError && (
//               <Alert
//                 className={globalClasses.alertError}
//                 variant="filled"
//                 severity="error"
//               >
//                 {mainError}
//               </Alert>
//             )}
//           </Box>
//         </form>
//       </Box>
//       <Modal
//         style={{
//           marginLeft: '25%',
//           overflowY: 'auto'
//         }}
//         open={addonModal}
//         onClose={() => {
//           toggleModal();
//         }}
//       >
//         <AddonComponent updateAddonsList={updateAddonsList} />
//       </Modal>
//     </Box>
//   );
// }
// export default withTranslation()(Food);