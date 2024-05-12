import { Route } from "react-router-dom";


const PrivateRoute = ({children, ...rest}) => {
    const authenticated = false
    return (
        <Route {...rest}>{!user ? <Redirect to="/login" /> :   children}</Route>
    )
}

export default PrivateRoute;