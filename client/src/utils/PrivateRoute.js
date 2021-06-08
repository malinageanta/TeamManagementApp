import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
    isAuthenticated,
    userIsLoading,
    component: Component,
    user,
    ...rest
}) => (
    <Route {...rest} component={(props) => {
        if (userIsLoading === true)
            return null;
        else if (isAuthenticated) {
            if (user?.team === null || user?.team === "") {
                return (<Redirect to="/addTeam" />)
            }
            return (
                <div>
                    <Component {...props} />
                </div>)
        } else {
            return (<Redirect to="/" />)
        }
    }} />
)


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        userIsLoading: state.user.userIsLoading,
        user: state.user?.user

    }
}

export default connect(mapStateToProps)(PrivateRoute);