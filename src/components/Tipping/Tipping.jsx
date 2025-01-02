// import React, { useRef, useState } from 'react'
// import { useMutation, useQuery, gql } from '@apollo/client'
// import { validateFunc } from '../../constraints/constraints'
// import { withTranslation } from 'react-i18next'
// import useStyles from './styles'
// import useGlobalStyles from '../../utils/globalStyles'
// import { Box, Typography, Input, Button, Alert, Grid } from '@mui/material'
// import { editTipping, getTipping, createTipping } from '../../apollo'
// import usePreventScrollOnNumberInput from '../../hooks/usePreventScrollOnNumberInput';

// // queries to get and update and edit tipping
// const GET_TIPPING = gql`
//   ${getTipping}
// `
// const EDIT_TIPPING = gql`
//   ${editTipping}
// `

// const CREATE_TIPPING = gql`
//   ${createTipping}
// `

// function Tipping(props) {
//   const { t } = props
//   const formRef = useRef()

//   const tip1Ref = useRef()
//   const tip2Ref = useRef()
//   const tip3Ref = useRef()

//   usePreventScrollOnNumberInput(tip1Ref)
//   usePreventScrollOnNumberInput(tip2Ref)
//   usePreventScrollOnNumberInput(tip3Ref)

//   const [tip1Error, setTip1Error] = useState(null)
//   const [tip2Error, setTip2Error] = useState(null)
//   const [tip3Error, setTip3Error] = useState(null)
//   const [mainError, mainErrorSetter] = useState('')
//   const [success, successSetter] = useState('')
//   const onCompleted = data => {
//     const message = t('TippingUpdated')
//     successSetter(message)
//     setTip1Error(null)
//     setTip2Error(null)
//     setTip3Error(null)
//     mainErrorSetter('')
//     clearFields()
//     setTimeout(hideAlert, 3000)
//   }
//   const onError = error => {
//     let message = ''
//     try {
//       message = error.graphQLErrors[0].message
//     } catch (err) {
//       message = t('ActionFailedTryAgain')
//     }
//     successSetter('')
//     mainErrorSetter(message)
//     setTimeout(hideAlert, 3000)
//   }
//   const onSubmitValidaiton = () => {
//     const form = formRef.current
//     const tip1 = form.tip1.value
//     const tip2 = form.tip2.value
//     const tip3 = form.tip3.value

//     const tip1Errors = !validateFunc({ tip: tip1 }, 'tip')
//     const tip2Errors = !validateFunc({ tip: tip2 }, 'tip')
//     const tip3Errors = !validateFunc({ tip: tip3 }, 'tip')

//     setTip1Error(tip1Errors)
//     setTip2Error(tip2Errors)
//     setTip3Error(tip3Errors)

//     if (!(tip1Errors && tip2Errors && tip3Errors)) {
//       mainErrorSetter(t('FieldsRequired'))
//     }
//     return tip1Errors && tip2Errors && tip3Errors
//     // setTimeout(hideAlert, 3000)
//   }
//   const { data } = useQuery(GET_TIPPING, onError, onCompleted)
//   const mutation = data && data.tips._id ? CREATE_TIPPING : CREATE_TIPPING

//   const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })

//   const clearFields = () => {
//     formRef.current.reset()
//   }

//   const hideAlert = () => {
//     mainErrorSetter('')
//     successSetter('')
//   }

//   const classes = useStyles()
//   const globalClasses = useGlobalStyles()

//   return (
//     <Box container className={classes.container}>
//       <Box className={classes.flexRow}>
//         <Box item className={classes.heading}>
//           <Typography variant="h6" className={classes.text}>
//             {props.coupon ? t('EditTipping') : t('AddTipping')}
//           </Typography>
//         </Box>
//       </Box>

