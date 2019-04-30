import React, {Component} from 'react';
import {Redirect} from  'react-router-dom';

class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {form: {username: "", password: ""}, error: ""};
  }

  inputChange(e) {
    const form = Object.assign(this.state.form);
    form[e.target.name] = e.target.value;
    this.setState({
      form
    });
  }

  submitForm(e) {
    e.preventDefault();
    fetch("http://localhost:8989/users/login", {
      method: "POST",
      body: JSON.stringify(this.state.form),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });
  }

  render() {
    return (
      <div className="login">
        <form onSubmit={ (e) => this.submitForm(e) }>
          <div className="formgroup">
            <input type="text" value={this.state.form.username} name="username" placeholder="Username" onChange={ (e) => this.inputChange(e) }/>
          </div>
          <div className="formgroup">
            <input type="text" value={this.state.form.password} name="password" placeholder="Password" onChange={ (e) => this.inputChange(e) }/>
          </div>
          <div className="formgroup">
            <input type="submit" value="Login"/>
          </div>
          {this.state.error.length > 0 && <p>{this.state.error}</p>}
        </form>
      </div>
    );
  }
}

export default Login;
