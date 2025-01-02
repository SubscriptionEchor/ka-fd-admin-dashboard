import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { withTranslation } from 'react-i18next';
import CategoryComponent from '../components/Category/Category';
import CustomLoader from '../components/Loader/CustomLoader';
import Header from '../components/Headers/Header';
import { getRestaurantDetail, deleteCategory } from '../apollo';
import DataTable from 'react-data-table-component';
import orderBy from 'lodash/orderBy';
import SearchBar from '../components/TableHeader/SearchBar';
import useGlobalStyles from '../utils/globalStyles';
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Typography,
  ListItemIcon,
  Grid
} from '@mui/material';
import { customStyles } from '../utils/tableCustomStyles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableHeader from '../components/TableHeader';
import Alert from '../components/Alert';
import ConfigurableValues from '../config/constants';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const GET_CATEGORIES = gql`
  ${getRestaurantDetail}
`;

const DELETE_CATEGORY = gql`
  ${deleteCategory}
`;

const Category = props => {
  const { t } = props;
  const { PAID_VERSION } = ConfigurableValues();
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const onChangeSearch = e => setSearchQuery(e.target.value);
  const [errorMessage, setErrorMessage] = useState('');


  const toggleModal = category => {
    setEditModal(!editModal);
    setCategory(category);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const restaurantId = localStorage.getItem('restaurantId');

  const [mutate, { loading }] = useMutation(DELETE_CATEGORY);

  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_CATEGORIES,
    {
      variables: {
        id: restaurantId
      }
    }
  );

  if (data) {
    console.log('All Categories:', data.restaurant.categories);
  }

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field]) {
        return row[field].toLowerCase();
      }
      return row[field];
    };
    return orderBy(rows, handleField, direction);
  };

  const columns = [
    {
      name: t('Title'),
      sortable: true,
      selector: row => row.title, 
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ];

  const actionButtons = row => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            onClick={handleClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Paper>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <MenuItem
                onClick={e => {
                  e.preventDefault();

                  if (PAID_VERSION) toggleModal(row);
                  else {
                    setIsOpen(true);
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 5000);
                  }
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'green' }} />
                </ListItemIcon>
                <Typography color="green">{t('Edit')}</Typography>
              </MenuItem>
              <MenuItem
                onClick={e => {
                  e.preventDefault();
                  setCategoryToDelete(row);
                  setConfirmDelete(true);
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                </ListItemIcon>
                <Typography color="red">{t('Delete')}</Typography>
              </MenuItem>
            </Menu>
          </Paper>
        </div>
      </>
    );
  };

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null;

    const filtered =
    data?.restaurant.categories.filter(category => {
      return (
        searchQuery.length < 3 ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Add some custom styles
  const alertStyle = {
    position: 'fixed',
    top: '60%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    minWidth: '425px',
    textAlign: 'center'
  };

  const handleDelete = () => {
    mutate({
      variables: {
        id: categoryToDelete._id,
        restaurant: restaurantId
      },
      onError: (error) => {
        if (error.message.includes('Cannot delete category that contains foods')) {
          setErrorMessage('Cannot delete category that contains foods. Please remove all foods first.');
          // Set timer to clear the error message after 3 seconds
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
        setConfirmDelete(false);
      },
      onCompleted: () => {
        setConfirmDelete(false);
        setErrorMessage('');
      }
    });
  };

  const globalClasses = useGlobalStyles();

  const isDuplicateCategory = title => {
    if (data && data.restaurant.categories.length > 0) {
      const categories = data.restaurant.categories.filter(
        category => category.title.toLowerCase() === title.toLowerCase()
      );
      return categories.length > 0;
    }
    return false;
  };

  return (
    <>
      <Header />
      {isOpen && (
        <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
      )}
      <Container className={globalClasses.flex} fluid>
        <Grid container mb={3}>
          <Grid item xs={12} md={7}>
            <CategoryComponent isDuplicateCategory={isDuplicateCategory} />
          </Grid>
        </Grid>
        {errorQuery ? <span>{`Error! ${errorQuery.message}`}</span> : null}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                onClick={() => refetch()}
              />
            }
            title={<TableHeader title={t('Categories')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="title"
            customStyles={customStyles}
          />
        )}

        <Modal
          open={editModal}
          onClose={() => {
            toggleModal(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <CategoryComponent
            isDuplicateCategory={isDuplicateCategory}
            category={category}
            onClose={closeEditModal}
          />
        </Modal>

        {errorMessage && (
          <div style={alertStyle}>
            <Alert
              message={errorMessage}
              severity="error"
            />
          </div>
        )}

        <DeleteConfirmationDialog
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setErrorMessage('');
          }}
          onConfirm={handleDelete}
          title={t('Confirm Delete')}
          description={t('Are you sure you want to delete this Category?')}
        />
      </Container>
    </>
  );
};

export default withTranslation()(Category);