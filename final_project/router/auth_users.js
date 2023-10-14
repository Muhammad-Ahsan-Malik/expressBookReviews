const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let usersWithName_username = users.filter(user => {
        return user.username === username;
    });
    if(usersWithName_username.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter(user => {
        return (user.username === username && user.password === password);
    });
    if(validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(404).send({message: "Error logging In!"});
    }

    if(authenticatedUser(username,password)){
        let access_token = jwt.sign({
            data: password
        },"access",{expiresIn: 60 * 60});

        req.session.authorization = {
            access_token, username
        };
        res.status(200).send({message: "User logged In successfuly"})
    } else {
        res.status(208).send({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    
    if(review){
        let username = req.session.authorization["username"];
        books[isbn].reviews[username] = review;
        res.send({message: "Review submitted successfuly."})
    } else {
        res.status(403).send({message: "Plese provide review in query parameter!"});
    }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization["username"];
    delete books[isbn].reviews[username];
    res.send({message: "Review deleted with username: " + username});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
