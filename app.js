//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser=require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.URI)
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const user = new mongoose.model('user',userSchema)

app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.route("/register")
  .get(function(req,res){
    res.render("register");
  })
  .post(function(req,res){
    user.findOne({email:req.body.username}).then(function(data){
      if(!data){
        const newUser = new user({
          email:req.body.username,
          password:req.body.password
        })
        newUser.save().then(res.render("secrets"));
      }else{console.log('Already a user').then(res.render("secrets"))}
    })
  });

app.route("/login")
  .get(function(req,res){
    res.render("login")
  })
  .post(function(req,res){
    user.findOne({email:req.body.username}).then(function(data){
      if(!data){console.log('not a user')}
      else{
        if(data.password === req.body.password){
          res.render("secrets");
        }else{console.log('incorrect password')}
      }
    })
  });





app.listen(3000,function(){
  console.log("server started at 3000");
})
