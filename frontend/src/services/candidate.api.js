// frontend/src/services/candidate.api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// export const registerCandidate = async (formData) => {
  
//   const { resume, ...primaryWithoutFile } = formData.primary;

//   const res = await fetch(`${BASE_URL}/candidates/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//     primary: primaryWithoutFile,
//     personal: formData.personal,
//     education: formData.education,
//   }),
//   });
//   if (!res.ok) {
//     let errMsg = "Registration failed";
//     try {
//       const err = await res.json();
//       errMsg = err.message || errMsg;
//     } catch {}
//     throw new Error(errMsg);
//   }

//   return res.json();
// };

export const registerCandidate = async (formData) => {

  // ✅ REMOVE FILE HERE (VERY IMPORTANT)
  const primaryWithoutFile = {
    fullName: formData.primary.fullName,
    phone: formData.primary.phone,
    email: formData.primary.email,
    };

  console.log("SENDING TO BACKEND:", primaryWithoutFile); // debug

  const res = await fetch(`${BASE_URL}/candidates/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      primary: primaryWithoutFile,
      personal: formData.personal,
      education: formData.education,
    }),
  });

  if (!res.ok) {
    let errMsg = "Registration failed";
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
};

// Called after test is submitted — saves score to RESULT table
export const saveResult = async ({ candidateId, applicationNo, result, timeTakenSecs }) => {
  const res = await fetch(`${BASE_URL}/candidates/save-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId, applicationNo, result, timeTakenSecs }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to save result");
  }
  return res.json();
};
