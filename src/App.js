import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      daya: []
    }
    this.socket = socketIOClient('ws://localhost:8989');
  }

  componentDidMount() {
    this.socket.on('welcome', (welcome) => {
      const {daya} = this.state;
      daya.push(welcome);
      this.setState({
        daya
      })
    });
    this.socket.on("message_received", function(message) {
      console.log(message);
    });
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
          {this.state.daya.map((chat, index) => (
            <p key={index}>{chat}</p>
          ))}
        </div>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
      </Router>
    );
  }
}

export default App;
