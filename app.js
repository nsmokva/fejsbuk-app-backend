const express = require('express')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
var jsonParser = bodyParser.json()

const port = 4000

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nsmokva:nsmokva12@cluster0-wgok7.mongodb.net/fejsbuk-app?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const User = mongoose.model('User', { 
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    city: String,
    email2: String,
    education: String, 
    job: String,
    introduction: String,
});

const Status = mongoose.model('Status', {
    status: String,
    ownerId: String,
    ownerFirstName: String,
    ownerLastName: String,
    date: Object,
    likes: Array
})

//const firstUser = new User({ email: 'marko', password: '1234', firstName:"Marko", lastName:"Smokrovic"});
//firstUser.save().then(() => console.log('Nikolina in db'));
//const secondUser = new User({ email: 'lola', password: '1234', firstName:"Lola", lastName:"Topolnak"});
//secondUser.save().then(() => console.log('Jasna in db'));
//const thirdUser = new User({ email: 'samantha', password: '1234', firstName:"Samantha", lastName:"Topolnjak"});
//thirdUser.save().then(() => console.log('Nikolina in db'));
//const fourthUser = new User({ email: 'petar', password: '1234', firstName:"Petar", lastName:"Pan"});
//fourthUser.save().then(() => console.log('Jasna in db'));
//const fifthUser = new User({ email: 'gita', password: '1234', firstName:"Gita", lastName:"Hlapic"});
//fifthUser.save().then(() => console.log('Jasna in db'));

// routes
// 1. get user based on email and password
app.get('/backend/login', (req, res) => {
    var user = User.findOne({email: req.query.email})
    .then(function(result){
        //if there is no user with given username in db, status code 404
        if (result===null){
            console.log('status code 404')
            res.status(404).send('status code 404')
        //if there is user with given username in db but given password is not matching password from db, status code 401 (unauthorized)
        }else if (result.password !== req.query.password){
            console.log("status code 401")
            res.status(401).send("status code 401")     
        //if there is given user in db and given password matches password fom db, status code 200               
        }else{
            console.log('status code 200')
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log(err);
    })
})
// 2. get user based on user id
app.get('/backend/user', (req, res) => {
    var user = User.findOne({_id: req.query.id})
    .then(function(result){
        //if there is no user with given username in db, status code 404
        if (result===null){
            console.log('status code 404')
            res.status(404).send('status code 404')    
        //if there is given user in db and given password matches password fom db, status code 200               
        }else{
            console.log('status code 200')
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log(err);
    })
})

// 3. get all users
app.get('/backend/users', (req, res) => {
    var users = User.find()
    .then(function(result){
        //if there are no users in db, status code 404
        if (result===null){
            console.log('status code 404')
            res.status(404).send('status code 404')    
        //if there are users in db, status code 200               
        }else{
            console.log('status code 200')
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log(err);
    })
})

//update user data in db
app.post('/backend/user/userdata', jsonParser, (req, res) =>{
    var filter = {_id: req.body.id}
    var update = { city: req.body.city, email2: req.body.email2, job: req.body.job, education: req.body.education}
    var user = User.findOneAndUpdate(filter, update)
    .then(result => console.log("Ok"))
    .catch(error => console.log(error))
    
    var updateduser = User.findOne(filter)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => console.log(error))
})

//update userdata/introduction in db
app.post('/backend/user/userdata/introduction', jsonParser, (req, res) =>{
    var filter = {_id: req.body.id}
    var update = { introduction: req.body.introduction}
    var user = User.findOneAndUpdate(filter, update)
    .then(result => console.log('ok'))
    .catch(error => console.log(error))
    
    var updateduser = User.findOne(filter)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => console.log(error))
})

//save new status to db
app.post('/backend/statuses', jsonParser, (req, res) =>{
    console.log('backend nwe status req.body', req.body)
    var newStatus = new Status({ status: req.body.status, ownerId: req.body.ownerId, ownerFirstName: req.body.ownerFirstName, ownerLastName: req.body.ownerLastName, date: req.body.date});
    newStatus.save()
    .then(result =>{
        res.status(200).send(result)
    })
    .catch(error =>{
        console.log(error)
    })
})

//update status in db (add likes)









//get all satuses from db
app.get('/backend/statuses', (req, res) =>{
    console.log('REQ BODY')
    console.log(req.query.ownerId)
    var statuses = Status.find({ownerId: req.query.ownerId})
    .then(function(result){
        //if there are no statuses in db, status code 404
        if (result===null){
            console.log('status code 404')
            res.status(404).send('status code 404')    
        //if there are statuses in db, status code 200               
        }else{
            console.log('status code 200 statusesssssssssssssssssssss')
            console.log(result)
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log(err);
    })
})

//delete particualar status
app.delete('/backend/statuses/:id', (req, res) => {
    
    Status.findOneAndRemove({_id: req.query.id})
    .then(function(result){
        res.send('status deleted')
    })
    .catch(function(err){
            console.log(err);
    })
    
 })






app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))