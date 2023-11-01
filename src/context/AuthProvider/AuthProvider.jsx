import { createContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import auth from "../../firebase/firebase.config";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // signWithGoogle
  const signWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // signUp
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(email, password);
  };

  // signIn
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(email, password);
  };

  // logout
  const logOut = () => {
    return signOut();
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      setLoading(false);
    });

    if (user) {
      setLoading(false);
    }

    return () => {
      unSubscribe();
    };
  }, [user]);

  const authInfo = { loading, user, logOut, signIn, signUp, signWithGoogle };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
