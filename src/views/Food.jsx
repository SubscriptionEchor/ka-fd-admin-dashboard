
// import React, { useState, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   FormControlLabel,
//   Checkbox,
//   Button,
//   IconButton,
//   Drawer,
//   Paper,
//   InputLabel,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableFooter,
//   Dialog,
//   Chip, DialogTitle
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { styled } from '@mui/material/styles';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { gql, useQuery } from '@apollo/client';

// // GraphQL Queries
// const GET_FOOD_TAGS = gql`
//   query FoodTags {
//     bootstrap {
//       foodTags {
//         enumVal
//         displayName
//         isActive
//       }
//       dietaryOptions {
//         enumVal
//         displayName
//         isActive
//       }
//       allergens {
//         enumVal
//         displayName
//         description
//       }
//     }
//   }
// `;

// const GET_MENU = gql`
//   query GetMenu($restaurantId: ID!) {
//     getMenu(restaurantId: $restaurantId) {
//       _id
//       restaurantId
//       categoryData {
//         _id
//         name
//         active
//         foodList
//         createdAt
//         updatedAt
//       }
//       food {
//         _id
//         name
//         hasVariation
//         dietaryType
//         imageData {
//         images {
//           url
//         }
//       }
//         tags
//         variationList {
//           _id
//           type
//           title
//           optionSetList
//           price
//           discountedPrice
//           outOfStock
//           createdAt
//         }
//       }
//     }
//   }
// `;

// const GET_RESTAURANT_CATEGORIES = gql`
//   query Restaurant($restaurantId: String!) {
//     restaurant(id: $restaurantId) {
//       _id
//       categories {
//         title
//       }
//     }
//   }
// `;


// // Styled Components
// const StyledBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   backgroundColor: '#f5f5f5',
//   minHeight: '100vh',
// }));

// const MainContent = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(3),
// }));

// const HeaderIcon = styled(Box)(({ theme }) => ({
//   backgroundColor: '#FFF9C4',
//   padding: theme.spacing(1),
//   borderRadius: theme.shape.borderRadius,
//   color: '#FBC02D',
// }));

// const UploadZone = styled(Box)(({ theme }) => ({
//   border: '2px dashed #ccc',
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(4),
//   textAlign: 'center',
//   cursor: 'pointer',
//   '&:hover': {
//     borderColor: '#FBC02D',
//   },
// }));

// const PreviewImage = styled('img')({
//   maxHeight: 160,
//   maxWidth: '100%',
//   borderRadius: 8,
// });

// const VariationCard = styled(Card)(({ theme }) => ({
//   position: 'relative',
//   marginBottom: theme.spacing(2),
// }));

// const YellowButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#FBC02D',
//   '&:hover': {
//     backgroundColor: '#F9A825',
//   },
// }));

// const DishManagement = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [sortDirection, setSortDirection] = useState('desc');
//   const restaurantId = localStorage.getItem('restaurantId');

//   const [showPriceDialog, setShowPriceDialog] = useState(false);
//   const [selectedDish, setSelectedDish] = useState(null);
//   const [newPrice, setNewPrice] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [customOption, setCustomOption] = useState({
//     title: '',
//     description: '',
//     minQuantity: 0,
//     maxQuantity: 1,
//     dishes: []
//   });
//   const [selectOpen, setSelectOpen] = useState(false);

//   // Available dishes data (you can replace this with your actual data)
//   const availableDishes = [
//     { id: 'margherita', name: 'Margherita Pizza', price: 30.00 },
//     { id: 'chicken-tikka', name: 'Chicken Tikka', price: 25.00 },
//     { id: 'pasta', name: 'Pasta Carbonara', price: 22.00 },
//     { id: 'caesar', name: 'Caesar Salad', price: 15.00 },
//     { id: 'fish', name: 'Fish and Chips', price: 28.00 },
//     { id: 'sushi', name: 'Sushi Roll', price: 32.00 }
//   ];


//   const handleDishSelect = (dish) => {
//     setSelectedDish(dish);
//     setNewPrice(dish.price.toString());
//     setShowPriceDialog(true);
//   };

//   const handleSavePrice = () => {
//     if (!selectedDish) return;

//     const updatedDishes = customOption.dishes.map(dish =>
//       dish.id === selectedDish.id
//         ? { ...dish, price: parseFloat(newPrice) }
//         : dish
//     );

//     setCustomOption({ ...customOption, dishes: updatedDishes });
//     setShowPriceDialog(false);
//     setSelectedDish(null);
//     setNewPrice('');
//   };

//   // Modify the getDisplayedRows function
//   const getDisplayedRows = () => {
//     if (!menuData?.getMenu?.food) return [];

//     // Create a sorted copy of the data
//     const sortedData = [...menuData.getMenu.food].sort((a, b) => {
//       // Get createdAt from optionSetList if available
//       const dateA = new Date(a.createdAt || 0);
//       const dateB = new Date(b.createdAt || 0);
//       return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
//     });

//     if (rowsPerPage === -1) return sortedData;
//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return sortedData.slice(startIndex, endIndex);
//   };


//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     setPage(0);
//   };



//   // Add this helper function
//   const sortByCreatedDate = (items) => {
//     if (!items) return [];
//     return [...items].sort((a, b) => {
//       const dateA = a.variationList?.[0]?.createdAt ? new Date(a.variationList[0].createdAt) : new Date(0);
//       const dateB = b.variationList?.[0]?.createdAt ? new Date(b.variationList[0].createdAt) : new Date(0);
//       return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
//     });
//   };

//   // FOR THE DIATERY OPTIONS AND TAGS AND ALLERGENS
//   const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_FOOD_TAGS);
//   // FOR MENU
//   const { data: menuData, loading: menuLoading, error: menuError } = useQuery(GET_MENU, {
//     variables: { restaurantId },
//   });
//   // GET THE CATEGORIES
//   const { data: restaurantData, loading: restaurantLoading, error: restaurantError } = useQuery(GET_RESTAURANT_CATEGORIES, {
//     variables: { restaurantId },
//   });

//   const [showOptions, setShowOptions] = useState(false);
//   const [variations, setVariations] = useState([
//     {
//       id: Date.now(),
//       title: '',
//       price: 0,
//       discounted: false,
//     },
//   ]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const fileInputRef = useRef(null);
//   const [showCustomOption, setShowCustomOption] = useState(false);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     dietary: '',
//     allergens: [],
//     tags: [],
//     showInMenu: true,
//   });

//   const handleAddVariation = () => {
//     setVariations([
//       ...variations,
//       {
//         id: Date.now(),
//         title: '',
//         price: 0,
//         discounted: false,
//       },
//     ]);
//   };

//   const handleRemoveVariation = (id) => {
//     setVariations(variations.filter((variation) => variation.id !== id));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   if (tagsLoading || menuLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (tagsError) {
//     return <Typography>Error loading tags: {tagsError.message}</Typography>;
//   }

//   if (menuError) {
//     return <Typography>Error loading menu: {menuError.message}</Typography>;
//   }

//   return (
//     <StyledBox>
//       <MainContent>
//         {/* Header */}
//         <Box display="flex" alignItems="center" gap={2} mb={4}>
//           <HeaderIcon>
//             <AddIcon />
//           </HeaderIcon>
//           <Typography variant="h5" fontWeight={600} sx={{ color: 'black' }}>
//             Dish Management
//           </Typography>
//         </Box>

//         {/* Form to Add New Dish */}
//         <Grid container spacing={3} sx={{ mt: 4 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Title"
//               name="title"
//               value={formData.title}
//               onChange={handleFormChange}
//               placeholder="Enter dish title"
//               variant="outlined"
//               InputLabelProps={{ style: { color: 'black' } }}
//               inputProps={{ style: { color: 'black' } }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleFormChange}
//               placeholder="Enter dish description"
//               multiline
//               rows={3}
//               variant="outlined"
//               InputLabelProps={{ style: { color: 'black' } }}
//               inputProps={{ style: { color: 'black' } }}
//             />
//           </Grid>

