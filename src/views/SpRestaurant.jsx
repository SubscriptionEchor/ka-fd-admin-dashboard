// import React, { useState } from 'react';
// import { useQuery, useMutation, gql } from '@apollo/client';
// import DataTable from 'react-data-table-component';
// import {
//     Container,
//     TextField,
//     Button,
//     Paper,
//     Typography,
//     Box,
//     IconButton,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Snackbar,
//     Alert,
//     ThemeProvider,
//     createTheme
// } from '@mui/material';
// import CustomLoader from '../components/Loader/CustomLoader';
// import { customStyles } from '../utils/tableCustomStyles';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

// // GraphQL Queries and Mutations
// const GET_QUICK_SEARCH_KEYWORDS = gql`
//   query Restaurant($restaurantId: String) {
//     restaurant(id: $restaurantId) {
//       _id
//       name
//       quickSearchKeywords
//     }
//   }
// `;

// const EDIT_RESTAURANT = gql`
//   mutation EditRestaurant($restaurant: RestaurantProfileInput!) {
//     editRestaurant(restaurant: $restaurant) {
//       _id
//       name
//       quickSearchKeywords
//     }
//   }
// `;

// // Custom Theme to ensure black text
// const theme = createTheme({
//     components: {
//         MuiTextField: {
//             styleOverrides: {
//                 root: {
//                     '& label': { color: 'black' },
//                     '& input': { color: 'black' },
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'black' },
//                         '&:hover fieldset': { borderColor: 'black' },
//                         '&.Mui-focused fieldset': { borderColor: 'black' },
//                     }
//                 }
//             }
//         }
//     }
// });

// const ShrRestaurant = () => {
//     // State Management
//     const [searchQuery, setSearchQuery] = useState('');
//     const [newKeyword, setNewKeyword] = useState('');
//     const [editKeyword, setEditKeyword] = useState('');
//     const [selectedKeyword, setSelectedKeyword] = useState('');
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: '',
//         severity: 'success'
//     });

//     // Restaurant ID from localStorage
//     const restaurantId = localStorage.getItem('restaurantId');

//     // GraphQL Hooks
//     const {
//         data,
//         loading,
//         error,
//         refetch
//     } = useQuery(GET_QUICK_SEARCH_KEYWORDS, {
//         variables: { restaurantId },
//         fetchPolicy: 'cache-and-network'
//     });

//     const [editRestaurant] = useMutation(EDIT_RESTAURANT);

//     // Utility Functions
//     const showSnackbar = (message, severity = 'success') => {
//         setSnackbar({
//             open: true,
//             message,
//             severity
//         });
//     };

//     // Add Keyword Handler
//     const handleAddKeyword = async() => {
//         if (!newKeyword.trim()) {
//             showSnackbar('Please enter a Keyword', 'error');
//             return;
//         }

//         try {
//             const updatedKeywords = [
//                 ...(data?.restaurant?.quickSearchKeywords || []),
//                 newKeyword.trim()
//             ];

//             await editRestaurant({
//                 variables: {
//                     restaurant: {
//                         _id: data.restaurant._id,
//                         name: data.restaurant.name,
//                         quickSearchKeywords: updatedKeywords
//                     }
//                 }
//             });

//             setNewKeyword('');
//             showSnackbar('Keyword added successfully');
//             refetch();
//         } catch (error) {
//             showSnackbar(error.message, 'error');
//         }
//     };

//     // Edit Keyword Handler
//     const handleEditKeyword = async() => {
//         if (!editKeyword.trim()) {
//             showSnackbar('Please enter a Keyword', 'error');
//             return;
//         }

//         try {
//             const updatedKeywords = data.restaurant.quickSearchKeywords.map(k =>
//                 k === selectedKeyword ? editKeyword.trim() : k
//             );

//             await editRestaurant({
//                 variables: {
//                     restaurant: {
//                         _id: data.restaurant._id,
//                         name: data.restaurant.name,
//                         quickSearchKeywords: updatedKeywords
//                     }
//                 }
//             });

//             setDialogOpen(false);
//             showSnackbar('Keyword updated successfully');
//             refetch();
//         } catch (error) {
//             showSnackbar(error.message, 'error');
//         }
//     };

//     // Delete Keyword Handler
//     const handleDeleteKeyword = async(keyword) => {
//         try {
//             const updatedKeywords = data.restaurant.quickSearchKeywords.filter(k => k !== keyword);

//             await editRestaurant({
//                 variables: {
//                     restaurant: {
//                         _id: data.restaurant._id,
//                         name: data.restaurant.name,
//                         quickSearchKeywords: updatedKeywords
//                     }
//                 }
//             });

