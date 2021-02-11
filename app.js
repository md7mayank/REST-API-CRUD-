require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set(express.static("public"));
// connection to server
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// creating schema for users table
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User =  mongoose.model("User", userSchema);

//////////////////////////////HOME ROUTE //////////////////////
app.get("/",function(req,res){
  res.render("home");
})
////////////////READ ROUTE/////////////////////////////////////
////////////////route to see all the users/////////////////////
app.get("/api/people", function (req, res) {
  User.find(function (err, foundusers) {
    if (!err) {
      res.send(foundusers);
    }
    else {
      res.send(err)
    }
  })
});
////////////////CREATE ROUTE/////////////////////////////////////
////////////////route to create new user/////////////////////
app.post("/api/people", function (req, res) {
  const newuser = new User({
    name: req.body.name,
    email: req.body.email
  });
  newuser.save(function (err,newuser) {
    if (!err) {
      res.send(` ${newuser} is successfully created `);
    }
    else {
      res.send(err);
    }
  });
});
//////////////READ ROUTE(SPECIFIC USER)/////////////////////////////////////
////////////////read the specific user /////////////////////////////////////
app.get("/api/people/:username", function (req, res) {
  User.findOne({ name: req.params.username }, function (err, founduser) {
    if (!err) {
      res.render("show",{name:founduser.name,email:founduser.email});
    }
    else {
      res.send(err);
    }
  });
});
//////////////UPDATE ROUTE(SPECIFIC USER)/////////////////////////////////////
////////////////update the specific user with new values /////////////////////
app.patch("/api/people/:username",function (req, res) {
  User.findOne({name:req.params.username},function(err,founduser){
    if(!err)
    {
    User.updateOne({ name: req.params.username },
      { $set: req.body }, function (err) {
        if (!err) {
         res.send(`${founduser} is successfully updated with the new values`);
         console.log(`${founduser} is updated  successfully`);
        }
        else {
         res.send(err);
        }
      });
  }})
  //////////////DELETE ROUTE(SPECIFIC USER)/////////////////////////////////////
////////////////Delete the specific user //////////////////////////////////////
 
});
app.delete("/api/people/:username", function (req, res) {
  User.findOne({name:req.params.username},function(err,founduser){
    if(!err)
    User.deleteOne({ name: req.params.username }, function (err) {
      if (!err) {
       res.send(`${founduser} is deleted successfully`);
       console.log(`${founduser} is deleted successfully`);
      }
      else {
        res.send(err);
      }
    });
  })
});

////////////////////////////PORT at which server is active///////////////////
const PORT=process.env.PORT || 3000 ;
app.listen(PORT,function(){
  console.log(`server started successfully at ${PORT}`);
});


