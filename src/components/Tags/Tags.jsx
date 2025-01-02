// import React, { useState } from 'react'
// import { useMutation, gql } from '@apollo/client'
// import { withTranslation } from 'react-i18next'
// import { Box, Typography, Input, Button, Alert } from '@mui/material'
// import useGlobalStyles from '../../utils/globalStyles'
// import useStyles from '../styles'

// const CREATE_TAG = gql`
//   mutation CreateTag($tagInput: TagInput!) {
//     createTag(tagInput: $tagInput) {
//       enumVal
//       displayName
//     }
//   }
// `

// const EDIT_TAG = gql`
//   mutation EditTag($tagInput: TagInput!) {
//     editTag(tagInput: $tagInput) {
//       enumVal
//       displayName
//     }
//   }
// `

// function Tag(props) {
//   const mutation = props.tag ? EDIT_TAG : CREATE_TAG
//   const [mainError, mainErrorSetter] = useState('')
//   const [success, successSetter] = useState('')
//   const [tag, setTag] = useState(props.tag ? props.tag.displayName : '')

//   const onCompleted = data => {
//     const message = props.tag
//       ? t('TagUpdatedSuccessfully')
//       : t('TagAddedSuccessfully')
//     successSetter(message)
//     mainErrorSetter('')
//     setTag('')
//     setTimeout(() => {
//       hideAlert()
//       props.onClose()
//     }, 2000)
//   }

//   const onError = error => {
//     const message = `${t('ActionFailedTryAgain')} ${error}`
//     successSetter('')
//     mainErrorSetter(message)
//     setTimeout(() => {
//       hideAlert()
//       props.onClose()
//     }, 2000)
//   }

//   const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })
//   const hideAlert = () => {
//     mainErrorSetter('')
//     successSetter('')
//   }

//   const { t } = props
//   const classes = useStyles()
//   const globalClasses = useGlobalStyles()

//   return (
//     <Box container className={classes.container}>
//       <Box className={classes.flexRow}>
//         <Box
//           item
//           className={props.tag ? classes.headingBlack : classes.heading2}>
//           <Typography variant="h6" className={classes.textWhite}>
//             {props.tag ? t('Edit Tag') : t('Add Tag')}
//           </Typography>
//         </Box>
//       </Box>
//       <Box className={classes.form}>
//         <form>
//           <Box>
//             <Typography className={classes.labelText}>{t('Name')}</Typography>
//             <Input
//               style={{ marginTop: -1 }}
//               id="input-tag"
//               name="input-tag"
//               placeholder={t('PHTag')}
//               type="text"
//               defaultValue={tag}
//               onChange={e => {
//                 setTag(e.target.value)
//               }}
//               disableUnderline
//               className={globalClasses.input}
//             />
//           </Box>
//           <Box>
//             <Button
//               className={globalClasses.button}
//               disabled={loading}
//               onClick={async e => {
//                 e.preventDefault()
//                 if (!loading) {
//                   if (props?.isDuplicateTag(tag)) {
//                     mainErrorSetter(t('Tag Already Exists'))
//                     setTimeout(() => {
//                       hideAlert()
//                       props.onClose()
//                     }, 2000)
//                     return
//                   }
//                   mutate({
//                     variables: {
//                       tagInput: {
//                         enumVal: props.tag ? props.tag.enumVal : '',
//                         displayName: tag
//                       }
//                     }
//                   })
//                 }
//               }}>
//               {t('Save')}
//             </Button>
//           </Box>
//           <Box mt={2}>
//             {success && (
//               <Alert
//                 className={globalClasses.alertSuccess}
//                 variant="filled"
//                 severity="success">
//                 {success}
//               </Alert>
//             )}
//             {mainError && (
//               <Alert
//                 className={globalClasses.alertError}
//                 variant="filled"
//                 severity="error">
//                 {mainError}
//               </Alert>
//             )}
//           </Box>
//         </form>
//       </Box>
//     </Box>
//   )
// }

// export default withTranslation()(Tag)

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { withTranslation } from 'react-i18next';
import { Box, Typography, Input, Button, Alert } from '@mui/material';
import useGlobalStyles from '../../utils/globalStyles';
import useStyles from '../styles';

// Define the GraphQL mutations
const CREATE_FOOD_TAG = gql`
  mutation CreateFoodTag($foodTagInput: FoodTagInput!) {
    createFoodTag(foodTagInput: $foodTagInput) {
      enumVal
      displayName
    }
  }
`;

const EDIT_FOOD_TAG = gql`
  mutation EditFoodTag($foodTagInput: FoodTagInput!) {
    editFoodTag(foodTagInput: $foodTagInput) {
      enumVal
      displayName
    }
  }
`;

function Tag(props) {
  const mutation = props.tag ? EDIT_FOOD_TAG : CREATE_FOOD_TAG;
  const [mainError, setMainError] = useState('');
  const [success, setSuccess] = useState('');
  const [tag, setTag] = useState(props.tag ? props.tag.displayName : '');

  const onCompleted = () => {
    const message = props.tag
      ? props.t('TagUpdatedSuccessfully')
      : props.t('TagAddedSuccessfully');
    setSuccess(message);
    setMainError('');
    setTag('');
    setTimeout(() => {
      hideAlert();
      props.onClose();
    }, 2000);
  };

  const onError = (error) => {
    const message = `${props.t('ActionFailedTryAgain')} ${error.message}`;
    setSuccess('');
    setMainError(message);
    setTimeout(() => {
      hideAlert();
      props.onClose();
    }, 2000);
  };

  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted });

  const hideAlert = () => {
    setMainError('');
    setSuccess('');
  };

  const { t } = props;
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const handleSave = async(e) => {
    e.preventDefault();
    if (!loading) {
      if (props?.isDuplicateTag(tag)) {
        setMainError(t('Tag Already Exists'));
        setTimeout(() => {
          hideAlert();
          props.onClose();
        }, 2000);
        return;
      }
      mutate({
        variables: {
          foodTagInput: {
            enumVal: props.tag ? props.tag.enumVal : tag.toUpperCase().replace(/\s+/g, '_'),
            displayName: tag,
            isActive: true, // Assuming you want the tag to be active by default
            restaurantDetailHandlingType: 'DEFAULT' // Adjust as needed
          }
        }
      });
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.flexRow}>
        <Box className={props.tag ? classes.headingBlack : classes.heading2}>
          <Typography variant="h6" className={classes.textWhite}>
            {props.tag ? t('Edit Tag') : t('Add Tag')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.form}>
        <form>
          <Box>
            <Typography className={classes.labelText}>{t('Name')}</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-tag"
              name="input-tag"
              placeholder={t('PHTag')}
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              disableUnderline
              className={globalClasses.input}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={handleSave}
            >
              {t('Save')}
            </Button>
          </Box>
          <Box mt={2}>
            {success && (
              <Alert
                className={globalClasses.alertSuccess}
                variant="filled"
                severity="success"
              >
                {success}
              </Alert>
            )}
            {mainError && (
              <Alert
                className={globalClasses.alertError}
                variant="filled"
                severity="error"
              >
                {mainError}
              </Alert>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default withTranslation()(Tag);