//           {/* Categories and Tags */}
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel sx={{ color: 'black' }}>Choose Dishes</InputLabel>
//               <Select
//                 value={customOption.dishes.map(d => d.id)}
//                 multiple
//                 open={isDropdownOpen}
//                 onOpen={() => setIsDropdownOpen(true)}
//                 onClose={() => setIsDropdownOpen(false)}
//                 onChange={(e) => {
//                   const selectedIds = e.target.value;
//                   const selectedDishes = availableDishes.filter(dish =>
//                     selectedIds.includes(dish.id)
//                   );
//                   setCustomOption({
//                     ...customOption,
//                     dishes: selectedDishes
//                   });
//                   setIsDropdownOpen(false); // Close dropdown after selection
//                 }}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {selected.map((id) => {
//                       const dish = availableDishes.find(d => d.id === id);
//                       return (
//                         <Chip
//                           key={id}
//                           label={dish?.name}
//                           onDelete={() => {
//                             const newDishes = customOption.dishes.filter(d => d.id !== id);
//                             setCustomOption({ ...customOption, dishes: newDishes });
//                           }}
//                         />
//                       );
//                     })}
//                   </Box>
//                 )}
//               >
//                 {availableDishes.map((dish) => (
//                   <MenuItem
//                     key={dish.id}
//                     value={dish.id}
//                     onClick={() => {
//                       if (!customOption.dishes.some(d => d.id === dish.id)) {
//                         handleDishSelect(dish);
//                         setIsDropdownOpen(false); // Close dropdown when opening price dialog
//                       }
//                     }}
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       color: 'black'
//                     }}
//                   >
//                     <Checkbox
//                       checked={customOption.dishes.some(d => d.id === dish.id)}
//                     />
//                     {dish.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Dietary</InputLabel>
//               <Select
//                 label="Dietary"
//                 name="dietary"
//                 value={formData.dietary}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 <MenuItem value="" sx={{ color: 'black' }}>
//                   Select Dietary
//                 </MenuItem>
//                 {tagsData?.bootstrap?.dietaryOptions?.map((option) => (
//                   <MenuItem key={option.enumVal} value={option.enumVal} sx={{ color: 'black' }}>
//                     {option.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Allergens</InputLabel>
//               <Select
//                 multiple
//                 label="Allergens"
//                 name="allergens"
//                 value={formData.allergens}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 {tagsData?.bootstrap?.allergens?.map((allergen) => (
//                   <MenuItem key={allergen.enumVal} value={allergen.enumVal} sx={{ color: 'black' }}>
//                     {allergen.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Tags</InputLabel>
//               <Select
//                 multiple
//                 label="Tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 {tagsData?.bootstrap?.foodTags?.map((tag) => (
//                   <MenuItem key={tag.enumVal} value={tag.enumVal} sx={{ color: 'black' }}>
//                     {tag.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Show in Menu Toggle */}
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.showInMenu}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, showInMenu: e.target.checked }))
//                   }
//                 />
//               }
//               label="Show this dish in menu"
//               sx={{ color: 'black' }}
//             />
//           </Grid>

//           {/* Image Upload */}
//           <Grid item xs={12}>
//             <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>
//               Food Image
//             </Typography>
//             <UploadZone onClick={() => fileInputRef.current?.click()}>
//               {selectedImage ? (
//                 <Box position="relative">
//                   <PreviewImage src={selectedImage} alt="Preview" />
//                   <IconButton
//                     size="small"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedImage(null);
//                     }}
//                     sx={{
//                       position: 'absolute',
//                       top: 8,
//                       right: 8,
//                       backgroundColor: 'white',
//                     }}
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </Box>
//               ) : (
//                 <Box>
//                   <CloudUploadIcon sx={{ fontSize: 48, color: '#bbb' }} />
//                   <Typography variant="body1" color="textSecondary" sx={{ color: 'black' }}>
//                     Upload a file
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary" sx={{ color: 'black' }}>
//                     PNG, JPG up to 10MB
//                   </Typography>
//                 </Box>
//               )}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImageUpload}
//               />
//             </UploadZone>
//           </Grid>

//           {/* Variations Section */}
//           <Grid item xs={12}>
//             <Box mb={2}>
//               <Typography variant="h6" sx={{ color: 'black' }}>
//                 Variations
//               </Typography>
//             </Box>

//             {variations.map((variation) => (
//               <VariationCard key={variation.id}>
//                 <CardContent>
//                   {variations.length > 1 && (
//                     <IconButton
//                       sx={{
//                         position: 'absolute',
//                         top: -10,
//                         right: -10,
//                         color: 'error.main',
//                       }}
//                       onClick={() => handleRemoveVariation(variation.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   )}
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="Title"
//                         placeholder="Enter variation title"
//                         variant="outlined"
//                         value={variation.title}
//                         onChange={(e) => {
//                           const newVariations = variations.map((v) =>
//                             v.id === variation.id ? { ...v, title: e.target.value } : v
//                           );
//                           setVariations(newVariations);
//                         }}
//                         InputLabelProps={{ style: { color: 'black' } }}
//                         inputProps={{ style: { color: 'black' } }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="Price"
//                         type="number"
//                         variant="outlined"
//                         value={variation.price}
//                         onChange={(e) => {
//                           const newVariations = variations.map((v) =>
//                             v.id === variation.id ? { ...v, price: e.target.value } : v
//                           );
//                           setVariations(newVariations);
//                         }}
//                         sx={{
//                           '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
//                             '-webkit-appearance': 'none',
//                             margin: 0,
//                           },
//                           '& input[type=number]': {
//                             '-moz-appearance': 'textfield',
//                           },
//                         }}
//                         InputLabelProps={{ style: { color: 'black' } }}
//                         inputProps={{ style: { color: 'black' } }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={variation.discounted}
//                             onChange={(e) => {
//                               const newVariations = variations.map((v) =>
//                                 v.id === variation.id
//                                   ? { ...v, discounted: e.target.checked }
//                                   : v
//                               );
//                               setVariations(newVariations);
//                             }}
//                           />
//                         }
//                         label="Discounted"
//                         sx={{ color: 'black' }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         onClick={() => setShowOptions(true)}
//                       >
//                         Choose Options
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </VariationCard>
//             ))}

//             <Box mt={2} display="flex" justifyContent="center">
//               <YellowButton
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleSavePrice}
//               >
//                 Add Variation
//               </YellowButton>
//             </Box>
//           </Grid>

//           {/* Form Actions */}
//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
//               <Button variant="outlined">Cancel</Button>
//               <YellowButton variant="contained">Save Dish</YellowButton>
//             </Box>
//           </Grid>
//         </Grid>
//       </MainContent>

//       {/* Options Drawer */}
//       <Drawer
//         anchor="right"
//         open={showOptions}
//         onClose={() => setShowOptions(false)}
//       >
//         <Box sx={{ width: 360, p: 3 }}>
//           {showCustomOption ? (
//             <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 1 }}>
//               <TextField
//                 fullWidth
//                 label="Title"
//                 value={customOption.title}
//                 onChange={(e) => setCustomOption({ ...customOption, title: e.target.value })}
//                 sx={{ mb: 2 }}
//                 InputLabelProps={{ style: { color: 'black' } }}
//               />

//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 rows={3}
//                 value={customOption.description}
//                 onChange={(e) => setCustomOption({ ...customOption, description: e.target.value })}
//                 sx={{ mb: 2 }}
//                 InputLabelProps={{ style: { color: 'black' } }}
//               />

//               <Grid container spacing={2} sx={{ mb: 2 }}>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Min Quantity"
//                     type="number"
//                     value={customOption.minQuantity}
//                     onChange={(e) => setCustomOption({
//                       ...customOption,
//                       minQuantity: parseInt(e.target.value)
//                     })}
//                     InputLabelProps={{ style: { color: 'black' } }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Max Quantity"
//                     type="number"
//                     value={customOption.maxQuantity}
//                     onChange={(e) => setCustomOption({
//                       ...customOption,
//                       maxQuantity: parseInt(e.target.value)
//                     })}
//                     InputLabelProps={{ style: { color: 'black' } }}
//                   />
//                 </Grid>
//               </Grid>