//       <Box className={classes.form}>
//         <form ref={formRef}>
//           <Grid container spacing={0}>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Tip1')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="tip1"
//                   id="input-type-tip1"
//                   placeholder={t('PHTip1')}
//                   type="number"
//                   inputProps={{ min: 0 }}
//                   defaultValue={
//                     data && data.tips.tipVariations
//                       ? data.tips.tipVariations[0]
//                       : ''
//                   }
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     tip1Error === false
//                       ? globalClasses.inputError
//                       : tip1Error === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                   inputRef={tip1Ref} // Attach ref to input
//                 />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Tip2')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="tip2"
//                   id="input-type-tip2"
//                   placeholder={t('PHTip2')}
//                   type="number"
//                   inputProps={{ min: 0 }}
//                   defaultValue={
//                     data && data.tips.tipVariations
//                       ? data.tips.tipVariations[1]
//                       : ''
//                   }
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     tip2Error === false
//                       ? globalClasses.inputError
//                       : tip2Error === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                   inputRef={tip2Ref} // Attach ref to input
//                 />
//               </Box>
//             </Grid>
//           </Grid>

//           <Grid container spacing={0}>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <Typography className={classes.labelText}>
//                   {t('Tip3')}
//                 </Typography>
//                 <Input
//                   style={{ marginTop: -1 }}
//                   name="tip3"
//                   id="input-type-tip3"
//                   placeholder={t('PHTip2')}
//                   type="number"
//                   inputProps={{ min: 0 }}
//                   defaultValue={
//                     data && data.tips.tipVariations
//                       ? data.tips.tipVariations[2]
//                       : ''
//                   }
//                   disableUnderline
//                   className={[
//                     globalClasses.input,
//                     tip3Error === false
//                       ? globalClasses.inputError
//                       : tip3Error === true
//                         ? globalClasses.inputSuccess
//                         : ''
//                   ]}
//                   inputRef={tip3Ref} // Attach ref to input
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//           <Box>
//             <Button
//               className={globalClasses.button}
//               disabled={loading}
//               onClick={async e => {
//                 e.preventDefault()
//                 if (onSubmitValidaiton()) {
//                   const form = formRef.current
//                   const tipArray = []
//                   tipArray.push(Number(form.tip1.value))
//                   tipArray.push(Number(form.tip2.value))
//                   tipArray.push(Number(form.tip3.value))
//                   mutate({
//                     variables: {
//                       tippingInput: {
//                         _id: data.tips._id,
//                         tipVariations: tipArray,
//                         enabled: true
//                       }
//                     }
//                   })
//                 }
//               }}>
//               {t('Save')}
//             </Button>
//           </Box>
//         </form>
//         <Box mt={2}>
//           {success && (
//             <Alert
//               className={globalClasses.alertSuccess}
//               variant="filled"
//               severity="success">
//               {success}
//             </Alert>
//           )}
//           {mainError && (
//             <Alert
//               className={globalClasses.alertError}
//               variant="filled"
//               severity="error">
//               {mainError}
//             </Alert>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   )
// }

// export default withTranslation()(Tipping)

import React, { useRef, useState } from 'react';
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
  Switch,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

