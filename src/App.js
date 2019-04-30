import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    }
    this.socket = socketIOClient('ws://localhost:8989');
  }

  componentDidMount() {
    this.socket.on('welcome', function(welcome) {
      console.log(welcome);
    });
    this.socket.on("message_received", function(message) {
      console.log(message);
    })
  }

  sendMessage(e) {
    this.setState({
      message: e.target.value
    });
    this.socket.emit('message', e.target.value);
  }

  render() {
    return (
      <Router>
        <div className="app">
          Chat App
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    );
  }
}

export default App;
