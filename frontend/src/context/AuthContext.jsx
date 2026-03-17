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
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    console.log("FETCH USER START");

    try {
      const res = await getUser();
      console.log("USER:", res.data);
      setUser(res.data);
    } catch (err) {
      console.log("ERROR:", err);
      setUser(null);
    } finally {
      console.log("SETTING LOADING FALSE");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
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
    const res = await googleLogin(token);
    await fetchUser();
    return res;
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
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      googleLogin: googleLoginHandler,
      loading,
      authLoading,
      setAuthLoading,
      login,
      register,
      verify,
      resendOtp,
      logout,
    }),
    [user, loading, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
