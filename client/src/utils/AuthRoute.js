import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


export const AuthRoute = ({
    isAuthenticated,
    userIsLoading,
    component: Component,
    ...rest
}) => (
    <Route {...rest} component={(props) => {
        if (userIsLoading === true)
            return null;
        else if (isAuthenticated === true) {
            return (<Redirect to="/dashboard" />)
        } else {
            return (
                <div>
                    <Component {...props} />
                </div>)
        }
    }} />
)


const mapStatetoProps = (state) => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        userIsLoading: state.user.userIsLoading
    }
}

export default connect(mapStatetoProps)(AuthRoute);