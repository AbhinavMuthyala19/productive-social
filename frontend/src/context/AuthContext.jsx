import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api, {
  getUser,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  resendVerifyUser,
  verifyUser,
} from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getUser();
      setUser(res.data);
    } catch (err) {
      try {
        // 🔥 attempt refresh BEFORE deciding user is null
        await api.post("/auth/refresh");

        const res = await getUser();
        setUser(res.data);
      } catch (refreshErr) {
        setUser(null); // only here ❗
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setInitialized(true);
    };
    init();
  }, [fetchUser]);

  const login = async (identifier, password, timezone) => {
    try {
      setAuthLoading(true);
      await loginUser(identifier, password, timezone);
      await fetchUser();
    } finally {
      setAuthLoading(false);
    }
  };

  const googleLoginHandler = async (token) => {
    try {
      setAuthLoading(true);
      const res = await googleLogin(token);
      await fetchUser();
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setAuthLoading(true);
      await registerUser(data);
    } finally {
      setAuthLoading(false);
    }
  };

  const verify = async ({ email, otp }) => {
    try {
      setAuthLoading(true);
      await verifyUser(email, otp);
    } finally {
      setAuthLoading(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      setAuthLoading(true);
      await resendVerifyUser(email);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      googleLogin: googleLoginHandler,
      loading,
      initialized,
      authLoading,
      setAuthLoading,
      login,
      register,
      verify,
      resendOtp,
      logout,
    }),
    [user, loading, authLoading, initialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
