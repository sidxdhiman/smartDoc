// src/services/api.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const verifyDocument = async (requestId) => {
  try {
    const response = await fetch(`${BASE_URL}/verifydoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying document:', error);
    throw error;
  }
};

export const getVerificationRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getVerificationReq`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch verification requests');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    throw error;
  }
};