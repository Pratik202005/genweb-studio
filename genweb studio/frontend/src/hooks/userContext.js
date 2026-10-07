import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { auth, googleProvider, signInWithPopup, signOut } from "../firebase";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("genweb_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("genweb_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("genweb_user");
    }
  }, [user]);

  // Check existing session on load
  useEffect(() => {
    if (user) return;
    let cancel;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}auth/login/success`, {
          withCredentials: true,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        // User not logged in, ignore
      }
    };
    fetchUser();
    return () => cancel && cancel();
  }, [user]);

  // Standard Google login via Firebase popup
  const loginWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const res = await axios.post(
        `${BACKEND_URL}auth/firebase-login`,
        {
          name: fbUser.displayName || fbUser.email.split("@")[0],
          email: fbUser.email,
          imageURL: fbUser.photoURL,
        },
        { withCredentials: true }
      );

      if (res.data?.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Sign In Failed',
        text: error.message || 'Unable to sign in with Google.',
        background: '#1e293b',
        color: '#fff',
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout from Firebase & destroy backend session
  const logoutUser = async () => {
    try {
      try { await signOut(auth); } catch (e) {}
      await axios.get(`${BACKEND_URL}auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginWithGoogle, logoutUser, authLoading }}>
      {children}
    </UserContext.Provider>
  );
};
