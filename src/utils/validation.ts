// Form validation utilities

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates required field
 */
export const isRequired = (value: string): boolean => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value && value.length >= min;
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value && value.length <= max;
};

/**
 * Validates date format (YYYY-MM-DD)
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s()-]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates password strength
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};