//             showSnackbar('Keyword deleted successfully');
//             refetch();
//         } catch (error) {
//             showSnackbar(error.message, 'error');
//         }
//     };

//     // Table Columns Configuration
//     const columns = [
//         {
//             name: 'Keywords',
//             selector: row => row,
//             sortable: true,
//             cell: row => (
//                 <Typography sx={{
//                     py: 1,
//                     color: 'black',
//                     fontWeight: 'medium'
//                 }}>
//                     {row}
//                 </Typography>
//             ),
//         },
//         {
//             name: 'Actions',
//             cell: (row) => (
//                 <Box>
//                     <IconButton
//                         onClick={() => {
//                             setSelectedKeyword(row);
//                             setEditKeyword(row);
//                             setDialogOpen(true);
//                         }}
//                         color="primary"
//                         size="small"
//                     >
//                         <EditIcon sx={{ color: 'green' }} />
//                     </IconButton>
//                     <IconButton
//                         onClick={() => handleDeleteKeyword(row)}
//                         color="error"
//                         size="small"
//                     >
//                         <DeleteIcon sx={{ color: 'red' }} />
//                     </IconButton>
//                 </Box>
//             ),
//         },
//     ];

//     // Filtered Keywords
//     const filteredKeywords = data?.restaurant?.quickSearchKeywords?.filter(keyword =>
//         keyword.toLowerCase().includes(searchQuery.toLowerCase())
//     ) || [];

//     return (
//         <ThemeProvider theme={theme}>
//             <Container maxWidth="lg"> {/* Increased width to 'lg' */}
//                 {/* Add Category Section */}
//                 <Paper sx={{
//                     mt: 4,
//                     p: 3,
//                     borderRadius: 2,
//                     boxShadow: 3,
//                     backgroundColor: 'white'
//                 }}>
//                     <Typography
//                         variant="h6"
//                         sx={{
//                             bgcolor: '#FF8F00',
//                             p: 2,
//                             borderRadius: 1,
//                             color: 'white',
//                             fontWeight: 'bold',
//                             mb: 2
//                         }}
//                     >
//                         Add Quick Search Keyword
//                     </Typography>
//                     <TextField
//                         placeholder="Enter Quick-Search-Keyword name"
//                         variant="outlined"
//                         value={newKeyword}
//                         onChange={(e) => setNewKeyword(e.target.value)}
//                         sx={{
//                             mb: 2,
//                             me: 2,
//                             width: '40%',
//                             '& .MuiOutlinedInput-input': {
//                                 padding: '8px 14px',
//                             },
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: '8px',
//                                 '& fieldset': {
//                                     borderColor: '#e0e0e0'
//                                 },
//                                 '&:hover fieldset': {
//                                     borderColor: '#e0e0e0'
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: '#e0e0e0'
//                                 }
//                             }
//                         }}
//                         InputProps={{
//                             style: { color: 'black' }
//                         }}
//                     />

//                     <Button
//                         variant="contained"
//                         sx={{
//                             bgcolor: '#FFB300',
//                             color: 'black',
//                             '&:hover': { bgcolor: '#e6b800' },
//                             p: 1,
//                             borderRadius: 4,
//                             ml: 1,
//                             textTransform: 'none',
//                             fontWeight: 'medium'
//                         }}
//                         onClick={handleAddKeyword}
//                     >
//                         Save
//                     </Button>
//                 </Paper>

//                 {/* Categories List */}
//                 <Paper sx={{
//                     mt: 4,
//                     p: 3,
//                     borderRadius: 2,
//                     boxShadow: 3,
//                     backgroundColor: 'white'
//                 }}>
//                     {loading ? (
//                         <CustomLoader />
//                     ) : (
//                         <DataTable
//                             title={
//                                 <Typography
//                                     variant="h6"
//                                     sx={{
//                                         color: 'black',
//                                         fontWeight: 'bold',
//                                         marginBottom: "10px"

