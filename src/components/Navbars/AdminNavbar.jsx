import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import ResetPassword from '../ResetPassword/ResetPassword'
import { useApolloClient } from '@apollo/client'
import {
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
  AppBar,
  Box,
  Toolbar,
  Divider,
  FormControl,
  Select,
  useTheme
} from '@mui/material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import profileImg from '../../assets/svg/profile.svg'


function AdminNavbar(props) {
  const theme = useTheme()
  const client = useApolloClient()
  const [modal, setModal] = useState(false)
  const [language, setLanguage] = useState(
    localStorage.getItem('enatega-language') || 'en'
  )
  const [anchorEl, setAnchorEl] = useState(null) // Define anchorEl state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { t, i18n } = props

  const toggleModal = () => {
    setModal(prev => !prev)
  }

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLanguage = event => {
    const newLanguage = event.target.value
    setLanguage(newLanguage)
    localStorage.setItem('enatega-language', newLanguage)
    i18n.changeLanguage(newLanguage)
    handleClose()
  }

  const vendor = localStorage.getItem('user-enatega')
    ? JSON.parse(localStorage.getItem('user-enatega')).userType === 'VENDOR'
    : false

  const handleLogout = async() => {
    localStorage.clear();

    try {
      await client.clearStore();
      await client.resetStore();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }

    props.history.push('/auth/login');
  };

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'block' },
        flexGrow: 1,
        boxShadow: 0
      }}>
      <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 0 }}>
        <Toolbar>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ flexGrow: 1, color: 'common.black', fontWeight: 'bold' }}>
            {props.match.path === '/restaurant' ? '' : t(props.brandText)}
          </Typography>

          <div>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: 'white',
                paddingRight: '10px',
                borderRadius: '40px',
                height: 40,
                width: 100
              }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <img
                  alt="..."
                  src={profileImg}
                  style={{
                    height: 30,
                    width: 29,
                    borderRadius: '50%',
                    marginLeft: -9,
                    marginTop: 5
                  }}
                />
              </IconButton>
              <Typography
                mt={1}
                sx={{ fontWeight: 'bold' }}
                color="common.black">
                Profile
              </Typography>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem>
                <FormControl>
                  <Select
                    value={language}
                    onChange={handleChangeLanguage}
                    style={{ color: theme.palette.common.black }}>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="en">
                      English
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="ar">
                      Arabic
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="de">
                      Deutsche
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="zh">
                      中文
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="km">
                      ភាសាខ្មែរ
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="fr">
                      français
                    </MenuItem>
                  </Select>
                </FormControl>
              </MenuItem>
              {/* <MenuItem
                sx={{ color: theme.palette.common.black }}
                onClick={handleClose}>
                {t('Welcome')}
              </MenuItem> */}
              <Divider />
              {vendor ? (
                <MenuItem
                  sx={{ color: theme.palette.common.black }}
                  onClick={e => {
                    e.preventDefault()
                    toggleModal()
                  }}>
                  {t('ResetPassword')}
                </MenuItem>
              ) : null}
              <MenuItem
                sx={{ color: theme.palette.common.black }}
                onClick={() => setLogoutDialogOpen(true)}
              >
                {t('Logout')}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Modal
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        open={modal}
        onClose={() => {
          toggleModal()
        }}>
        <ResetPassword />
      </Modal>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => {
          setLogoutDialogOpen(false);
          setAnchorEl(null); // Close the profile menu
        }}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5', // Change background color
            color: '#333', // Change text color
          },
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ color: '#ff9800' }}>
          {t('Confirm Logout')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description" sx={{ color: '#333' }}>
            {t('Are you sure you want to logout?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLogoutDialogOpen(false);
              setAnchorEl(null);
            }}
            sx={{ color: '#ff9800' }}
          >
            {t('Cancel')}
          </Button>
          <Button onClick={handleLogout} sx={{ color: '#ff9800' }} autoFocus>
            {t('Logout')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default withTranslation()(AdminNavbar)

