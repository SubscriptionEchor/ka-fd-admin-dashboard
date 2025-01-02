import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { gql, useMutation, useQuery } from '@apollo/client';
import Header from '../components/Headers/Header';
import VendorComponent from '../components/Vendor/Vendor';
import CustomLoader from '../components/Loader/CustomLoader';
import { getVendors, deleteVendor } from '../apollo';
import DataTable from 'react-data-table-component';
import orderBy from 'lodash/orderBy';
import SearchBar from '../components/TableHeader/SearchBar';
import { customStyles } from '../utils/tableCustomStyles';
import useGlobalStyles from '../utils/globalStyles';
import {
  Container,
  Button,
  Grid,
  Modal,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme
} from '@mui/material';
import { ReactComponent as VendorIcon } from '../assets/svg/svg/Vendors.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableHeader from '../components/TableHeader';
import Alert from '../components/Alert';
import ConfigurableValues from '../config/constants';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const GET_VENDORS = gql`
  ${getVendors}
`;
const DELETE_VENDOR = gql`
  ${deleteVendor}
`;

const Vendors = props => {
  const theme = useTheme();
  const { PAID_VERSION } = ConfigurableValues();
  const { t } = props;
  const [editModal, setEditModal] = useState(false);
  const [vendors, setVendor] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const onChangeSearch = e => setSearchQuery(e.target.value);
  const golbalClasses = useGlobalStyles();

  const closeEditModal = () => {
    setEditModal(false);
  };

  const { loading: loadingQuery, error: errorQuery, data, refetch } = useQuery(
    GET_VENDORS
  );
  const [mutate, { loading }] = useMutation(DELETE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS }]
  });

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null;

  const filtered =
    searchQuery.length < 3
      ? data && data.vendors
      : data &&
      data.vendors.filter(vendor => {
        return vendor.email.toLowerCase().search(regex) > -1;
      });

  const toggleModal = vendor => {
    setEditModal(!editModal);
    setVendor(vendor);
  };

  useEffect(() => {
    localStorage.removeItem('restaurant_id');
  }, []);

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
      name: t('Email'),
      sortable: true,
      selector: 'email'
    },
    {
      name: t('TotalRestaurants'),
      sortable: true,
      selector: row => row.restaurants.length,
      sortField: 'restaurants',
      cell: row => <>{row.restaurants.length}</>,
      sortFunction: (a, b) => {
        const aLength = a.restaurants.length;
        const bLength = b.restaurants.length;
        if (aLength < bLength) return -1;
        if (aLength > bLength) return 1;
        return 0;
      }
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
        <Button
          size="20px"
          variant="contained"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            backgroundColor: theme.palette.warning.dark,
            padding: 0,
            height: '15px',
            fontSize: '7px',
            '&:hover': {
              color: theme.palette.common.white
            }
          }}
          onClick={e => {
            e.preventDefault();
            localStorage.setItem('vendorId', row._id);
            props.history.push({
              pathname: '/restaurant/list',
              state: { id: row._id }
            });
          }}>
          {t('Restaurants')}
        </Button>

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
                  if (PAID_VERSION) {
                    setVendorToDelete(row);
                    setConfirmDelete(true);
                  } else {
                    setIsOpen(true);
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 5000);
                  }
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

  const handleDelete = () => {
    mutate({ variables: { id: vendorToDelete._id } });
    setConfirmDelete(false);
  };

  return (
    <>
      <Header />
      {isOpen && (
        <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
      )}

      <Container className={golbalClasses.flex}>
        <Grid container>

          <Grid item xs={12} lg={6}>
            <VendorComponent />
          </Grid>

          <Grid
            sx={{ display: { xs: 'none', lg: 'block' } }}
            item
            mt={5}
            ml={-2}
            order={{ xs: 1, lg: 2 }}>
            <VendorIcon />
          </Grid>

        </Grid>
        {errorQuery ? <span> `Error! ${errorQuery.message}`</span> : null}
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
            title={<TableHeader title={t('Vendors')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="email"
            customStyles={customStyles}
          // selectableRows
          />
        )}
        <Modal
          open={editModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClose={() => {
            toggleModal();
          }}>
          <VendorComponent vendor={vendors} onClose={closeEditModal} />
        </Modal>

        {/* Use the DeleteConfirmationDialog component for delete popUp */}
        <DeleteConfirmationDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          title={t('Confirm Delete')}
          description={t('Are you sure you want to delete this vendor?')} />
      </Container>

    </>
  );
};

export default withTranslation()(Vendors);