import React, { Component } from 'react';
import { connect } from 'react-redux';
import SideBar from '../SideBar';


class Members extends Component {
    render() {
        return (
            <div>
                <SideBar>
                    <h1>test</h1>
                </SideBar>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(mapStateToProps)(Members);
