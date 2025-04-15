import { ref } from "vue";

const tokenKey = "auth_token";
const backendBaseUrl = "http://localhost:8080";

const isAuthenticated = ref(false);
const user = ref(null);

const login = async (username, password) => {
  try {
    const response = await fetch(`${backendBaseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка авторизации");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem(tokenKey, data.token);
      isAuthenticated.value = true;
      user.value = data.user;
      return true;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
  isAuthenticated.value = false;
  user.value = null;
  return false;
};

const logout = () => {
  localStorage.removeItem(tokenKey);
  isAuthenticated.value = false;
  user.value = null;
};

const restoreSession = () => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem(tokenKey);
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export function useUser() {
  return {
    isAuthenticated,
    user,
    login,
    logout,
    restoreSession,
    getAuthHeaders,
  };
}
