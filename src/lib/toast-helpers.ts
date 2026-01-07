import { toast } from 'sonner'

/**
 * Shows a "Coming Soon" toast for features not yet implemented
 */
export function showComingSoon(featureName?: string) {
  toast.info(featureName ? `${featureName} coming soon!` : 'Coming soon!', {
    description: 'We\'re working on this feature. Stay tuned!',
    duration: 3000,
  })
}

/**
 * Shows a login required toast with action button
 */
export function showLoginRequired(action: string = 'continue') {
  toast.error(`Please log in to ${action}`, {
    action: {
      label: 'Log in',
      onClick: () => {
        window.location.href = '/login'
      }
    },
    duration: 5000,
  })
}

/**
 * Shows a success toast for actions
 */
export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
  })
}

/**
 * Shows an error toast
 */
export function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 5000,
  })
}
