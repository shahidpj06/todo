import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Login from './Auth/Login'

export const Header = () => {
    let {user, logoutUser} = useContext(Login)
    return (
        <div>
            <Link to="/home" >Home</Link>
            <span> | </span>
            {user ? (
                 <p  onClick={logoutUser}>Logout</p>
            ): (
                <Link to="/" >Login</Link>
            )}
           
            {user &&   <p>Hello {user.username}</p>}
           
        </div>
    )
}

export default Header
