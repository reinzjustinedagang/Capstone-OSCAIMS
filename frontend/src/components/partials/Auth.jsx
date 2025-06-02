import axios from "axios";

const backendUrl = import.meta.env.VITE_API_BASE_URL;

export const checkAuth = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/session`, {
      withCredentials: true,
    });

    const user = res.data.user;

    return {
      isAuthenticated: !!user,
      role: user?.role || null,
    };
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Expected: user is not authenticated, no console error
      return { isAuthenticated: false, role: null };
    }

    // Unexpected error, log it
    console.error("Error checking auth:", err);
    return { isAuthenticated: false, role: null };
  }
};
