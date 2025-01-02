import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { validateFunc } from '../../constraints/constraints';
import { withTranslation } from 'react-i18next';
import {
  editSection,
  restaurantList,
  createSection,
  getSections
} from '../../apollo';
import useStyles from './styles';
import useGlobalStyles from '../../utils/globalStyles';
import {
  Box,
  Switch,
  Typography,
  Input,
  Alert,
  Button,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';

const CREATE_SECTION = gql`${createSection}`;
const EDIT_SECTION = gql`${editSection}`;
const GET_SECTIONS = gql`${getSections}`;
const GET_RESTAURANT = gql`${restaurantList}`;

function Section(props) {
  const formRef = useRef();
  const [sectionName, setSectionName] = useState('');
  const [sectionEnable, setSectionEnable] = useState(false);
  const [restaurant, restaurantSetter] = useState([]);
  const [error, errorSetter] = useState('');
  const [success, successSetter] = useState('');
  const [nameError, nameErrorSetter] = useState(null);

  const mutation = props.section ? EDIT_SECTION : CREATE_SECTION;

  useEffect(() => {
    if (props.section) {
      setSectionName(props.section.name);
      setSectionEnable(props.section.enabled);
      restaurantSetter(props.section.restaurants.map(r => r._id));
    }
  }, [props.section]);

  const { data: sectionsData } = useQuery(GET_SECTIONS);
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(GET_RESTAURANT, { onError });

  const onCompleted = () => {
    const message = props.section
      ? t('SectionUpdatedSuccessfully')
      : t('SectionAddedSuccessfully');
    successSetter(message);
    errorSetter('');

    if (!props.section) clearFields();

    setTimeout(() => {
      successSetter('');
    }, 3000);
  };

  function onError(error) {
    const message = `${t('ActionFailedTryAgain')} ${error}`;
    successSetter('');
    errorSetter(message);
  }

  const [mutate, { loading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_SECTIONS }],
    onCompleted,
    onError
  });

  const onChange = event => {
    const value = event.target.value;
    const ids = restaurant;
    if (event.target.checked) {
      ids.push(value);
    } else {
      const index = ids.indexOf(value);
      if (index > -1) ids.splice(index, 1);
    }
    restaurantSetter([...ids]);
  };

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field));
  };

  const isDuplicateSection = (name, selectedRestaurants) => {
    if (!sectionsData || !sectionsData.sections) return false;

    return sectionsData.sections.some(section => {
      if (props.section && section._id === props.section._id) {
        return false;
      }

      const isSameName = section.name.toLowerCase() === name.toLowerCase();
      const isSameRestaurants = section.restaurants.length === selectedRestaurants.length &&
        section.restaurants.every(r => selectedRestaurants.includes(r._id));

      return isSameName || isSameRestaurants;
    });
  };

  const onSubmitValidation = () => {
    const name = formRef.current['input-name'].value;
    const nameErrors = !validateFunc({ name }, 'name');
    nameErrorSetter(nameErrors);

    if (isDuplicateSection(name, restaurant)) {
      errorSetter(t('DuplicateSectionError'));
      setTimeout(() => {
        clearFields();
        errorSetter('');
      }, 3000);
      return false;
    }

    return nameErrors;
  };

  const clearFields = () => {
    formRef.current.reset();
    nameErrorSetter(null);
    restaurantSetter([]);
  };

  const { t } = props;
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.section ? classes.headingBlack : classes.heading}>
          <Typography
            variant="h6"
            className={props.section ? classes.textWhite : classes.text}>
            {props.section ? t('EditSection') : t('AddSection')}
          </Typography>
        </Box>
        <Box ml={12} mt={1}>
          <label>{sectionEnable ? t('Disable') : t('Enable')}</label>
          <Switch
            checked={sectionEnable}
            onChange={e => setSectionEnable(e.target.checked)}
            id="input-enable"
            name="input-enable"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-name"
              name="input-name"
              placeholder={t('SectionName')}
              type="text"
              value={sectionName}
              onChange={e => setSectionName(e.target.value)}
              onBlur={event => {
                onBlur(nameErrorSetter, 'name', event.target.value);
              }}
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
          <Grid container spacing={1} mt={1} className={classes.section}>
            {loadingQuery ? <div>{t('LoadingDots')}</div> : null}
            {errorQuery ? (
              <div>
                {t('ErrorDots')} {JSON.stringify(error)}
              </div>
            ) : null}
            {data &&
              data.restaurantList.map(restaurantItem => (
                <Grid item xs={12} md={6} key={restaurantItem._id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={restaurantItem._id}
                        checked={restaurant.includes(restaurantItem._id)}
                        onChange={onChange}
                      />
                    }
                    label={`${restaurantItem.name} (${restaurantItem.address})`}
                  />
                </Grid>
              ))}
          </Grid>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault();
                if (onSubmitValidation() && !loading) {
                  mutate({
                    variables: {
                      section: {
                        _id: props.section ? props.section._id : '',
                        name: formRef.current['input-name'].value,
                        enabled: sectionEnable,
                        restaurants: restaurant
                      }
                    }
                  });
                  if (!props.section) clearFields();
                  setTimeout(() => {
                    props.onClose();
                  }, 4000);
                }
              }}>
              {props.section ? t('Update') : t('Save')}
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
          {error && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default withTranslation()(Section);