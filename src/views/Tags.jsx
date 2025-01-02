import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import TagComponent from '../components/Tags/Tags'
import CustomLoader from '../components/Loader/CustomLoader'
import Header from '../components/Headers/Header'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Typography,
  ListItemIcon,
  Grid,
  Switch
} from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const GET_TAGS = gql`
  query GetFoodTags {
    bootstrap {
      foodTags {
        enumVal
        displayName
        isActive
        restaurantDetailHandlingType
      }
    }
  }
`;

const DELETE_TAG = gql`
  mutation DeleteTag($enumVal: String!) {
    deleteTag(enumVal: $enumVal) {
      success
      message
    }
  }
`;

const Tags = props => {
  const { t } = props
  const { PAID_VERSION } = ConfigurableValues()
  const [editModal, setEditModal] = useState(false)
  const [tag, setTag] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tagToDelete, setTagToDelete] = useState(null)
  const onChangeSearch = e => setSearchQuery(e.target.value)

  const toggleModal = tag => {
    setEditModal(!editModal)
    setTag(tag)
  }
  const closeEditModal = () => {
    setEditModal(false)
  }

  const [mutate, { loading }] = useMutation(DELETE_TAG)

  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_TAGS
  )

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field]) {
        return row[field].toLowerCase()
      }
      return row[field]
    }
    return orderBy(rows, handleField, direction)
  }

  const columns = [
    {
      name: t('Display Name'),
      sortable: true,
      selector: 'displayName'
    },
    {
      name: t('Active'),
      cell: row => (
        <Switch
          checked={row.isActive}
          onChange={() => handleToggle(row)}
          disabled={isDefaultTag(row)}
        />
      )
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]

  const actionButtons = row => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = event => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
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
                  e.preventDefault()
                  if (!isDefaultTag(row)) {
                    toggleModal(row)
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
                  if (!isDefaultTag(row)) {
                    setTagToDelete(row);
                    setConfirmDelete(true);
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
    )
  }

  const handleToggle = (row) => {
    // Implement toggle logic here
  }

  const isDefaultTag = (tag) => {
    const defaultTags = ['Chef Special', 'Popular']
    return defaultTags.includes(tag.displayName)
  }

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null

  const filtered =
    searchQuery.length < 3
      ? data && data.bootstrap.foodTags
      : data &&
      data.bootstrap.foodTags.filter(tag => {
        return (
          tag.displayName.toLowerCase().search(regex) > -1
        )
      })

  const handleDelete = () => {
    mutate({
      variables: {
        enumVal: tagToDelete.enumVal
      }
    })
    setConfirmDelete(false);
  };

  const globalClasses = useGlobalStyles()

  const isDuplicateTag = (displayName) => {
    if (data && data.bootstrap.foodTags.length > 0) {
      const tags = data.bootstrap.foodTags.filter(tag => tag.displayName.toLowerCase() === displayName.toLowerCase())
      return tags.length > 0 ? true : false
    }
    return false
  }

  return (
    <>
      <Header />
      {isOpen && (
        <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
      )}
      <Container className={globalClasses.flex} fluid>
        <Grid container mb={3}>
          <Grid item xs={12} md={7}>
            <TagComponent isDuplicateTag={isDuplicateTag} />
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
            title={<TableHeader title={t('Tags')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="displayName"
            customStyles={customStyles}
          />
        )}

        <Modal
          open={editModal}
          onClose={() => {
            toggleModal(null)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <TagComponent isDuplicateTag={isDuplicateTag} tag={tag} onClose={closeEditModal} />
        </Modal>

        <DeleteConfirmationDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          title={t('Confirm Delete')}
          description={t('Are you sure you want to delete this tag?')}
        />
      </Container>
    </>
  )
}

export default withTranslation()(Tags)