const Tipping = () => {
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // State for delete confirmation
  const [editTipValue, setEditTipValue] = useState('');
  const [selectedTip, setSelectedTip] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [tips, setTips] = useState([
    { _id: '1', value: 10, enabled: true },
    { _id: '2', value: 20, enabled: false },
    { _id: '3', value: 30, enabled: false }
  ]);

  const handleToggle = (row) => {
    const updatedTips = tips.map((tip) => ({
      ...tip,
      enabled: tip._id === row._id
    }));
    setTips(updatedTips);
  };

  const validateForm = () => {
    const form = formRef.current;
    const newErrors = {};

    const tip1 = Number(form.tip1.value);
    const tip2 = Number(form.tip2.value);
    const tip3 = Number(form.tip3.value);

    if (!tip1 || tip1 < 0) newErrors.tip1 = 'Invalid tip value';
    if (!tip2 || tip2 < 0) newErrors.tip2 = 'Invalid tip value';
    if (!tip3 || tip3 < 0) newErrors.tip3 = 'Invalid tip value';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = formRef.current;
    const tipArray = [
      Number(form.tip1.value),
      Number(form.tip2.value),
      Number(form.tip3.value)
    ];

    const newTips = tipArray.map((value, index) => ({
      _id: `${index + 1}`,
      value,
      enabled: value === Math.max(...tipArray)
    }));

    setTips(newTips);
    setSuccess('Tips added successfully!');
    formRef.current.reset();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = (row) => {
    setSelectedTip(row);
    setEditTipValue(row.value);
    setDialogOpen(true);
  };

  const handleEditSubmit = () => {
    const updatedTips = tips.map((tip) =>
      tip._id === selectedTip._id ? { ...tip, value: editTipValue } : tip
    );

    setTips(updatedTips);
    setDialogOpen(false);
    setSnackbar({ open: true, message: 'Tip updated successfully!', severity: 'success' });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const handleDelete = () => {
    const updatedTips = tips.filter((tip) => tip._id !== selectedTip._id);
    setTips(updatedTips);
    setConfirmDelete(false);
    setSnackbar({ open: true, message: 'Tip deleted successfully!', severity: 'success' });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const columns = [
    {
      name: 'Name',
      selector: row => `Tip ${row._id}`,
      sortable: true
    },
    {
      name: 'Value',
      selector: row => `${row.value}%`,
      sortable: true
    },
    {
      name: 'Enabled',
      cell: row => (
        <Switch
          checked={row.enabled}
          onChange={() => handleToggle(row)}
          color="primary"
        />
      ),
      right: true
    },
    {
      name: 'Actions',
      cell: row => (
        <Box>
          <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
            <EditIcon sx={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => { setSelectedTip(row); setConfirmDelete(true); }} color="error" size="small">
            <DeleteIcon sx={{ color: 'red' }} />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleWheel = (e) => {
    e.target.blur();
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
        <Typography variant="h6" sx={{ bgcolor: '#FF8F00', p: 2, borderRadius: 1, color: 'white', fontWeight: 'bold', mb: 2 }}>
          Add Tipping
        </Typography>
        <form ref={formRef}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography>Tip 1</Typography>
              <TextField
                name="tip1"
                type="number"
                placeholder="e.g 10%"
                fullWidth
                error={!!errors.tip1}
                helperText={errors.tip1}
                InputProps={{
                  style: { color: 'black' }, onWheel: handleWheel
                }}
                InputLabelProps={{
                  style: { color: 'black' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>Tip 2</Typography>
              <TextField
                name="tip2"
                type="number"
                placeholder="e.g 20%"
                fullWidth
                error={!!errors.tip2}
                helperText={errors.tip2}
                InputProps={{
                  style: { color: 'black' }, onWheel: handleWheel
                }}
                InputLabelProps={{
                  style: { color: 'black' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>Tip 3</Typography>
              <TextField
                name="tip3"
                type="number"
                placeholder="e.g 30%"
                fullWidth
                error={!!errors.tip3}
                helperText={errors.tip3}
                InputProps={{
                  style: { color: 'black' }, onWheel: handleWheel
                }}
                InputLabelProps={{
                  style: { color: 'black' },
                }}
              />
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mb: 3 }}>
            Save
          </Button>
        </form>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <DataTable
          title="Tipping"
          columns={columns}
          data={tips}
          pagination
          paginationPerPage={5}
          noDataComponent={<Typography>No tips found</Typography>}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#ffcc00', color: 'black', fontWeight: 'bold' }}>
          Edit Tip
        </DialogTitle>
        <DialogContent sx={{ pt: 2,mt:2 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={editTipValue}
            onChange={(e) => setEditTipValue(e.target.value)}
            placeholder="Enter tip value"
            autoFocus
            InputProps={{
              style: { color: 'black' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ color: 'black', borderColor: 'black' }}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ bgcolor: '#ffcc00', color: 'black', '&:hover': { bgcolor: '#e6b800' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Use the DeleteConfirmationDialog component */}
      <DeleteConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this tip?"
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', color: 'black' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tipping;