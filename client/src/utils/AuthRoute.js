import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


export const AuthRoute = ({
    isAuthenticated,
    isLoading,
    component: Component,
    ...rest
}) => (
    <Route {...rest} component={(props) => {
        if (isLoading === true)
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
        isAuthenticated: state.auth.isAuthenticated,
        isLoading: state.auth.isLoading
    }
}

export default connect(mapStatetoProps)(AuthRoute);