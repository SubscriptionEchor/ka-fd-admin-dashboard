import React, { useCallback, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useMutation, useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { updateDeliveryBoundsAndLocation, getRestaurantProfile } from '../apollo'
import useGlobalStyles from '../utils/globalStyles'
import useStyles from '../components/styles'
import CustomLoader from '../components/Loader/CustomLoader'
import { Container, Box, Button, Typography, Alert, useTheme } from '@mui/material'
import { useTranslation, withTranslation } from 'react-i18next'

// Define GraphQL queries and mutations
const UPDATE_DELIVERY_BOUNDS_AND_LOCATION = gql`
  ${updateDeliveryBoundsAndLocation}
`
const GET_RESTAURANT_PROFILE = gql`
  ${getRestaurantProfile}
`

function DeliveryBoundsAndLocation() {
  const { t } = useTranslation()
  const theme = useTheme()
  const restaurantId = localStorage.getItem('restaurantId')

  // State variables
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [center, setCenter] = useState({ lat: 33.684422, lng: 73.047882 })
  const [marker, setMarker] = useState({ lat: 33.684422, lng: 73.047882 })

  const locations = [
    [17.385044, 78.486671],
  ];

  // GraphQL queries and mutations
  const { error: errorQuery, loading: loadingQuery } = useQuery(GET_RESTAURANT_PROFILE, {
    variables: { id: restaurantId },
    fetchPolicy: 'network-only',
    onCompleted,
    onError
  })

  const [mutate, { loading }] = useMutation(UPDATE_DELIVERY_BOUNDS_AND_LOCATION, {
    update: updateCache,
    onError,
    onCompleted
  })

  // Update cache after mutation
  function updateCache(cache, { data: { result } }) {
    const { restaurant } = cache.readQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantId }
    })
    cache.writeQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantId },
      data: {
        restaurant: {
          ...restaurant,
          ...result
        }
      }
    })
  }

  // Handle successful data fetch
  function onCompleted({ restaurant }) {
    if (restaurant) {
      setCenter({
        lat: +restaurant.location.coordinates[1],
        lng: +restaurant.location.coordinates[0]
      })
      setMarker({
        lat: +restaurant.location.coordinates[1],
        lng: +restaurant.location.coordinates[0]
      })
    }
  }

  // Handle errors during data fetch or mutation
  function onError({ networkError, graphqlErrors }) {
    setErrorMessage(t('UpdatingLocationError'))
    setTimeout(() => setErrorMessage(''), 5000) // Clear error message after 5 seconds
  }

  // Validate the marker before saving
  const validate = () => {
    if (!marker) {
      setErrorMessage(t('LocationMarkerRequired'))
      setTimeout(() => setErrorMessage(''), 5000) // Clear error message after 5 seconds
      return false
    }
    setSuccessMessage(t('LocationUpdatedSuccessfully'))
    setTimeout(() => setSuccessMessage(''), 5000) // Clear success message after 5 seconds
    setErrorMessage('')
    return true
  }

  // Update marker position when dragging ends
  const onDragEnd = mapMouseEvent => {
    setMarker({
      lat: mapMouseEvent.latLng.lat(),
      lng: mapMouseEvent.latLng.lng()
    })
  }

  const globalClasses = useGlobalStyles()
  const classes = useStyles()

  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        <Box container className={classes.container}>
          <Box className={classes.flexRow}>
            <Box item className={classes.heading2}>
              <Typography variant="h6" className={classes.textWhite}>
                {t('SetLocation')}
              </Typography>
            </Box>
          </Box>

          {/* Show loader or error message */}
          {loadingQuery && <CustomLoader />}
          {errorQuery && <p className="text-danger">{errorQuery.message}</p>}

          {/* Google Map */}
          <Box className={classes.form}>
            <GoogleMap
              mapContainerStyle={{
                height: '500px',
                width: '100%',
                borderRadius: 30
              }}
              id="google-map"
              zoom={10}
              center={{ lat: locations[0][0], lng: locations[0][1] }}
              onClick={(e) => setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })}>

              {/* Marker */}
              {marker && (
                <Marker
                  position={marker}
                  draggable
                  onDragEnd={onDragEnd}
                  onRightClick={() => setMarker(null)}
                />
              )}
            </GoogleMap>
          </Box>

          {/* Actions */}
          <Box
            style={{
              padding: '20px 30px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>

            {/* Set Restaurant Location Button */}
            <Button
              style={{
                color: theme.palette.warning.dark,
                backgroundColor: theme.palette.common.black
              }}
              className={globalClasses.button}
              onClick={() => { /* No additional action needed */ }}>
              {t('SetRestaurantLocation')}
            </Button>

            {/* Remove Restaurant Location Button */}
            <Button
              style={{
                color: theme.palette.common.black,
                backgroundColor: theme.palette.grey[300]
              }}
              className={globalClasses.button}
              onClick={() => setMarker(null)}>
              {t('RemoveRestaurantLocation')}
            </Button>
          </Box>

          {/* Save Button */}
          <Box mt={5} mb={3} display="flex" justifyContent="center">
            <Button
              disabled={loading}
              className={globalClasses.button}
              onClick={() => {
                const isValid = validate()
                if (isValid) {
                  const location = {
                    latitude: marker.lat,
                    longitude: marker.lng
                  }
                  mutate({ variables: { id: restaurantId, location } })
                }
              }}>
              {t('Save')}
            </Button>
          </Box>

          {/* Success and Error Messages */}
          {successMessage && (
            <Alert
              className={globalClasses.alertSuccess}
              variant="filled"
              severity="success">
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Container>
    </>
  )
}

export default withTranslation()(DeliveryBoundsAndLocation)