//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel sx={{ color: 'black' }}>Choose Dishes</InputLabel>
//                 <Select
//                   value={customOption.dishes.map(d => d.id)}
//                   multiple
//                   onChange={(e) => {
//                     const selectedIds = e.target.value;
//                     const selectedDishes = availableDishes.filter(dish =>
//                       selectedIds.includes(dish.id)
//                     );
//                     setCustomOption({
//                       ...customOption,
//                       dishes: selectedDishes
//                     });
//                   }}
//                   onClose={() => {
//                     // Close the select dropdown
//                     const selectElement = document.activeElement;
//                     if (selectElement) {
//                       selectElement.blur();
//                     }
//                   }}
//                   renderValue={(selected) => (
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {selected.map((id) => {
//                         const dish = availableDishes.find(d => d.id === id);
//                         return (
//                           <Chip
//                             key={id}
//                             label={dish?.name}
//                             onDelete={() => {
//                               const newDishes = customOption.dishes.filter(d => d.id !== id);
//                               setCustomOption({ ...customOption, dishes: newDishes });
//                             }}
//                           />
//                         );
//                       })}
//                     </Box>
//                   )}
//                 >
//                   {availableDishes.map((dish) => (
//                     <MenuItem
//                       key={dish.id}
//                       value={dish.id}
//                       onClick={() => !customOption.dishes.some(d => d.id === dish.id) && handleDishSelect(dish)}
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1,
//                         color: 'black'
//                       }}
//                     >
//                       <Checkbox
//                         checked={customOption.dishes.some(d => d.id === dish.id)}
//                       />
//                       {dish.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               {customOption.dishes.length > 0 && (
//                 <Box sx={{ mb: 2 }}>
//                   <Typography variant="subtitle2" sx={{ mb: 1, color: 'black' }}>
//                     Selected Dishes with Prices:
//                   </Typography>
//                   {customOption.dishes.map((dish) => (
//                     <Box
//                       key={dish.id}
//                       sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         p: 1,
//                         mb: 1,
//                         bgcolor: 'white',
//                         borderRadius: 1,
//                         border: '1px solid',
//                         borderColor: 'grey.300'
//                       }}
//                     >
//                       <Typography sx={{ color: 'black' }}>{dish.name}</Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Typography sx={{ color: 'black' }}>${dish.price.toFixed(2)}</Typography>
//                         <IconButton
//                           size="small"
//                           onClick={() => {
//                             setSelectedDish(dish);
//                             setNewPrice(dish.price.toString());
//                             setShowPriceDialog(true);
//                           }}
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={() => {
//                             const newDishes = customOption.dishes.filter(d => d.id !== dish.id);
//                             setCustomOption({ ...customOption, dishes: newDishes });
//                           }}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </Box>
//                   ))}
//                 </Box>
//               )}

//               <Box display="flex" justifyContent="flex-end" gap={2}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => setShowCustomOption(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <YellowButton
//                   variant="contained"
//                   onClick={() => {
//                     setShowCustomOption(false);
//                   }}
//                 >
//                   Add Option
//                 </YellowButton>
//               </Box>
//             </Box>
//           ) : (
//             <>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mb={3}
//               >
//                 <Typography variant="h6" sx={{ color: 'black' }}>
//                   Choose Options
//                 </Typography>
//                 <IconButton onClick={() => setShowOptions(false)}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mb={2}
//               >
//                 <Typography variant="subtitle1" sx={{ color: 'black' }}>
//                   Available Options
//                 </Typography>
//                 <YellowButton
//                   variant="contained"
//                   size="small"
//                   startIcon={<AddIcon />}
//                   onClick={() => setShowCustomOption(true)}
//                 >
//                   Add Custom Option
//                 </YellowButton>
//               </Box>
//               {[
//                 {
//                   title: 'Choose your beverages',
//                   desc: 'Select your preferred drinks',
//                   quantity: '0 - 2',
//                 },
//                 {
//                   title: 'Choose your sides',
//                   desc: 'Select your preferred side dishes',
//                   quantity: '0 - 2',
//                 },
//                 {
//                   title: 'Choose your bread',
//                   desc: 'Select your preferred bread type',
//                   quantity: '0 - 1',
//                 },
//               ].map((option, index) => (
//                 <Box
//                   key={index}
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={2}
//                   mb={2}
//                 >
//                   <Checkbox />
//                   <Box>
//                     <Typography variant="subtitle2" sx={{ color: 'black' }}>
//                       {option.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="textSecondary"
//                       sx={{ color: 'black' }}
//                     >
//                       {option.desc}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       color="textSecondary"
//                       sx={{ color: 'black' }}
//                     >
//                       Quantity: {option.quantity}
//                     </Typography>
//                   </Box>
//                 </Box>
//               ))}
//               <Box
//                 position="sticky"
//                 bottom={0}
//                 bgcolor="background.paper"
//                 pt={2}
//                 mt={2}
//                 borderTop={1}
//                 borderColor="divider"
//               >
//                 <Box display="flex" justifyContent="flex-end" gap={2}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => setShowOptions(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <YellowButton
//                     variant="contained"
//                     onClick={() => setShowOptions(false)}
//                   >
//                     Save Changes
//                   </YellowButton>
//                 </Box>
//               </Box>
//             </>
//           )}
//         </Box>
//       </Drawer>

//       {/* Price Dialog */}
//       {/* // Replace your existing Dialog component with this updated version */}
//       <Dialog
//         open={showPriceDialog}
//         onClose={() => {
//           setShowPriceDialog(false);
//           setSelectedDish(null);
//           setNewPrice('');
//         }}
//       >
//         <DialogTitle>Set Price for {selectedDish?.name}</DialogTitle>
//         <Box sx={{ p: 2 }}>
//           <TextField
//             fullWidth
//             label="Current Price"
//             value={`$${selectedDish?.price.toFixed(2)}`}
//             disabled
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Set New Price"
//             type="number"
//             value={newPrice}
//             onChange={(e) => setNewPrice(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <Box display="flex" justifyContent="flex-end" gap={2}>
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 setShowPriceDialog(false);
//                 setSelectedDish(null);
//                 setNewPrice('');
//               }}
//             >
//               Cancel
//             </Button>
//             <YellowButton
//               variant="contained"
//               onClick={() => {
//                 const updatedDishes = customOption.dishes.map(dish =>
//                   dish.id === selectedDish.id
//                     ? { ...dish, price: parseFloat(newPrice) }
//                     : dish
//                 );
//                 setCustomOption({ ...customOption, dishes: updatedDishes });
//                 setShowPriceDialog(false);
//                 setSelectedDish(null);
//                 setNewPrice('');
//                 setIsDropdownOpen(false);
//               }}
//             >
//               Save
//             </YellowButton>
//           </Box>
//         </Box>
//       </Dialog>

//       {/* Menu Table Section */}
//       <Typography variant="h5" sx={{ mb: 2, mt: 4, color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: "bold" }}>
//         <span>Menu Table</span>
//         <Button
//           onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
//           startIcon={sortDirection === 'desc' ? '↓' : '↑'}
//           sx={{ color: 'black' }}
//         >
//           {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
//         </Button>
//       </Typography>
//       <TableContainer
//         component={Paper}
//         sx={{
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//           borderRadius: 2,
//           mb: 4
//         }}
//       >
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Image</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Category</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Food Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Diet Type</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Tags</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Status</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {getDisplayedRows().map((foodItem) => (
//               <TableRow
//                 key={foodItem.internalName}
//                 hover
//                 sx={{
//                   '&:last-child td, &:last-child th': { border: 0 },
//                   transition: 'background-color 0.3s',
//                   '&:hover': { backgroundColor: '#f0f0f0' }
//                 }}
//               >
//                 {/* Image Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       width: 100,
//                       height: 100,
//                       borderRadius: 1,
//                       overflow: 'hidden',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       border: '1px solid #eee'
//                     }}
//                   >
//                     {foodItem.imageData?.images?.[0]?.url ? (
//                       <img
//                         src={foodItem.imageData.images[0].url}
//                         alt={foodItem.name}
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover'
//                         }}
//                       />
//                     ) : (
//                       <Box
//                         sx={{
//                           width: '100%',
//                           height: '100%',
//                           backgroundColor: '#f5f5f5',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           color: '#999',
//                           fontSize: '12px'
//                         }}
//                       >
//                         No Image
//                       </Box>
//                     )}
//                   </Box>
//                 </TableCell>

//                 {/* Category Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       backgroundColor: '#e3f2fd',
//                       color: '#1976d2',
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       display: 'inline-block'
//                     }}
//                   >
//                     {menuData.getMenu.categoryData.find(cat =>
//                       cat.foodList?.includes(foodItem._id))?.name || 'Uncategorized'}
//                   </Box>
//                 </TableCell>

//                 {/* Food Name Cell */}
//                 <TableCell sx={{ color: 'black', maxWidth: '200px' }}>
//                   {foodItem.name}
//                 </TableCell>

//                 {/* Diet Type Cell */}
//                 <TableCell>
//                   {foodItem.dietaryType?.map((type, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         display: 'inline-block',
//                         backgroundColor: type === 'VEG' ? '#e8f5e9' :
//                           type === 'NON_VEG' ? '#ffebee' : '#fff3e0',
//                         color: type === 'VEG' ? '#2e7d32' :
//                           type === 'NON_VEG' ? '#d32f2f' : '#f57c00',
//                         padding: '4px 8px',
//                         borderRadius: '4px',
//                         marginRight: '4px',
//                         fontSize: '0.75rem',
//                         fontWeight: 'bold'
//                       }}
//                     >
//                       {type}
//                     </Box>
//                   ))}
//                 </TableCell>

//                 {/* Tags Cell */}
//                 <TableCell>
//                   <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//                     {foodItem.tags && foodItem.tags.length > 0 ? (
//                       foodItem.tags.map((tag, index) => (
//                         <Box
//                           key={index}
//                           sx={{
//                             backgroundColor: '#fff3e0',
//                             color: '#f57c00',
//                             padding: '2px 8px',
//                             borderRadius: '4px',
//                             fontSize: '0.75rem',
//                             fontWeight: 'medium'
//                           }}
//                         >
//                           {tag}
//                         </Box>
//                       ))
//                     ) : (
//                       <Box
//                         sx={{
//                           backgroundColor: '#f5f5f5',
//                           color: '#999',
//                           padding: '2px 8px',
//                           borderRadius: '4px',
//                           fontSize: '0.75rem'
//                         }}
//                       >
//                         No Tags
//                       </Box>
//                     )}
//                   </Box>
//                 </TableCell>

//                 {/* Status Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       color: foodItem.active ? '#2e7d32' : '#d32f2f',
//                       fontWeight: 'bold',
//                       backgroundColor: foodItem.active ? '#e8f5e9' : '#ffebee',
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       display: 'inline-block'
//                     }}
//                   >
//                     {foodItem.active ? 'Active' : 'Inactive'}
//                   </Box>
//                 </TableCell>

//                 {/* Actions Cell */}
//                 <TableCell>
//                   <Box display="flex" gap={1}>
//                     <IconButton
//                       size="small"
//                       sx={{
//                         color: '#1976d2',
//                         '&:hover': { backgroundColor: '#e3f2fd' }
//                       }}
//                       onClick={() => {/* Edit logic */ }}
//                     >
//                       <EditIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       sx={{
//                         color: '#d32f2f',
//                         '&:hover': { backgroundColor: '#ffebee' }
//                       }}
//                       onClick={() => {/* Delete logic */ }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//                 colSpan={7}
//                 count={menuData?.getMenu?.food?.length || 0}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 SelectProps={{
//                   inputProps: { 'aria-label': 'rows per page' },
//                   native: true,
//                 }}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 sx={{
//                   '.MuiTablePagination-select': {
//                     color: 'black'
//                   },
//                   '.MuiTablePagination-displayedRows': {
//                     color: 'black'
//                   },
//                   '.MuiTablePagination-toolbar .MuiTablePagination-selectLabel': {
//                     color: 'black',
//                   },

//                   '.MuiTablePagination-selectLabel': {
//                     color: 'black',
//                   },
//                   '.MuiTablePagination-displayedRows': {
//                     color: 'black',
//                   },
//                   '.MuiTablePagination-actions .MuiIconButton-root': {
//                     color: 'black',
//                   }
//                 }}
//               />
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>

//     </StyledBox>
//   );
// };

// export default DishManagement;

// import React, { useState, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   FormControlLabel,
//   Checkbox,
//   Button,
//   IconButton,
//   Drawer,
//   Paper,
//   InputLabel,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableFooter,

// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { styled } from '@mui/material/styles';
// import AddIcon from '@mui/icons-material/Add';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { gql, useQuery } from '@apollo/client';

// // GraphQL Queries
// const GET_FOOD_TAGS = gql`
//   query FoodTags {
//     bootstrap {
//       foodTags {
//         enumVal
//         displayName
//         isActive
//       }
//       dietaryOptions {
//         enumVal
//         displayName
//         isActive
//       }
//       allergens {
//         enumVal
//         displayName
//         description
//       }
//     }
//   }
// `;

// const GET_MENU = gql`
//   query GetMenu($restaurantId: ID!) {
//     getMenu(restaurantId: $restaurantId) {
//       _id
//       restaurantId
//       categoryData {
//         _id
//         name
//         active
//         foodList
//         createdAt
//         updatedAt
//       }
//       food {
//         _id
//         name
//         hasVariation
//         dietaryType
//         imageData {
//         images {
//           url
//         }
//       }
//         tags
//         variationList {
//           _id
//           type
//           title
//           optionSetList
//           price
//           discountedPrice
//           outOfStock
//           createdAt
//         }
//       }
//     }
//   }
// `;

// const GET_RESTAURANT_CATEGORIES = gql`
//   query Restaurant($restaurantId: String!) {
//     restaurant(id: $restaurantId) {
//       _id
//       categories {
//         title
//       }
//     }
//   }
// `;

// // Styled Components
// const StyledBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   backgroundColor: '#f5f5f5',
//   minHeight: '100vh',
// }));

// const MainContent = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(3),
// }));

// const HeaderIcon = styled(Box)(({ theme }) => ({
//   backgroundColor: '#FFF9C4',
//   padding: theme.spacing(1),
//   borderRadius: theme.shape.borderRadius,
//   color: '#FBC02D',
// }));

// const UploadZone = styled(Box)(({ theme }) => ({
//   border: '2px dashed #ccc',
//   borderRadius: theme.shape.borderRadius,
//   padding: theme.spacing(4),
//   textAlign: 'center',
//   cursor: 'pointer',
//   '&:hover': {
//     borderColor: '#FBC02D',
//   },
// }));

// const PreviewImage = styled('img')({
//   maxHeight: 160,
//   maxWidth: '100%',
//   borderRadius: 8,
// });

// const VariationCard = styled(Card)(({ theme }) => ({
//   position: 'relative',
//   marginBottom: theme.spacing(2),
// }));

// const YellowButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#FBC02D',
//   '&:hover': {
//     backgroundColor: '#F9A825',
//   },
// }));

// const DishManagement = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [sortDirection, setSortDirection] = useState('desc');
//   const restaurantId = localStorage.getItem('restaurantId'); 


//   // Modify the getDisplayedRows function
//   const getDisplayedRows = () => {
//     if (!menuData?.getMenu?.food) return [];

//     // Create a sorted copy of the data
//     const sortedData = [...menuData.getMenu.food].sort((a, b) => {
//       // Get createdAt from optionSetList if available
//       const dateA = new Date(a.createdAt || 0);
//       const dateB = new Date(b.createdAt || 0);
//       return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
//     });

//     if (rowsPerPage === -1) return sortedData;
//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return sortedData.slice(startIndex, endIndex);
//   };


//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     setPage(0);
//   };



//   // Add this helper function
//   const sortByCreatedDate = (items) => {
//     if (!items) return [];
//     return [...items].sort((a, b) => {
//       const dateA = a.variationList?.[0]?.createdAt ? new Date(a.variationList[0].createdAt) : new Date(0);
//       const dateB = b.variationList?.[0]?.createdAt ? new Date(b.variationList[0].createdAt) : new Date(0);
//       return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
//     });
//   };

//   // FOR THE DIATERY OPTIONS AND TAGS AND ALLERGENS
//   const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_FOOD_TAGS);
//   // FOR MENU
//   const { data: menuData, loading: menuLoading, error: menuError } = useQuery(GET_MENU, {
//     variables: { restaurantId },
//   });
//   // GET THE CATEGORIES
//   const { data: restaurantData, loading: restaurantLoading, error: restaurantError } = useQuery(GET_RESTAURANT_CATEGORIES, {
//     variables: { restaurantId },
//   });

//   const [showOptions, setShowOptions] = useState(false);
//   const [variations, setVariations] = useState([
//     {
//       id: Date.now(),
//       title: '',
//       price: 0,
//       discounted: false,
//     },
//   ]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const fileInputRef = useRef(null);
//   const [showCustomOption, setShowCustomOption] = useState(false);
//   const [customOption, setCustomOption] = useState({
//     title: '',
//     description: '',
//     minQuantity: 0,
//     maxQuantity: 1,
//     dishes: [],
//   });

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     dietary: '',
//     allergens: [],
//     tags: [],
//     showInMenu: true,
//   });

//   const handleAddVariation = () => {
//     setVariations([
//       ...variations,
//       {
//         id: Date.now(),
//         title: '',
//         price: 0,
//         discounted: false,
//       },
//     ]);
//   };

//   const handleRemoveVariation = (id) => {
//     setVariations(variations.filter((variation) => variation.id !== id));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   if (tagsLoading || menuLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (tagsError) {
//     return <Typography>Error loading tags: {tagsError.message}</Typography>;
//   }

//   if (menuError) {
//     return <Typography>Error loading menu: {menuError.message}</Typography>;
//   }

//   return (
//     <StyledBox>
//       <MainContent>
//         {/* Header */}
//         <Box display="flex" alignItems="center" gap={2} mb={4}>
//           <HeaderIcon>
//             <AddIcon />
//           </HeaderIcon>
//           <Typography variant="h5" fontWeight={600} sx={{ color: 'black' }}>
//             Dish Management
//           </Typography>
//         </Box>

//         {/* Form to Add New Dish */}
//         <Grid container spacing={3} sx={{ mt: 4 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Title"
//               name="title"
//               value={formData.title}
//               onChange={handleFormChange}
//               placeholder="Enter dish title"
//               variant="outlined"
//               InputLabelProps={{ style: { color: 'black' } }}
//               inputProps={{ style: { color: 'black' } }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleFormChange}
//               placeholder="Enter dish description"
//               multiline
//               rows={3}
//               variant="outlined"
//               InputLabelProps={{ style: { color: 'black' } }}
//               inputProps={{ style: { color: 'black' } }}
//             />
//           </Grid>

//           {/* Categories and Tags */}
//           <Grid item xs={12} md={6}>
//       <FormControl fullWidth variant="outlined">
//         <InputLabel style={{ color: 'black' }}>Category</InputLabel>
//         <Select
//           label="Category"
//           name="category"
//           value={formData.category}
//           onChange={handleFormChange}
//           sx={{ color: 'black' }}
//         >
//           <MenuItem value="" sx={{ color: 'black' }}>
//             Select Category
//           </MenuItem>
//           {restaurantData?.restaurant?.categories?.map((category, index) => (
//             <MenuItem 
//               key={index} 
//               value={category.title} 
//               sx={{ color: 'black' }}
//             >
//               {category.title}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Grid>

//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Dietary</InputLabel>
//               <Select
//                 label="Dietary"
//                 name="dietary"
//                 value={formData.dietary}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 <MenuItem value="" sx={{ color: 'black' }}>
//                   Select Dietary
//                 </MenuItem>
//                 {tagsData?.bootstrap?.dietaryOptions?.map((option) => (
//                   <MenuItem key={option.enumVal} value={option.enumVal} sx={{ color: 'black' }}>
//                     {option.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Allergens</InputLabel>
//               <Select
//                 multiple
//                 label="Allergens"
//                 name="allergens"
//                 value={formData.allergens}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 {tagsData?.bootstrap?.allergens?.map((allergen) => (
//                   <MenuItem key={allergen.enumVal} value={allergen.enumVal} sx={{ color: 'black' }}>
//                     {allergen.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel style={{ color: 'black' }}>Tags</InputLabel>
//               <Select
//                 multiple
//                 label="Tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleFormChange}
//                 sx={{ color: 'black' }}
//               >
//                 {tagsData?.bootstrap?.foodTags?.map((tag) => (
//                   <MenuItem key={tag.enumVal} value={tag.enumVal} sx={{ color: 'black' }}>
//                     {tag.displayName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Show in Menu Toggle */}
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.showInMenu}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, showInMenu: e.target.checked }))
//                   }
//                 />
//               }
//               label="Show this dish in menu"
//               sx={{ color: 'black' }}
//             />
//           </Grid>

//           {/* Image Upload */}
//           <Grid item xs={12}>
//             <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>
//               Food Image
//             </Typography>
//             <UploadZone onClick={() => fileInputRef.current?.click()}>
//               {selectedImage ? (
//                 <Box position="relative">
//                   <PreviewImage src={selectedImage} alt="Preview" />
//                   <IconButton
//                     size="small"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedImage(null);
//                     }}
//                     sx={{
//                       position: 'absolute',
//                       top: 8,
//                       right: 8,
//                       backgroundColor: 'white',
//                     }}
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </Box>
//               ) : (
//                 <Box>
//                   <CloudUploadIcon sx={{ fontSize: 48, color: '#bbb' }} />
//                   <Typography variant="body1" color="textSecondary" sx={{ color: 'black' }}>
//                     Upload a file
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary" sx={{ color: 'black' }}>
//                     PNG, JPG up to 10MB
//                   </Typography>
//                 </Box>
//               )}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImageUpload}
//               />
//             </UploadZone>
//           </Grid>

//           {/* Variations Section */}
//           <Grid item xs={12}>
//             <Box mb={2}>
//               <Typography variant="h6" sx={{ color: 'black' }}>
//                 Variations
//               </Typography>
//             </Box>

//             {variations.map((variation) => (
//               <VariationCard key={variation.id}>
//                 <CardContent>
//                   {variations.length > 1 && (
//                     <IconButton
//                       sx={{
//                         position: 'absolute',
//                         top: -10,
//                         right: -10,
//                         color: 'error.main',
//                       }}
//                       onClick={() => handleRemoveVariation(variation.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   )}
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="Title"
//                         placeholder="Enter variation title"
//                         variant="outlined"
//                         value={variation.title}
//                         onChange={(e) => {
//                           const newVariations = variations.map((v) =>
//                             v.id === variation.id ? { ...v, title: e.target.value } : v
//                           );
//                           setVariations(newVariations);
//                         }}
//                         InputLabelProps={{ style: { color: 'black' } }}
//                         inputProps={{ style: { color: 'black' } }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="Price"
//                         type="number"
//                         variant="outlined"
//                         value={variation.price}
//                         onChange={(e) => {
//                           const newVariations = variations.map((v) =>
//                             v.id === variation.id ? { ...v, price: e.target.value } : v
//                           );
//                           setVariations(newVariations);
//                         }}
//                         sx={{
//                           '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
//                             '-webkit-appearance': 'none',
//                             margin: 0,
//                           },
//                           '& input[type=number]': {
//                             '-moz-appearance': 'textfield',
//                           },
//                         }}
//                         InputLabelProps={{ style: { color: 'black' } }}
//                         inputProps={{ style: { color: 'black' } }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={variation.discounted}
//                             onChange={(e) => {
//                               const newVariations = variations.map((v) =>
//                                 v.id === variation.id
//                                   ? { ...v, discounted: e.target.checked }
//                                   : v
//                               );
//                               setVariations(newVariations);
//                             }}
//                           />
//                         }
//                         label="Discounted"
//                         sx={{ color: 'black' }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         onClick={() => setShowOptions(true)}
//                       >
//                         Choose Options
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </VariationCard>
//             ))}

//             <Box mt={2} display="flex" justifyContent="center">
//               <YellowButton
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleAddVariation}
//               >
//                 Add Variation
//               </YellowButton>
//             </Box>
//           </Grid>

//           {/* Form Actions */}
//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
//               <Button variant="outlined">Cancel</Button>
//               <YellowButton variant="contained">Save Dish</YellowButton>
//             </Box>
//           </Grid>
//         </Grid>
//       </MainContent>

//       {/* Options Drawer */}
//       <Drawer
//         anchor="right"
//         open={showOptions}
//         onClose={() => setShowOptions(false)}
//       >
//         <Box sx={{ width: 360, p: 3 }}>
//           {showCustomOption ? (
//             <Box>
//               <Typography variant="h6" sx={{ mb: 3, color: 'black' }}>
//                 Add Custom Option
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="Title"
//                 value={customOption.title}
//                 onChange={(e) =>
//                   setCustomOption({ ...customOption, title: e.target.value })
//                 }
//                 sx={{ mb: 2 }}
//                 InputLabelProps={{ style: { color: 'black' } }}
//               />
//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 rows={3}
//                 value={customOption.description}
//                 onChange={(e) =>
//                   setCustomOption({ ...customOption, description: e.target.value })
//                 }
//                 sx={{ mb: 2 }}
//                 InputLabelProps={{ style: { color: 'black' } }}
//               />
//               <Grid container spacing={2} sx={{ mb: 2 }}>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Min Quantity"
//                     type="number"
//                     value={customOption.minQuantity}
//                     onChange={(e) =>
//                       setCustomOption({
//                         ...customOption,
//                         minQuantity: e.target.value,
//                       })
//                     }
//                     InputLabelProps={{ style: { color: 'black' } }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Max Quantity"
//                     type="number"
//                     value={customOption.maxQuantity}
//                     onChange={(e) =>
//                       setCustomOption({
//                         ...customOption,
//                         maxQuantity: e.target.value,
//                       })
//                     }
//                     InputLabelProps={{ style: { color: 'black' } }}
//                   />
//                 </Grid>
//               </Grid>

//               {/* New Choose Dishes Section */}
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel
//                   sx={{
//                     color: 'black !important',
//                     '&.Mui-focused': {
//                       color: 'black !important',
//                     },
//                   }}
//                 >
//                   Choose Dishes
//                 </InputLabel>
//                 <Select
//                   multiple
//                   value={customOption.dishes}
//                   onChange={(e) =>
//                     setCustomOption({
//                       ...customOption,
//                       dishes: e.target.value,
//                     })
//                   }
//                   label="Choose Dishes"
//                   sx={{
//                     color: 'black',
//                     '& .MuiSelect-select': {
//                       color: 'black',
//                     },
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'black',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'black',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'black',
//                     },
//                   }}
//                   MenuProps={{
//                     PaperProps: {
//                       sx: {
//                         backgroundColor: 'white',
//                         '& .MuiMenuItem-root': {
//                           color: 'black',
//                           '&:hover': {
//                             backgroundColor: '#f0f0f0',
//                           },
//                           '&.Mui-selected': {
//                             backgroundColor: '#e0e0e0',
//                             '&:hover': {
//                               backgroundColor: '#d0d0d0',
//                             },
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   <MenuItem value="dish1" sx={{ color: 'black' }}>Dish 1</MenuItem>
//                   <MenuItem value="dish2" sx={{ color: 'black' }}>Dish 2</MenuItem>
//                   <MenuItem value="dish3" sx={{ color: 'black' }}>Dish 3</MenuItem>
//                 </Select>
//               </FormControl>

//               <Box display="flex" justifyContent="flex-end" gap={2}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => setShowCustomOption(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <YellowButton
//                   variant="contained"
//                   onClick={() => {
//                     setShowCustomOption(false);
//                   }}
//                 >
//                   Add Option
//                 </YellowButton>
//               </Box>
//             </Box>
//           ) : (
//             <>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mb={3}
//               >
//                 <Typography variant="h6" sx={{ color: 'black' }}>
//                   Choose Options
//                 </Typography>
//                 <IconButton onClick={() => setShowOptions(false)}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mb={2}
//               >
//                 <Typography variant="subtitle1" sx={{ color: 'black' }}>
//                   Available Options
//                 </Typography>
//                 <YellowButton
//                   variant="contained"
//                   size="small"
//                   startIcon={<AddIcon />}
//                   onClick={() => setShowCustomOption(true)}
//                 >
//                   Add Custom Option
//                 </YellowButton>
//               </Box>
//               {[
//                 {
//                   title: 'Choose your beverages',
//                   desc: 'Select your preferred drinks',
//                   quantity: '0 - 2',
//                 },
//                 {
//                   title: 'Choose your sides',
//                   desc: 'Select your preferred side dishes',
//                   quantity: '0 - 2',
//                 },
//                 {
//                   title: 'Choose your bread',
//                   desc: 'Select your preferred bread type',
//                   quantity: '0 - 1',
//                 },
//               ].map((option, index) => (
//                 <Box
//                   key={index}
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={2}
//                   mb={2}
//                 >
//                   <Checkbox />
//                   <Box>
//                     <Typography variant="subtitle2" sx={{ color: 'black' }}>
//                       {option.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="textSecondary"
//                       sx={{ color: 'black' }}
//                     >
//                       {option.desc}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       color="textSecondary"
//                       sx={{ color: 'black' }}
//                     >
//                       Quantity: {option.quantity}
//                     </Typography>
//                   </Box>
//                 </Box>
//               ))}
//               <Box
//                 position="sticky"
//                 bottom={0}
//                 bgcolor="background.paper"
//                 pt={2}
//                 mt={2}
//                 borderTop={1}
//                 borderColor="divider"
//               >
//                 <Box display="flex" justifyContent="flex-end" gap={2}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => setShowOptions(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <YellowButton
//                     variant="contained"
//                     onClick={() => setShowOptions(false)}
//                   >
//                     Save Changes
//                   </YellowButton>
//                 </Box>
//               </Box>
//             </>
//           )}
//         </Box>
//       </Drawer>

//       {/* Menu Table Section */}
//       <Typography variant="h5" sx={{ mb: 2, mt: 4, color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: "bold" }}>
//         <span>Menu Table</span>
//         <Button
//           onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
//           startIcon={sortDirection === 'desc' ? '↓' : '↑'}
//           sx={{ color: 'black' }}
//         >
//           {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
//         </Button>
//       </Typography>
//       <TableContainer
//         component={Paper}
//         sx={{
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//           borderRadius: 2,
//           mb: 4
//         }}
//       >
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Image</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Category</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Food Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Diet Type</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Tags</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Status</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {getDisplayedRows().map((foodItem) => (
//               <TableRow
//                 key={foodItem.internalName}
//                 hover
//                 sx={{
//                   '&:last-child td, &:last-child th': { border: 0 },
//                   transition: 'background-color 0.3s',
//                   '&:hover': { backgroundColor: '#f0f0f0' }
//                 }}
//               >
//                 {/* Image Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       width: 100,
//                       height: 100,
//                       borderRadius: 1,
//                       overflow: 'hidden',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       border: '1px solid #eee'
//                     }}
//                   >
//                     {foodItem.imageData?.images?.[0]?.url ? (
//                       <img
//                         src={foodItem.imageData.images[0].url}
//                         alt={foodItem.name}
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover'
//                         }}
//                       />
//                     ) : (
//                       <Box
//                         sx={{
//                           width: '100%',
//                           height: '100%',
//                           backgroundColor: '#f5f5f5',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           color: '#999',
//                           fontSize: '12px'
//                         }}
//                       >
//                         No Image
//                       </Box>
//                     )}
//                   </Box>
//                 </TableCell>

//                 {/* Category Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       backgroundColor: '#e3f2fd',
//                       color: '#1976d2',
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       display: 'inline-block'
//                     }}
//                   >
//                     {menuData.getMenu.categoryData.find(cat =>
//                       cat.foodList?.includes(foodItem._id))?.name || 'Uncategorized'}
//                   </Box>
//                 </TableCell>

//                 {/* Food Name Cell */}
//                 <TableCell sx={{ color: 'black', maxWidth: '200px' }}>
//                   {foodItem.name}
//                 </TableCell>

//                 {/* Diet Type Cell */}
//                 <TableCell>
//                   {foodItem.dietaryType?.map((type, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         display: 'inline-block',
//                         backgroundColor: type === 'VEG' ? '#e8f5e9' :
//                           type === 'NON_VEG' ? '#ffebee' : '#fff3e0',
//                         color: type === 'VEG' ? '#2e7d32' :
//                           type === 'NON_VEG' ? '#d32f2f' : '#f57c00',
//                         padding: '4px 8px',
//                         borderRadius: '4px',
//                         marginRight: '4px',
//                         fontSize: '0.75rem',
//                         fontWeight: 'bold'
//                       }}
//                     >
//                       {type}
//                     </Box>
//                   ))}
//                 </TableCell>

//                 {/* Tags Cell */}
//                 <TableCell>
//                   <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//                     {foodItem.tags && foodItem.tags.length > 0 ? (
//                       foodItem.tags.map((tag, index) => (
//                         <Box
//                           key={index}
//                           sx={{
//                             backgroundColor: '#fff3e0',
//                             color: '#f57c00',
//                             padding: '2px 8px',
//                             borderRadius: '4px',
//                             fontSize: '0.75rem',
//                             fontWeight: 'medium'
//                           }}
//                         >
//                           {tag}
//                         </Box>
//                       ))
//                     ) : (
//                       <Box
//                         sx={{
//                           backgroundColor: '#f5f5f5',
//                           color: '#999',
//                           padding: '2px 8px',
//                           borderRadius: '4px',
//                           fontSize: '0.75rem'
//                         }}
//                       >
//                         No Tags
//                       </Box>
//                     )}
//                   </Box>
//                 </TableCell>

//                 {/* Status Cell */}
//                 <TableCell>
//                   <Box
//                     sx={{
//                       color: foodItem.active ? '#2e7d32' : '#d32f2f',
//                       fontWeight: 'bold',
//                       backgroundColor: foodItem.active ? '#e8f5e9' : '#ffebee',
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       display: 'inline-block'
//                     }}
//                   >
//                     {foodItem.active ? 'Active' : 'Inactive'}
//                   </Box>
//                 </TableCell>

//                 {/* Actions Cell */}
//                 <TableCell>
//                   <Box display="flex" gap={1}>
//                     <IconButton
//                       size="small"
//                       sx={{
//                         color: '#1976d2',
//                         '&:hover': { backgroundColor: '#e3f2fd' }
//                       }}
//                       onClick={() => {/* Edit logic */ }}
//                     >
//                       <EditIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       sx={{
//                         color: '#d32f2f',
//                         '&:hover': { backgroundColor: '#ffebee' }
//                       }}
//                       onClick={() => {/* Delete logic */ }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//                 colSpan={7}
//                 count={menuData?.getMenu?.food?.length || 0}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 SelectProps={{
//                   inputProps: { 'aria-label': 'rows per page' },
//                   native: true,
//                 }}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 sx={{
//                   '.MuiTablePagination-select': {
//                     color: 'black'
//                   },
//                   '.MuiTablePagination-displayedRows': {
//                     color: 'black'
//                   },
//                   '.MuiTablePagination-toolbar .MuiTablePagination-selectLabel': {
//                     color: 'black',
//                   },
//                   // Style the "Rows per page:" label
//                   '.MuiTablePagination-selectLabel': {
//                     color: 'black',
//                   },
//                   // Style the displayed rows text (e.g., "1–5 of 54")
//                   '.MuiTablePagination-displayedRows': {
//                     color: 'black',
//                   },
//                   // Style the navigation arrows (< and >)
//                   '.MuiTablePagination-actions .MuiIconButton-root': {
//                     color: 'black',
//                   }
//                 }}
//               />
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>

//     </StyledBox>
//   );
// };

// export default DishManagement;

// ---------above is working code man--------------------

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Drawer,
  Paper,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  Dialog,
  Chip

} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { gql, useQuery } from '@apollo/client';

// GraphQL Queries
const GET_FOOD_TAGS = gql`
  query FoodTags {
    bootstrap {
      foodTags {
        enumVal
        displayName
        isActive
      }
      dietaryOptions {
        enumVal
        displayName
        isActive
      }
      allergens {
        enumVal
        displayName
        description
      }
    }
  }
`;

const GET_MENU = gql`
  query GetMenu($restaurantId: ID!) {
    getMenu(restaurantId: $restaurantId) {
      _id
      restaurantId
      categoryData {
        _id
        name
        active
        foodList
        createdAt
        updatedAt
      }
      food {
        _id
        name
        hasVariation
        dietaryType
        imageData {
        images {
          url
        }
      }
        tags
        variationList {
          _id
          type
          title
          optionSetList
          price
          discountedPrice
          outOfStock
          createdAt
        }
      }
    }
  }
`;

const GET_RESTAURANT_CATEGORIES = gql`
  query Restaurant($restaurantId: String!) {
    restaurant(id: $restaurantId) {
      _id
      categories {
        title
      }
      options {
        title
    }
    }
  }
`;

// Styled Components
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
}));

const MainContent = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
}));

