// Centralized error handling for authentication flows
// This provides user-friendly error messages for common auth scenarios

export const AUTH_ERRORS = {
  // Email provider errors
  EMAIL_SEND_FAILED: "Failed to send verification email. Please try again.",
  EMAIL_INVALID: "Please enter a valid email address.",
  EMAIL_NOT_VERIFIED:
    "Please check your email and click the verification link.",

  // Google provider errors
  GOOGLE_AUTH_FAILED: "Google authentication failed. Please try again.",
  GOOGLE_ACCOUNT_NOT_VERIFIED: "Your Google account email is not verified.",

  // General authentication errors
  SIGNIN_FAILED: "Sign in failed. Please check your credentials and try again.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "You are not authorized to access this resource.",

  // Network and server errors
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",

  // Validation errors
  INVALID_TOKEN: "Invalid or expired verification token.",
  MISSING_CREDENTIALS: "Missing required authentication credentials.",
} as const;

// Function to get user-friendly error message from NextAuth error
export function getAuthErrorMessage(error: string | null): string {
  if (!error) return AUTH_ERRORS.SIGNIN_FAILED;

  switch (error.toLowerCase()) {
    case "configuration":
      return AUTH_ERRORS.SERVER_ERROR;
    case "accessdenied":
      return AUTH_ERRORS.UNAUTHORIZED;
    case "verification":
      return AUTH_ERRORS.EMAIL_NOT_VERIFIED;
    case "default":
      return AUTH_ERRORS.SIGNIN_FAILED;
    case "email":
      return AUTH_ERRORS.EMAIL_SEND_FAILED;
    case "oauthsignin":
    case "oauthcallback":
    case "oauthcreateaccount":
    case "emailcreateaccount":
      return AUTH_ERRORS.GOOGLE_AUTH_FAILED;
    case "callback":
      return AUTH_ERRORS.INVALID_TOKEN;
    case "oauthaccountnotlinked":
      return "This email is already associated with another account. Please use a different sign-in method.";
    case "emailsignin":
      return AUTH_ERRORS.EMAIL_SEND_FAILED;
    case "credentialssignin":
      return AUTH_ERRORS.SIGNIN_FAILED;
    case "sessionrequired":
      return AUTH_ERRORS.SESSION_EXPIRED;
    default:
      return AUTH_ERRORS.SIGNIN_FAILED;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logAuthError(error: string, context?: any) {
  console.error("🔐 Authentication Error:", {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}
