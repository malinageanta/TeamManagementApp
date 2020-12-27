import React, { Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {users: []};
  }

  callApi()
  {
    fetch("/users")
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  componentDidMount() {
    this.callApi();
  }

  render()
  {
    return (
      <div className="App">
        <h1> Users </h1>
        <ul>
          {this.state.users.map(user => 
            <li>{user.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
