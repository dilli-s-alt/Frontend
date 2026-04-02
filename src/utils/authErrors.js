export function getAuthErrorMessage(error, fallbackMessage) {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) {
    return serverMessage;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the API. Check your internet connection or backend URL, then try again.";
  }

  if (error?.response?.status === 404) {
    return "Auth API route was not found. Check that the frontend is pointing to the correct backend URL.";
  }

  if (error?.response?.status === 500) {
    return "The backend returned a server error. Check the backend terminal for details.";
  }

  if (String(error?.message || "").toLowerCase().includes("cors")) {
    return "Login was blocked by CORS. Restart the backend with the updated local origin settings.";
  }

  return fallbackMessage;
}