//                                     }}
//                                 >
//                                     Quick Search Keyword
//                                 </Typography>
//                             }
//                             columns={columns}
//                             data={filteredKeywords}
//                             pagination
//                             subHeader
//                             subHeaderComponent={
//                                 <TextField
//                                     placeholder="Search Keywords"
//                                     variant="outlined"
//                                     size="small"
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     sx={{
//                                         minWidth: 300,
//                                         '& input': { color: 'black' },
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: '8px',
//                                             '& fieldset': {
//                                                 borderColor: '#e0e0e0'
//                                             },
//                                             '&:hover fieldset': {
//                                                 borderColor: '#e0e0e0'
//                                             },
//                                             '&.Mui-focused fieldset': {
//                                                 borderColor: '#e0e0e0'
//                                             }
//                                         }
//                                     }}
//                                 />
//                             }
//                             customStyles={customStyles}
//                         />
//                     )}
//                 </Paper>

//                 {/* Edit Category Dialog */}
//                 <Dialog
//                     open={dialogOpen}
//                     onClose={() => setDialogOpen(false)}
//                     fullWidth
//                     maxWidth="sm"
//                 >
//                     <DialogTitle sx={{
//                         bgcolor: '#ffcc00',
//                         color: 'black',
//                         fontWeight: 'bold'
//                     }}>
//                         Edit
//                     </DialogTitle>
//                     <DialogContent sx={{ pt: 2,mt:2 }}>
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             value={editKeyword}
//                             onChange={(e) => setEditKeyword(e.target.value)}
//                             placeholder="Enter category name"
//                             autoFocus
//                             InputProps={{
//                                 style: { color: 'black' }
//                             }}
//                         />
//                     </DialogContent>
//                     <DialogActions sx={{ p: 2 }}>
//                         <Button
//                             onClick={() => setDialogOpen(false)}
//                             variant="outlined"
//                             sx={{ color: 'black', borderColor: 'black' }}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleEditKeyword}
//                             variant="contained"
//                             sx={{
//                                 bgcolor: '#ffcc00',
//                                 color: 'black',
//                                 '&:hover': { bgcolor: '#e6b800' }
//                             }}
//                         >
//                             Save Changes
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* Snackbar for Notifications */}
//                 <Snackbar
//                     open={snackbar.open}
//                     autoHideDuration={4000}
//                     onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 >
//                     <Alert
//                         onClose={() => setSnackbar({ ...snackbar, open: false })}
//                         severity={snackbar.severity}
//                         sx={{ width: '100%', color: 'black' }}
//                     >
//                         {snackbar.message}
//                     </Alert>
//                 </Snackbar>
//             </Container>
//         </ThemeProvider>
//     );
// };

// export default ShrRestaurant;


import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import DataTable from 'react-data-table-component';
import {
    Container,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    ThemeProvider,
    createTheme
} from '@mui/material';
import CustomLoader from '../components/Loader/CustomLoader';
import { customStyles } from '../utils/tableCustomStyles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

// GraphQL Queries and Mutations
const GET_QUICK_SEARCH_KEYWORDS = gql`
  query Restaurant($restaurantId: String) {
    restaurant(id: $restaurantId) {
      _id
      name
      quickSearchKeywords
    }
  }
`;

const EDIT_RESTAURANT = gql`
  mutation EditRestaurant($restaurant: RestaurantProfileInput!) {
    editRestaurant(restaurant: $restaurant) {
      _id
      name
      quickSearchKeywords
    }
  }
`;

// Custom Theme to ensure black text
const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': { color: 'black' },
                    '& input': { color: 'black' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'black' },
                        '&:hover fieldset': { borderColor: 'black' },
                        '&.Mui-focused fieldset': { borderColor: 'black' },
                    }
                }
            }
        }
    }
});

