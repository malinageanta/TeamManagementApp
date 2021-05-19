import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import background from '../../images/teamInfoBg.png';

class AddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenForm: ""
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.setState({
            chosenForm: [e.target.name].toString()
        });
    }

    render() {
        const chosenForm = this.state.chosenForm;
        let showChosenForm = null;
        if (chosenForm === "create") {
            showChosenForm = <Redirect to="/createTeam" />;
        }
        else if (chosenForm === "join") {
            showChosenForm = <Redirect to="/joinTeam" />;
        }

        return (
            !showChosenForm ?
                <div style={{ backgroundImage: `url(${background})` }}>
                    <div className="container" style={{ height: '100vh', width: '100vh' }}>
                        <div className="row h-100">
                            <div id="col" className="col-md-12 my-auto">
                                <Card className="text-center" style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }}>
                                    <Card.Header style={{ backgroundColor: 'transparent', border: 'none' }}>
                                        <Card.Title style={{ fontWeight: 'lighter', fontSize: '39px' }}> You are not part of any team! </Card.Title>
                                        <Button variant="outline-primary" onClick={this.handleClick} name="create">Create a new team</Button>
                                    </Card.Header>
                                    <label style={{ fontWeight: 'lighter', fontSize: '36px' }}> or </label>
                                    <Card.Footer style={{ backgroundColor: 'transparent', border: 'none' }} >
                                        <Button variant="outline-primary" onClick={this.handleClick} name="join">Join a team</Button>
                                    </Card.Footer>
                                </Card>
                            </div>
                        </div >
                    </div>
                </div>
                : <div>{showChosenForm}</div>
        )
    }
}


export default AddTeam;
