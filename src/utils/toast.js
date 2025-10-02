import { toast } from 'react-toastify';

// Toast notification utility functions
export const showToast = {
  // Success notification
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Error notification
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Warning notification
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Info notification
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Loading notification
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options
    });
  },

  // Update existing toast
  update: (toastId, message, type = 'success', options = {}) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 5000,
      ...options
    });
  },

  // Dismiss toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  }
};

// API response handler with toast notifications
export const handleApiResponse = (response, successMessage = null, errorMessage = null) => {
  if (response && response.success) {
    if (successMessage) {
      showToast.success(successMessage);
    }
    return response;
  } else {
    const message = errorMessage || response?.message || 'An error occurred';
    showToast.error(message);
    throw new Error(message);
  }
};

// API error handler
export const handleApiError = (error, customMessage = null) => {
  let message = customMessage;
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        message = data?.message || 'Bad request. Please check your input.';
        break;
      case 401:
        message = 'You are not authorized. Please login again.';
        break;
      case 403:
        message = 'Access denied. You don\'t have permission to perform this action.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 422:
        message = data?.message || 'Validation error. Please check your input.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = data?.message || 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Network error
    message = 'Network error. Please check your connection.';
  } else {
    // Other errors
    message = error.message || 'An unexpected error occurred.';
  }
  
  showToast.error(message);
  return message;
};

export default showToast;
