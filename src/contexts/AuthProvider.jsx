// import { useState } from "react";
import { AuthContext } from "./AuthContext"

const AuthProvider = ({children}) => {
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);


    const authInfo = {
        name: 'araf',
        age: 20
    }
    console.log(authInfo);
    
    return <AuthContext value={authInfo}>{children}</AuthContext>
}

export default AuthProvider;