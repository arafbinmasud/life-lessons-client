import { use } from "react"
import { AuthContext } from "../contexts/AuthContext"

const useAuth = ()=> {
    const context = use(AuthContext)
    return context
}
export default useAuth;