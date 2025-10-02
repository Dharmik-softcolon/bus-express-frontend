// Utility functions for formatting form inputs

/**
 * Format Aadhaar card number to XXXX-XXXX-XXXX format
 * @param {string} value - The input value
 * @returns {string} - Formatted Aadhaar card number
 */
export const formatAadhaarCard = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Limit to 12 digits
  const limitedValue = numericValue.slice(0, 12);
  
  // Add dashes at appropriate positions
  if (limitedValue.length <= 4) {
    return limitedValue;
  } else if (limitedValue.length <= 8) {
    return `${limitedValue.slice(0, 4)}-${limitedValue.slice(4)}`;
  } else {
    return `${limitedValue.slice(0, 4)}-${limitedValue.slice(4, 8)}-${limitedValue.slice(8)}`;
  }
};

/**
 * Validate Aadhaar card format
 * @param {string} value - The Aadhaar card value
 * @returns {boolean} - Whether the format is valid
 */
export const validateAadhaarCard = (value) => {
  const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
  return aadhaarRegex.test(value);
};

/**
 * Format phone number to Indian format
 * @param {string} value - The input value
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limitedValue = numericValue.slice(0, 10);
  
  // Add formatting if needed
  if (limitedValue.length <= 5) {
    return limitedValue;
  } else if (limitedValue.length <= 10) {
    return `${limitedValue.slice(0, 5)} ${limitedValue.slice(5)}`;
  }
  
  return limitedValue;
};
