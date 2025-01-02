// // src/utils/SweetAlert.js
// import Swal from 'sweetalert2';

// // Add custom styles for SweetAlert once
// const style = document.createElement('style');
// style.textContent = `
//   .swal2-popup {
//     border-radius: 16px !important;
//     padding: 1.5rem !important;
//   }
  
//   .swal2-title {
//     color: #333333 !important;
//     font-size: 1.25rem !important;
//   }
  
//   .swal2-html-container {
//     color: #666666 !important;
//     font-size: 0.875rem !important;
//   }
  
//   .swal2-confirm {
//     background-color: #FFB300 !important;
//     border-radius: 8px !important;
//     padding: 0.75rem 1.5rem !important;
//   }
  
//   .animated {
//     animation-duration: 0.5s;
//     animation-fill-mode: both;
//   }
  
//   .fadeInDown {
//     animation-name: fadeInDown;
//   }
  
//   @keyframes fadeInDown {
//     from {
//       opacity: 0;
//       transform: translate3d(0, -20px, 0);
//     }
//     to {
//       opacity: 1;
//       transform: translate3d(0, 0, 0);
//     }
//   }
  
//   .faster {
//     animation-duration: 300ms;
//   }
// `;
// document.head.appendChild(style);

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-end',
//   showConfirmButton: false,
//   timer: 3000,
//   timerProgressBar: true
// });

// export const showSuccessAlert = (title, message = '') => {
//   Toast.fire({
//     icon: 'success',
//     title,
//     text: message,
//     customClass: {
//       popup: 'animated fadeInDown faster',
//       title: 'text-lg font-semibold',
//       htmlContainer: 'text-sm'
//     }
//   });
// };

// export const showErrorAlert = (title, message = '') => {
//   Swal.fire({
//     icon: 'error',
//     title,
//     text: message,
//     showConfirmButton: true,
//     confirmButtonColor: '#FFB300',
//     customClass: {
//       popup: 'animated fadeInDown faster',
//       title: 'text-lg font-semibold',
//       htmlContainer: 'text-sm',
//       confirmButton: 'bg-[#FFB300] text-white px-4 py-2 rounded-lg'
//     }
//   });
// };

// export const showConfirmDialog = async(title, message) => {
//   const result = await Swal.fire({
//     title,
//     text: message,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#FFB300',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, proceed',
//     cancelButtonText: 'Cancel',
//     customClass: {
//       popup: 'animated fadeInDown faster',
//       title: 'text-lg font-semibold',
//       htmlContainer: 'text-sm',
//       confirmButton: 'bg-[#FFB300] text-white px-4 py-2 rounded-lg',
//       cancelButton: 'bg-red-500 text-white px-4 py-2 rounded-lg'
//     }
//   });
//   return result.isConfirmed;
// };

// export const showLoadingAlert = (title = 'Loading...') => {
//   Swal.fire({
//     title,
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     },
//     customClass: {
//       popup: 'animated fadeInDown faster',
//       title: 'text-lg font-semibold'
//     }
//   });
// };

// export const closeAlert = () => {
//   Swal.close();
// };

import Swal from 'sweetalert2';

const style = document.createElement('style');
style.textContent = `
  .swal2-popup {
    border-radius: 16px !important;
    padding: 1.5rem !important;
  }
  
  .swal2-title {
    color: #333333 !important;
    font-size: 1.25rem !important;
  }
  
  .swal2-html-container {
    color: #666666 !important;
    font-size: 0.875rem !important;
  }
  
  .swal2-confirm {
    background-color: #FFB300 !important;
    border-radius: 8px !important;
    padding: 0.75rem 1.5rem !important;
  }
  
  .animated {
    animation-duration: 0.5s;
    animation-fill-mode: both;
  }
  
  .fadeInDown {
    animation-name: fadeInDown;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  .faster {
    animation-duration: 300ms;
  }
  
  .swal2-actions {
    margin-top: 1.5rem !important;
  }
`;
document.head.appendChild(style);

export const showErrorAlert = (title, message = '') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#FFB300',
    allowOutsideClick: true,
    allowEscapeKey: true,
    customClass: {
      popup: 'animated fadeInDown faster',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm',
      confirmButton: 'bg-[#FFB300] text-white px-4 py-2 rounded-lg'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  });
};

// For success messages, use toast
export const showSuccessAlert = (title, message = '') => {
  return Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  }).fire({
    icon: 'success',
    title,
    text: message
  });
};

export const showConfirmDialog = async(title, message) => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FFB300',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    allowOutsideClick: true,
    allowEscapeKey: true,
    customClass: {
      popup: 'animated fadeInDown faster',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm',
      confirmButton: 'bg-[#FFB300] text-white px-4 py-2 rounded-lg',
      cancelButton: 'bg-red-500 text-white px-4 py-2 rounded-lg'
    }
  });
  return result.isConfirmed;
};

export const showLoadingAlert = (title = 'Loading...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'animated fadeInDown faster',
      title: 'text-lg font-semibold'
    }
  });
};

export const closeAlert = () => {
  Swal.close();
};