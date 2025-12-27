const BASE_URL = "http://localhost:5000/api";

// ================= INDIVIDUAL =================
export const sendDocumentRequest = async (payload, token) => {
  const res = await fetch(`${BASE_URL}/requestdoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};

export const getMyRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/myrequests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

// ================= VERIFIER =================
export const getVerificationRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/verification-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};

export const verifyDocument = async (requestId, token) => {
  const res = await fetch(`${BASE_URL}/verifydoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  if (!res.ok) throw new Error("Verification failed");
  return res.json();
};

// ================= ISSUER =================
export const getIssuerRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/allrequests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to load issuer requests");
  return res.json();
};

export const issueCertificate = async (requestId, token) => {
  const res = await fetch(`${BASE_URL}/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  if (!res.ok) throw new Error("Issue failed");
  return res.json();
};
