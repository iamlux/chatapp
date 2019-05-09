import React, {Component} from 'react';

class Register extends Component {
  constructor (props) {
    super(props);
    this.state = {form: {username: "", password: ""}, error: {has: false, message: ""}};
  }

  inputChange(e) {
    const form = Object.assign(this.state.form);
    form[e.target.name] = e.target.value;
    this.setState({
      form,
      error: {has: false, message: ""}
    });
  }

  submitForm(e) {
    e.preventDefault();
    fetch("http://localhost:8989/users/register", {
      method: "POST",
      body: JSON.stringify(this.state.form),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
          this.setState({
            error: {has: true, message: response.message}
          });
      } else {
        localStorage.setItem("users", JSON.stringify(response));
        this.props.history.push('/dashboard');
      }
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
            <input type="submit" value="Register"/>
          </div>
          {this.state.error.has && <p className="error">{this.state.error.message}</p>}
        </form>
      </div>
    );
  }
}

export default Register;
