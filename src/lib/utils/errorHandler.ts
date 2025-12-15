/**
 * Parses backend error response and returns a user-friendly error message
 * @param error - Axios error object
 * @param defaultMessage - Default message if parsing fails
 * @returns User-friendly error message
 */
export function parseBackendError(error: any, defaultMessage: string = 'An error occurred'): string {
  // Check if we have a backend error response
  if (error.response?.data?.error) {
    const backendError = error.response.data.error;
    
    // Prefer details for validation errors (more specific)
    if (backendError.details && typeof backendError.details === 'string') {
      // Parse validation error to be more user-friendly
      const validationMatch = backendError.details.match(/Error:Field validation for '(\w+)' failed on the '(\w+)' tag/);
      if (validationMatch) {
        const [, field, rule] = validationMatch;
        const fieldName = field.replace(/([A-Z])/g, ' $1').trim(); // Convert camelCase to readable
        
        if (rule === 'required') {
          return `${fieldName} is required`;
        } else if (rule === 'min') {
          return `${fieldName} is too short (minimum length not met)`;
        } else if (rule === 'max') {
          return `${fieldName} is too long (maximum length exceeded)`;
        } else if (rule === 'oneof') {
          return `${fieldName} has an invalid value`;
        } else if (rule === 'uuid') {
          return `${fieldName} must be a valid ID`;
        } else {
          return `${fieldName}: ${rule} validation failed`;
        }
      } else {
        // Return details as-is if not a validation error
        return backendError.details;
      }
    } else if (backendError.message) {
      return backendError.message;
    }
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Return default message if nothing else works
  return defaultMessage;
}

/**
 * Handles API errors consistently across the application
 * @param error - Error object
 * @param context - Context of the error (e.g., 'save lesson', 'delete chapter')
 */
export function handleApiError(error: any, context: string): void {
  console.error(`Failed to ${context}:`, error);
}

