const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        if(isValid(username)){
            users.push({"username": username, "password": password});
            res.send({message: username + " registered successfuly."})
        } else {
            res.status(404).send({message: "Username already exist!."});
        }
    } else {
        res.status(404).send({message: "Unable to register user"});
    }
});

function getBooksList(){
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooksList().then(
        (booksList) => res.send(JSON.stringify(booksList))
    );
});

function getBookFromISBN(isbn){
    let book = books[isbn];
    return new Promise((resolve,reject) => {
        if(book){
            resolve(book);
        } else {
            reject("Unable to find book");
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getBookFromISBN(isbn).then(
        (book) => res.send(JSON.stringify(book)),
        (error) => res.status(403).send({message: error})
    );
 });
  
function getBookFromAuthor(author){
    let required_book;
    Object.keys(books).forEach(key => {
        if(books[key].author === author){
            required_book = books[key];
            return;
        }
    });
    return new Promise((resolve,reject) => {
        if(required_book){
            resolve(required_book);
        } else {
            reject("Unable to find book");
        }
    });
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    getBookFromAuthor(author).then(
        (book) => res.send(JSON.stringify(book)),
        (error) => res.status(403).send({message: error})
    );
});

function getBookFromTitle(title){
    let required_book;
    Object.keys(books).forEach(key => {
        if(books[key].title === title){
            required_book = books[key];
            return;
        }
    });
    return new Promise((resolve,reject) => {
        if(required_book){
            resolve(required_book);
        } else {
            reject("Unable to find book");
        }
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    getBookFromTitle(title).then(
        (book) => res.send(JSON.stringify(book)),
        (error) => res.status(403).send({message: error})
    );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(isbn) {
        res.send(JSON.stringify(books[isbn].reviews));
    } else {
        res.status(403).send({message: "Please provide ISBN number"}); 
    }
});

module.exports.general = public_users;