const HeaderIcon = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFF9C4',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: '#FBC02D',
}));

const UploadZone = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#FBC02D',
  },
}));

const PreviewImage = styled('img')({
  maxHeight: 160,
  maxWidth: '100%',
  borderRadius: 8,
});

const VariationCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
}));

const YellowButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FBC02D',
  '&:hover': {
    backgroundColor: '#F9A825',
  },
}));

const DishManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('desc');
  const restaurantId = localStorage.getItem('restaurantId');

  const [selectedDishes, setSelectedDishes] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [priceDialog, setPriceDialog] = useState({
    open: false,
    selectedDish: '',
    currentPrice: 0,
    newPrice: ''
  });


  const handleDishSelect = (dish) => {
    setCurrentDish(dish);
    setNewPrice(dish.currentPrice.toString());
    setShowPriceModal(true);
  };

  const handlePriceConfirm = () => {
    const updatedDish = {
      ...currentDish,
      newPrice: parseFloat(newPrice)
    };

    setSelectedDishes(prev => {
      const exists = prev.find(d => d.id === updatedDish.id);
      if (exists) {
        return prev.map(d => d.id === updatedDish.id ? updatedDish : d);
      }
      return [...prev, updatedDish];
    });

    setShowPriceModal(false);
    setCurrentDish(null);
    setNewPrice('');
  };


  // Modify the getDisplayedRows function
  const getDisplayedRows = () => {
    if (!menuData?.getMenu?.food) return [];

    // Create a sorted copy of the data
    const sortedData = [...menuData.getMenu.food].sort((a, b) => {
      // Get createdAt from optionSetList if available
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    if (rowsPerPage === -1) return sortedData;
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };


  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };



  // Add this helper function
  const sortByCreatedDate = (items) => {
    if (!items) return [];
    return [...items].sort((a, b) => {
      const dateA = a.variationList?.[0]?.createdAt ? new Date(a.variationList[0].createdAt) : new Date(0);
      const dateB = b.variationList?.[0]?.createdAt ? new Date(b.variationList[0].createdAt) : new Date(0);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  // FOR THE DIATERY OPTIONS AND TAGS AND ALLERGENS
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_FOOD_TAGS);
  // FOR MENU
  const { data: menuData, loading: menuLoading, error: menuError } = useQuery(GET_MENU, {
    variables: { restaurantId },
  });
  // GET THE CATEGORIES
  const { data: restaurantData, loading: restaurantLoading, error: restaurantError } = useQuery(GET_RESTAURANT_CATEGORIES, {
    variables: { restaurantId },
  });

  const [showOptions, setShowOptions] = useState(false);
  const [variations, setVariations] = useState([
    {
      id: Date.now(),
      title: '',
      price: 0,
      discounted: false,
      dishPrices: {}
    },
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showCustomOption, setShowCustomOption] = useState(false);
  const [customOption, setCustomOption] = useState({
    title: '',
    description: '',
    minQuantity: 0,
    maxQuantity: 1,
    dishes: [],
    dishPrices: {} // To store prices for each dish
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dietary: '',
    allergens: [],
    tags: [],
    showInMenu: true,
  });

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        id: Date.now(),
        title: '',
        price: 0,
        discounted: false,
      },
    ]);
  };

  const handleRemoveVariation = (id) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (tagsLoading || menuLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (tagsError) {
    return <Typography>Error loading tags: {tagsError.message}</Typography>;
  }

  if (menuError) {
    return <Typography>Error loading menu: {menuError.message}</Typography>;
  }

  return (
    <StyledBox>
      <MainContent>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <HeaderIcon>
            <AddIcon />
          </HeaderIcon>
          <Typography variant="h5" fontWeight={600} sx={{ color: 'black' }}>
            Dish Management
          </Typography>
        </Box>

        {/* Form to Add New Dish */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter dish title"
              variant="outlined"
              InputLabelProps={{ style: { color: 'black' } }}
              inputProps={{ style: { color: 'black' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter dish description"
              multiline
              rows={3}
              variant="outlined"
              InputLabelProps={{ style: { color: 'black' } }}
              inputProps={{ style: { color: 'black' } }}
            />
          </Grid>

          {/* Categories and Tags */}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel style={{ color: 'black' }}>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                sx={{ color: 'black' }}
              >
                <MenuItem value="" sx={{ color: 'black' }}>
                  Select Category
                </MenuItem>
                {/* {restaurantData?.restaurant?.categories?.map((category, index) => (
                  <MenuItem
                    key={index}
                    value={category.title}
                    sx={{ color: 'black' }}
                  >
                    {category.title}
                  </MenuItem>
                ))} */}
                {menuData?.getMenu?.categoryData?.map((category, index) => (
  <MenuItem
    key={index}
    value={category.name}
    sx={{ color: 'black' }}
  >
    {category.name}
  </MenuItem>
))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel style={{ color: 'black' }}>Dietary</InputLabel>
              <Select
                label="Dietary"
                name="dietary"
                value={formData.dietary}
                onChange={handleFormChange}
                sx={{ color: 'black' }}
              >
                <MenuItem value="" sx={{ color: 'black' }}>
                  Select Dietary
                </MenuItem>
                {tagsData?.bootstrap?.dietaryOptions?.map((option) => (
                  <MenuItem key={option.enumVal} value={option.enumVal} sx={{ color: 'black' }}>
                    {option.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel style={{ color: 'black' }}>Allergens</InputLabel>
              <Select
                multiple
                label="Allergens"
                name="allergens"
                value={formData.allergens}
                onChange={handleFormChange}
                sx={{ color: 'black' }}
              >
                {tagsData?.bootstrap?.allergens?.map((allergen) => (
                  <MenuItem key={allergen.enumVal} value={allergen.enumVal} sx={{ color: 'black' }}>
                    {allergen.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel style={{ color: 'black' }}>Tags</InputLabel>
              <Select
                multiple
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                sx={{ color: 'black' }}
              >
                {tagsData?.bootstrap?.foodTags?.map((tag) => (
                  <MenuItem key={tag.enumVal} value={tag.enumVal} sx={{ color: 'black' }}>
                    {tag.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Show in Menu Toggle */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.showInMenu}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, showInMenu: e.target.checked }))
                  }
                />
              }
              label="Show this dish in menu"
              sx={{ color: 'black' }}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>
              Food Image
            </Typography>
            <UploadZone onClick={() => fileInputRef.current?.click()}>
              {selectedImage ? (
                <Box position="relative">
                  <PreviewImage src={selectedImage} alt="Preview" />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'white',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#bbb' }} />
                  <Typography variant="body1" color="textSecondary" sx={{ color: 'black' }}>
                    Upload a file
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ color: 'black' }}>
                    PNG, JPG up to 10MB
                  </Typography>
                </Box>
              )}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </UploadZone>
          </Grid>

          {/* Variations Section */}
          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ color: 'black' }}>
                Variations
              </Typography>
            </Box>

            {variations.map((variation) => (
              <VariationCard key={variation.id}>
                <CardContent>
                  {variations.length > 1 && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        color: 'error.main',
                      }}
                      onClick={() => handleRemoveVariation(variation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        placeholder="Enter variation title"
                        variant="outlined"
                        value={variation.title}
                        onChange={(e) => {
                          const newVariations = variations.map((v) =>
                            v.id === variation.id ? { ...v, title: e.target.value } : v
                          );
                          setVariations(newVariations);
                        }}
                        InputLabelProps={{ style: { color: 'black' } }}
                        inputProps={{ style: { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        variant="outlined"
                        value={variation.price}
                        onChange={(e) => {
                          const newVariations = variations.map((v) =>
                            v.id === variation.id ? { ...v, price: e.target.value } : v
                          );
                          setVariations(newVariations);
                        }}
                        sx={{
                          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                          },
                        }}
                        InputLabelProps={{ style: { color: 'black' } }}
                        inputProps={{ style: { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={variation.discounted}
                            onChange={(e) => {
                              const newVariations = variations.map((v) =>
                                v.id === variation.id
                                  ? { ...v, discounted: e.target.checked }
                                  : v
                              );
                              setVariations(newVariations);
                            }}
                          />
                        }
                        label="Discounted"
                        sx={{ color: 'black' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setShowOptions(true)}
                      >
                        Choose Options
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </VariationCard>
            ))}

            <Box mt={2} display="flex" justifyContent="center">
              <YellowButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVariation}
              >
                Add Variation
              </YellowButton>
            </Box>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button variant="outlined">Cancel</Button>
              <YellowButton variant="contained">Save Dish</YellowButton>
            </Box>
          </Grid>
        </Grid>
      </MainContent>

      {/* Options Drawer */}
      <Drawer
        anchor="right"
        open={showOptions}
        onClose={() => setShowOptions(false)}
      >
        <Box sx={{ width: 360, p: 3 }}>
          {showCustomOption ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'black' }}>
                Add Custom Option
              </Typography>
              <TextField
                fullWidth
                label="Title"
                value={customOption.title}
                onChange={(e) =>
                  setCustomOption({ ...customOption, title: e.target.value })
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { color: 'black' } }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={customOption.description}
                onChange={(e) =>
                  setCustomOption({ ...customOption, description: e.target.value })
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { color: 'black' } }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Quantity"
                    type="number"
                    value={customOption.minQuantity}
                    onChange={(e) =>
                      setCustomOption({
                        ...customOption,
                        minQuantity: e.target.value,
                      })
                    }
                    InputLabelProps={{ style: { color: 'black' } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Quantity"
                    type="number"
                    value={customOption.maxQuantity}
                    onChange={(e) =>
                      setCustomOption({
                        ...customOption,
                        maxQuantity: e.target.value,
                      })
                    }
                    InputLabelProps={{ style: { color: 'black' } }}
                  />
                </Grid>
              </Grid>

              {/* New Choose Dishes Section */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{
                  color: 'black !important',
                  '&.Mui-focused': {
                    color: 'black !important',
                  },
                }}>
                  Choose Dishes
                </InputLabel>
                <Select
                  multiple
                  value={customOption.dishes}
                  onChange={(e) => {
                    const selectedDish = e.target.value[e.target.value.length - 1];
                    if (!customOption.dishes.includes(selectedDish)) {
                      setPriceDialog({
                        open: true,
                        selectedDish: selectedDish,
                        currentPrice: 0,
                        newPrice: ''
                      });
                    }
                  }}
                  label="Choose Dishes"
                  sx={{
                    color: 'black',
                    '& .MuiSelect-select': {
                      color: 'black',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                  }}
                >
                  {restaurantData?.restaurant?.options?.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.title}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'black'
                      }}
                    >
                      <Checkbox checked={customOption.dishes.includes(option.title)} />
                      {option.title}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>

              {/* Display Selected Dishes with Prices */}
{customOption.dishes.length > 0 && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle1" sx={{ mb: 1, color: 'black', fontWeight: 'medium' }}>
      Selected Dishes with Prices:
    </Typography>
    <Paper variant="outlined" sx={{ p: 2 }}>
      {customOption.dishes.map((dish) => (
        <Box
          key={dish}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #eee',
            '&:last-child': { borderBottom: 'none' }
          }}
        >
          <Typography sx={{ color: 'black' }}>{dish}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'black' }}>
              ${parseFloat(priceDialog.newPrice).toFixed(2)}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                setPriceDialog({
                  open: true,
                  selectedDish: dish,
                  currentPrice: parseFloat(priceDialog.newPrice),
                  newPrice: priceDialog.newPrice
                });
              }}
              sx={{ color: '#1976d2' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setCustomOption(prev => ({
                  ...prev,
                  dishes: prev.dishes.filter(d => d !== dish)
                }));
              }}
              sx={{ color: '#d32f2f' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Paper>
  </Box>
)}

              {/* Price Dialog */}
              <Dialog
                open={priceDialog.open}
                onClose={() => setPriceDialog(prev => ({ ...prev, open: false }))}
                PaperProps={{
                  sx: {
                    width: '400px',
                    p: 3,
                    borderRadius: 2
                  }
                }}
              >
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      Set Price for {priceDialog.selectedDish}
                    </Typography>
                    <IconButton
                      onClick={() => setPriceDialog(prev => ({ ...prev, open: false }))}
                      sx={{ color: 'grey.500' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'black' }}>
                    Current Price
                  </Typography>
                  <TextField
                    fullWidth
                    disabled
                    value={`$${priceDialog.currentPrice.toFixed(2)}`}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'black' }}>
                    Set New Price
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={priceDialog.newPrice}
                    onChange={(e) => setPriceDialog(prev => ({ ...prev, newPrice: e.target.value }))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setPriceDialog(prev => ({ ...prev, open: false }))}
                    >
                      Cancel
                    </Button>
                    <YellowButton
                      variant="contained"
                      onClick={() => {
                        if (priceDialog.newPrice) {
                          setCustomOption(prev => ({
                            ...prev,
                            dishes: [...prev.dishes, priceDialog.selectedDish]
                          }));
                          setPriceDialog(prev => ({ ...prev, open: false }));
                        }
                      }}
                    >
                      Save
                    </YellowButton>
                  </Box>
                </Box>
              </Dialog>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => setShowCustomOption(false)}
                >
                  Cancel
                </Button>
                <YellowButton
                  variant="contained"
                  onClick={() => {
                    setShowCustomOption(false);
                  }}
                >
                  Add Option
                </YellowButton>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" sx={{ color: 'black' }}>
                  Choose Options
                </Typography>
                <IconButton onClick={() => setShowOptions(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" sx={{ color: 'black' }}>
                  Available Options
                </Typography>
                <YellowButton
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCustomOption(true)}
                >
                  Add Custom Option
                </YellowButton>
              </Box>
              {[
                {
                  title: 'Choose your beverages',
                  desc: 'Select your preferred drinks',
                  quantity: '0 - 2',
                },
                {
                  title: 'Choose your sides',
                  desc: 'Select your preferred side dishes',
                  quantity: '0 - 2',
                },
                {
                  title: 'Choose your bread',
                  desc: 'Select your preferred bread type',
                  quantity: '0 - 1',
                },
              ].map((option, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="flex-start"
                  gap={2}
                  mb={2}
                >
                  <Checkbox />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'black' }}>
                      {option.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: 'black' }}
                    >
                      {option.desc}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ color: 'black' }}
                    >
                      Quantity: {option.quantity}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Box
                position="sticky"
                bottom={0}
                bgcolor="background.paper"
                pt={2}
                mt={2}
                borderTop={1}
                borderColor="divider"
              >
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowOptions(false)}
                  >
                    Cancel
                  </Button>
                  <YellowButton
                    variant="contained"
                    onClick={() => setShowOptions(false)}
                  >
                    Save Changes
                  </YellowButton>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Menu Table Section */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4, color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: "bold" }}>
        <span>Menu Table</span>
        <Button
          onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
          startIcon={sortDirection === 'desc' ? '↓' : '↑'}
          sx={{ color: 'black' }}
        >
          {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
        </Button>
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: 2,
          mb: 4
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Food Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Diet Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Tags</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getDisplayedRows().map((foodItem) => (
              <TableRow
                key={foodItem.internalName}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.3s',
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}
              >
                {/* Image Cell */}
                <TableCell>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #eee'
                    }}
                  >
                    {foodItem.imageData?.images?.[0]?.url ? (
                      <img
                        src={foodItem.imageData.images[0].url}
                        alt={foodItem.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          fontSize: '12px'
                        }}
                      >
                        No Image
                      </Box>
                    )}
                  </Box>
                </TableCell>

                {/* Category Cell */}
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    {menuData.getMenu.categoryData.find(cat =>
                      cat.foodList?.includes(foodItem._id))?.name || 'Uncategorized'}
                  </Box>
                </TableCell>

                {/* Food Name Cell */}
                <TableCell sx={{ color: 'black', maxWidth: '200px' }}>
                  {foodItem.name}
                </TableCell>

                {/* Diet Type Cell */}
                <TableCell>
                  {foodItem.dietaryType?.map((type, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'inline-block',
                        backgroundColor: type === 'VEG' ? '#e8f5e9' :
                          type === 'NON_VEG' ? '#ffebee' : '#fff3e0',
                        color: type === 'VEG' ? '#2e7d32' :
                          type === 'NON_VEG' ? '#d32f2f' : '#f57c00',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginRight: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {type}
                    </Box>
                  ))}
                </TableCell>

                {/* Tags Cell */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {foodItem.tags && foodItem.tags.length > 0 ? (
                      foodItem.tags.map((tag, index) => (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: '#fff3e0',
                            color: '#f57c00',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          {tag}
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: '#f5f5f5',
                          color: '#999',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        No Tags
                      </Box>
                    )}
                  </Box>
                </TableCell>

                {/* Status Cell */}
                <TableCell>
                  <Box
                    sx={{
                      color: foodItem.active ? '#2e7d32' : '#d32f2f',
                      fontWeight: 'bold',
                      backgroundColor: foodItem.active ? '#e8f5e9' : '#ffebee',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    {foodItem.active ? 'Active' : 'Inactive'}
                  </Box>
                </TableCell>

                {/* Actions Cell */}
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#1976d2',
                        '&:hover': { backgroundColor: '#e3f2fd' }
                      }}
                      onClick={() => {/* Edit logic */ }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#d32f2f',
                        '&:hover': { backgroundColor: '#ffebee' }
                      }}
                      onClick={() => {/* Delete logic */ }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={menuData?.getMenu?.food?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '.MuiTablePagination-select': {
                    color: 'black'
                  },
                  '.MuiTablePagination-displayedRows': {
                    color: 'black'
                  },
                  '.MuiTablePagination-toolbar .MuiTablePagination-selectLabel': {
                    color: 'black',
                  },

                  '.MuiTablePagination-selectLabel': {
                    color: 'black',
                  },
                  '.MuiTablePagination-displayedRows': {
                    color: 'black',
                  },
                  '.MuiTablePagination-actions .MuiIconButton-root': {
                    color: 'black',
                  }
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

    </StyledBox>
  );
};

export default DishManagement; 