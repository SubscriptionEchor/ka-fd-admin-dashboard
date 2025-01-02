import React, { useState } from 'react'
import {
  Box,
  Typography,
  Input,
  Alert,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  useTheme
} from '@mui/material'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { createOptions, editOption } from '../../apollo'
import { validateFunc } from '../../constraints/constraints'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

const CREATE_OPTIONS = gql`
  ${createOptions}
`

const EDIT_OPTION = gql`
  ${editOption}
`

function Option(props) {
  const theme = useTheme()
  const { t } = props
  const [option, optionSetter] = useState(
    props.option
      ? [{
        ...props.option,
        titleError: false,
        priceError: false,
        displayPrice: props.option.displayPrice ?? true,
        internalName: props.option.title
      }]
      : [
        {
          title: '',
          description: '',
          price: 0,
          displayPrice: true,
          internalName: '',
          titleError: false,
          priceError: false
        }
      ]
  )
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const mutation = props.option ? EDIT_OPTION : CREATE_OPTIONS

  const onCompleted = ({ createOptions, editOption }) => {
    if (createOptions) {
      optionSetter([
        {
          title: '',
          description: '',
          price: 0,
          displayPrice: true,
          internalName: '',
          titleError: false,
          priceError: false
        }
      ])
      successSetter(t('Saved'))
      mainErrorSetter('')
      setTimeout(hideAlert, 3000)
    }
    if (editOption) {
      successSetter(t('Saved'))
      mainErrorSetter('')
    }
  }

  const onError = error => {
    mainErrorSetter(`${t('errorWhileSaving')} ${error}`)
    successSetter('')
    setTimeout(hideAlert, 3000)
  }

  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })

  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }

  const onBlur = (index, state) => {
    const options = [...option]
    if (state === 'title') {
      options[index].titleError = !!validateFunc(
        { optionTitle: options[index][state] },
        'optionTitle'
      )
      options[index].internalName = options[index].title
    }
    if (state === 'price') {
      options[index].priceError = !!validateFunc(
        { optionPrice: options[index][state] },
        'optionPrice'
      )
    }
    optionSetter(options)
  }

  // const onChange = (event, index, state) => {
  //   const options = [...option]
  //   options[index][state] = event.target.value
  //   if (state === 'title') {
  //     options[index].internalName = event.target.value
  //   }
  //   optionSetter(options)
  // }

  const onChange = (event, index, state) => {
    const options = [...option]
    if (state === 'price') {
      options[index][state] = event.target.value.replace(/^0+/, '') || '0'
    } else {
      options[index][state] = event.target.value
    }
    if (state === 'title') {
      options[index].internalName = event.target.value
    }
    optionSetter(options)
  }

  const onCheckboxChange = (event, index) => {
    const options = [...option]
    options[index].displayPrice = !event.target.checked
    optionSetter(options)
  }

  const validate = () => {
    const options = [...option]
    options.forEach((option, index) => {
      onBlur(index, 'title')
      onBlur(index, 'price')
    })
    return !options.some(option => option.titleError || option.priceError)
  }

  const restaurantId = localStorage.getItem('restaurantId')
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const handleWheel = (e) => {
    e.target.blur()
  }

  const handleSave = () => {
    if (validate()) {
      if (props.option) {
        // For editing existing option
        mutate({
          variables: {
            optionInput: {
              restaurant: restaurantId,
              options: {
                _id: props.option._id,
                title: option[0].title,
                description: option[0].description,
                price: parseFloat(option[0].price),
                displayPrice: option[0].displayPrice,
                internalName: option[0].title,
              }
            }
          }
        })
      } else {
        // For creating new option
        mutate({
          variables: {
            optionInput: {
              options: option.map(({ title, description, price, displayPrice }) => ({
                title,
                description,
                price: parseFloat(price),
                displayPrice,
                internalName: title
              })),
              restaurant: restaurantId
            }
          }
        })
      }
      setTimeout(() => {
        props.onClose()
      }, 4000)
    }
  }

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.option ? classes.headingBlack : classes.heading}>
          <Typography variant="h6" className={classes.textWhite}>
            {props.option ? t('UpdateOption') : t('AddOption')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          {option.map((optionItem, index) => (
            <Grid container key={optionItem._id || index}>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Title')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-title-${index}`}
                    placeholder={t('Title')}
                    type="text"
                    value={optionItem.title}
                    onChange={event => onChange(event, index, 'title')}
                    onBlur={() => onBlur(index, 'title')}
                    disableUnderline
                    className={`${globalClasses.input} ${optionItem.titleError ? globalClasses.inputError : ''
                      }`}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Description')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-description-${index}`}
                    placeholder={t('Description')}
                    type="text"
                    value={optionItem.description}
                    onChange={event => onChange(event, index, 'description')}
                    disableUnderline
                    className={globalClasses.input}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Price')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-price-${index}`}
                    placeholder={t('Price')}
                    inputProps={{ min: 0, onWheel: handleWheel }}
                    type="number"
                    value={optionItem.price}
                    onChange={event => onChange(event, index, 'price')}
                    onBlur={() => onBlur(index, 'price')}
                    disableUnderline
                    className={`${globalClasses.input} ${optionItem.priceError ? globalClasses.inputError : ''
                      }`}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!optionItem.displayPrice}
                      onChange={event => onCheckboxChange(event, index)}
                      color="primary"
                    />
                  }
                  label={t('Click to not show display name')}
                />
              </Grid>
            </Grid>
          ))}

          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={handleSave}>
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
          {mainError && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              {mainError}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default withTranslation()(Option)