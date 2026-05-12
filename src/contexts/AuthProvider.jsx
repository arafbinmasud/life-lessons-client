// import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext"

const AuthProvider = ({children}) => {
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider;

    const registerUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (updateInfo) => {
        return updateProfile(auth.currentUser, updateInfo) ;
    }

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }


    const authInfo = {
        registerUser,
        updateUser,
        googleSignIn,
        loginUser,
    }
    
    
    return <AuthContext value={authInfo}>{children}</AuthContext>
}

export default AuthProvider;