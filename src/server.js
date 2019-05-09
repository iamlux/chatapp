const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var jwt = require('jsonwebtoken');
var cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/chatapp');
const db = mongoose.connection;
const Schema = mongoose.Schema;
const port = 8989;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("connection successful");
});
const userSchema = new Schema({
  username:  String,
  password: String
});
var User = mongoose.model('User', userSchema);

app.post('/users/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username: username, password: password});
    const registerUser = User.find({username: username}, (err, data) => {
      if (data.length > 0) {
        return res.json({error: false, message: "User already been registered"});
      } else {
        newUser.save(function (err, data) {
          const allUsers = User.where("username").ne(username);
          if (err) return res.json({error: true, message: "There was an error while storing user"});
          allUsers.exec(function (err, users) {
            const token = jwt.sign({ username: username }, 'shhhhh');
            return res.json({error: false, message: "User Registered successully", token: token, users: allUsers, myDetails: data[0]});
          });
        });
      }
    });
});
app.post('/users/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username: username, password: password});
    const registerUser = User.find({username: username, password: password}, (err, data) => {
      if (data.length > 0) {
        const allUsers = User.where("username").ne(username);
        allUsers.exec(function (err, users) {
          const token = jwt.sign({ username: username }, 'shhhhh');
          return res.json({error: false, message: "User login successfully", token: token, users: users, myDetails: data[0]});
        });
      } else {
        return res.json({error: true, message: "Please check the username and password"});
      }
    });
});


server.listen(port, () => {
  console.log('Running server on 127.0.0.1:' + port);
});

io.on('connection', function (socket) {
  socket.emit('welcome', "Welcome to the chat application");
  socket.on('message', function (data) {
    console.log(data);
    socket.emit("messages", data);
  });
});
