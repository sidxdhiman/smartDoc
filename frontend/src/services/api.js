// --- 1. API Configuration ---

/**
 * Base URL for the backend API.
 * Hardcoded as requested.
 */
const BASE_URL = "http://localhost:5000/api";

if (!BASE_URL) {
  console.error("FATAL: BASE_URL is not set. API calls will fail.");
}

// --- 2. API Functions ---

/**
 * Sends a request ID to the backend to verify a document.
 * @param {string} requestId - The ID of the document/request to verify.
 */
export const verifyDocument = async (requestId) => {
  try {
    const response = await fetch(`${BASE_URL}/verifydoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying document:", error);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Fetches all current verification requests from the backend.
 */
export const getVerificationRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getVerificationReq`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch verification requests");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
