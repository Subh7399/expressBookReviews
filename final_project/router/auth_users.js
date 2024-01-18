const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Get the username from the session
    const username = req.session.username;
  
    // Check if the user has already submitted a review for the same ISBN
    if (books[isbn].reviews[username]) {
      // If yes, modify the existing review
      books[isbn].reviews[username] = review;
      res.json({ message: 'Review updated successfully', book_review: books[isbn].reviews[username] });
    } else {
      // If no, add a new review
      books[isbn].reviews[username] = review;
      res.json({ message: 'Review posted successfully', book_review: books[isbn].reviews[username] });
    }
});

// Route to delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Get the username from the session
    const username = req.session.username;
  
    // Check if the user has a review for the given ISBN
    if (books[isbn].reviews[username]) {
      // If yes, delete the review
      delete books[isbn].reviews[username];
      res.json({ message: 'Review deleted successfully' });
    } else {
      // If no, return a message indicating that the user doesn't have a review for the book
      res.status(404).json({ message: 'Review not found for the specified user and ISBN' });
    }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
