import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const users = JSON.parse(localStorage.getItem('users'));
    this.state = {users: users.users, currentUser: "", openChat: false, chatText: "", myUser: users.myDetails, chats: []};
    this.socket = socketIOClient('ws://localhost:8989');
    this.socket.on("messages", (message) => {
        console.log(message);
    });
  }

  chatWithFriend(username) {
    this.setState({
      openChat: true,
      currentUser: username
    });
  }

  componentDidUpdate() {
        // console.log(this.state.myUser.username);
  }

  inputChange(e) {
    this.setState({
      chatText: e.target.value,
    });
  }

  submitChat(e) {
    e.preventDefault();
    const messages = {
      message: this.state.chatText,
      user: this.state.currentUser
    };
    console.log("submitted");
    this.socket.emit("message", messages);
  }

  render() {
    return(<div className="main_chat">
        <div className="friends">
        {this.state.users.map((friend, index) => (
          <p key={index} onClick={ () => this.chatWithFriend(friend.username)}>{friend.username}</p>
        ))}
        </div>
        <div className="messages">
          {this.state.openChat && <div>
            <div className="chatlist">
              {this.state.chats.map((chat, index) => (
                <p key={index}>{chat}</p>
              ))}
            </div>
            <div className="chatbox">
              <form onSubmit={ (e) => this.submitChat(e) }>
                <input type="text" value={this.state.chatText} name="chat" placeholder="Enter your message" onChange={ (e) => this.inputChange(e) }/>
                <input type="submit" value="Submit"/>
              </form>
            </div>
          </div>}
        </div>
      </div>);
  }
}
export default Dashboard;
