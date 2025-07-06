import { toast } from 'sonner';
import { getErrorMessage } from './errorHandler';

export const handleApiError = (error: any) => {
  const errorCode = error?.response?.data?.errorCode;
  const message = error?.response?.data?.message;

  const displayMessage = getErrorMessage(errorCode, message);

  toast.error('Error', {
    description: displayMessage,
  });

  // Log error for debugging
  console.error('API Error:', error);
};

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  toast.error('Unexpected Error', {
    description: 'Something went wrong. Please try again.',
  });
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);

  // Don't show toast for network errors or script loading errors
  if (event.error?.name !== 'NetworkError' && !event.filename) {
    toast.error('Application Error', {
      description: 'An unexpected error occurred.',
    });
  }
});