const ShrRestaurant = () => {
    // State Management
    const [searchQuery, setSearchQuery] = useState('');
    const [newKeyword, setNewKeyword] = useState('');
    const [editKeyword, setEditKeyword] = useState('');
    const [selectedKeyword, setSelectedKeyword] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Restaurant ID from localStorage
    const restaurantId = localStorage.getItem('restaurantId');

    // GraphQL Hooks
    const {
        data,
        loading,
        error,
        refetch
    } = useQuery(GET_QUICK_SEARCH_KEYWORDS, {
        variables: { restaurantId },
        fetchPolicy: 'cache-and-network'
    });

    const [editRestaurant] = useMutation(EDIT_RESTAURANT);

    // Utility Functions
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Add Keyword Handler
    const handleAddKeyword = async() => {
        if (!newKeyword.trim()) {
            showSnackbar('Please enter a Keyword', 'error');
            return;
        }

        try {
            const updatedKeywords = [
                ...(data?.restaurant?.quickSearchKeywords || []),
                newKeyword.trim()
            ];

            await editRestaurant({
                variables: {
                    restaurant: {
                        _id: data.restaurant._id,
                        name: data.restaurant.name,
                        quickSearchKeywords: updatedKeywords
                    }
                }
            });

            setNewKeyword('');
            showSnackbar('Keyword added successfully');
            refetch();
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    // Edit Keyword Handler
    const handleEditKeyword = async() => {
        if (!editKeyword.trim()) {
            showSnackbar('Please enter a Keyword', 'error');
            return;
        }

        try {
            const updatedKeywords = data.restaurant.quickSearchKeywords.map(k =>
                k === selectedKeyword ? editKeyword.trim() : k
            );

            await editRestaurant({
                variables: {
                    restaurant: {
                        _id: data.restaurant._id,
                        name: data.restaurant.name,
                        quickSearchKeywords: updatedKeywords
                    }
                }
            });

            setDialogOpen(false);
            showSnackbar('Keyword updated successfully');
            refetch();
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    // Delete Keyword Handler
    const handleDeleteKeyword = async() => {
        try {
            const updatedKeywords = data.restaurant.quickSearchKeywords.filter(k => k !== selectedKeyword);

            await editRestaurant({
                variables: {
                    restaurant: {
                        _id: data.restaurant._id,
                        name: data.restaurant.name,
                        quickSearchKeywords: updatedKeywords
                    }
                }
            });

            showSnackbar('Keyword deleted successfully');
            setConfirmDelete(false);
            refetch();
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    // Table Columns Configuration
    const columns = [
        {
            name: 'Keywords',
            selector: row => row,
            sortable: true,
            cell: row => (
                <Typography sx={{
                    py: 1,
                    color: 'black',
                    fontWeight: 'medium'
                }}>
                    {row}
                </Typography>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <Box>
                    <IconButton
                        onClick={() => {
                            setSelectedKeyword(row);
                            setEditKeyword(row);
                            setDialogOpen(true);
                        }}
                        color="primary"
                        size="small"
                    >
                        <EditIcon sx={{ color: 'green' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedKeyword(row);
                            setConfirmDelete(true);
                        }}
                        color="error"
                        size="small"
                    >
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // Filtered Keywords
    const filteredKeywords = data?.restaurant?.quickSearchKeywords?.filter(keyword =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                {/* Add Category Section */}
                <Paper sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'white'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            bgcolor: '#FF8F00',
                            p: 2,
                            borderRadius: 1,
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        Add Quick Search Keyword
                    </Typography>
                    <TextField
                        placeholder="Enter Quick-Search-Keyword name"
                        variant="outlined"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        sx={{
                            mb: 2,
                            me: 2,
                            width: '40%',
                            '& .MuiOutlinedInput-input': {
                                padding: '8px 14px',
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: '#e0e0e0'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#e0e0e0'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#e0e0e0'
                                }
                            }
                        }}
                        InputProps={{
                            style: { color: 'black' }
                        }}
                    />

                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#FFB300',
                            color: 'black',
                            '&:hover': { bgcolor: '#e6b800' },
                            p: 1,
                            borderRadius: 4,
                            ml: 1,
                            textTransform: 'none',
                            fontWeight: 'medium'
                        }}
                        onClick={handleAddKeyword}
                    >
                        Save
                    </Button>
                </Paper>

                {/* Categories List */}
                <Paper sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'white'
                }}>
                    {loading ? (
                        <CustomLoader />
                    ) : (
                        <DataTable
                            title={
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        marginBottom: "10px"
                                    }}
                                >
                                    Quick Search Keyword
                                </Typography>
                            }
                            columns={columns}
                            data={filteredKeywords}
                            pagination
                            subHeader
                            subHeaderComponent={
                                <TextField
                                    placeholder="Search Keywords"
                                    variant="outlined"
                                    size="small"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{
                                        minWidth: 300,
                                        '& input': { color: 'black' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '& fieldset': {
                                                borderColor: '#e0e0e0'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#e0e0e0'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e0e0e0'
                                            }
                                        }
                                    }}
                                />
                            }
                            customStyles={customStyles}
                        />
                    )}
                </Paper>

                {/* Edit Category Dialog */}
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle sx={{
                        bgcolor: '#ffcc00',
                        color: 'black',
                        fontWeight: 'bold'
                    }}>
                        Edit
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2,mt:2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={editKeyword}
                            onChange={(e) => setEditKeyword(e.target.value)}
                            placeholder="Enter category name"
                            autoFocus
                            InputProps={{
                                style: { color: 'black' }
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            variant="outlined"
                            sx={{ color: 'black', borderColor: 'black' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditKeyword}
                            variant="contained"
                            sx={{
                                bgcolor: '#ffcc00',
                                color: 'black',
                                '&:hover': { bgcolor: '#e6b800' }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={handleDeleteKeyword}
                    title="Confirm Delete"
                    description="Are you sure you want to delete this keyword?"
                />

                {/* Snackbar for Notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%', color: 'black' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default ShrRestaurant;