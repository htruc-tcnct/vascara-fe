// utils/auth.js
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
