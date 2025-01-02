import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: '#fff',
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: '#333', fontSize: '16px' }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: '#757575', fontWeight: 'bold' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} style={{ color: '#d32f2f', fontWeight: 'bold' }} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;