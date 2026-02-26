import api from "../utils/axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  login: (data) => api.post("/auth/login", data),
  resendOtp: (email) => api.post("/auth/resend-otp", { email }),

  getMe: () => api.get("/users/profile"),
  
  updateProfile: (data) => api.put("/users/profile", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};