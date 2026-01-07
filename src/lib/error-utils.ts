/**
 * Error handling utilities
 */

export interface ApiError {
  error: string
  message?: string
  status?: number
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      error: error.message,
      message: error.message,
    }
  }
  
  if (typeof error === 'object' && error !== null && 'error' in error) {
    return error as ApiError
  }
  
  return {
    error: 'An unexpected error occurred',
    message: 'Please try again later',
  }
}

export function getErrorMessage(error: unknown, defaultMessage = 'Something went wrong'): string {
  const apiError = parseApiError(error)
  return apiError.message || apiError.error || defaultMessage
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || error.message.includes('network')
  }
  return false
}

export function shouldRetry(error: unknown): boolean {
  if (error instanceof Error) {
    // Retry on network errors or 5xx server errors
    return isNetworkError(error) || error.message.includes('500') || error.message.includes('503')
  }
  return false
}
