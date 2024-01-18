const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const {username,password} = req.body
  
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/books', async function (req, res) {
    try {
      const response = await axios.get("https://subhamacharj-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
      const BOOKS = await response.data;
  
      return res.status(200).json({ BOOKS });
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  public_users.get('/isbn', async function (req, res) {
    try {
      const response1 = await axios.get("https://subhamacharj-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/:isbn");
      const ISBN = await response1.data;
  
      return res.status(200).json({ ISBN });
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  public_users.get('/title', async function (req, res) {
    try {
      const response2 = await axios.get("https://subhamacharj-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//title/:title");
      const TITLE = await response2.data;
  
      return res.status(200).json({ TITLE });
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.status(300).json({book_detail: books[isbn]});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  const BOOKS = []
  for (const key in books) {
    if (books[key].author == author) {
        BOOKS.push(books[key])
    }
  }
  return res.status(300).json({book_detail: BOOKS});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const author = req.params.title
  const BOOKS = []
  for (const key in books) {
    if (books[key].title == author) {
        BOOKS.push(books[key])
    }
  }
  return res.status(300).json({book_detail: BOOKS});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const author = req.params.isbn
  return res.status(300).json({book_review: books[author].reviews});});

module.exports.general = public_users;
