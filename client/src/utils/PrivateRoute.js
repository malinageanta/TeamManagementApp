import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


export const PrivateRoute = ({
    isAuthenticated,
    isLoading,
    component: Component,
    ...rest
}) => (
    <Route {...rest} component={(props) => {
        if (isLoading === true)
            return null;
        else if (isAuthenticated) {
            return (<div>
                <Component {...props} />
            </div>)
        } else {
            return (<Redirect to="/" />)
        }
    }} />
)


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isLoading: state.auth.isLoading
    }
}

export default connect(mapStateToProps)(PrivateRoute);