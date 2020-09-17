const express = require('express')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
var jsonParser = bodyParser.json()

const port = 4000

const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.connect('mongodb+srv://nsmokva:nsmokva12@cluster0-wgok7.mongodb.net/fejsbuk-app?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const UserSchema = new Schema ({ 
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

const CommentSchema = new Schema({
    comment: String,
    ownerId: String,
    ownerFirstName: String,
    ownerLastName: String,
    date: Object,
});

const StatusSchema = new Schema({
    status: String,
    ownerId: String,
    ownerFirstName: String,
    ownerLastName: String,
    date: Object,
    likes: [String],
    comments: [CommentSchema]
});


const User = mongoose.model('User', UserSchema);

const Status = mongoose.model('Status', StatusSchema)



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
            res.status(404).send('status code 404')
        //if there is user with given username in db but given password is not matching password from db, status code 401 (unauthorized)
        }else if (result.password !== req.query.password){
            res.status(401).send("status code 401")     
        //if there is given user in db and given password matches password fom db, status code 200               
        }else{
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log('*******1st error********', err);
    })
})
// 2. get user based on user id
app.get('/backend/user', (req, res) => {
    var user = User.findOne({_id: req.query.id})
    .then(function(result){
        //if there is no user with given username in db, status code 404
        if (result===null){
            res.status(404).send('status code 404')    
        //if there is given user in db and given password matches password fom db, status code 200               
        }else{
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log('*******2nd error********', err);
    })
})

// 3. get all users
app.get('/backend/users', (req, res) => {
    var users = User.find()
    .then(function(result){
        //if there are no users in db, status code 404
        if (result===null){
            res.status(404).send('status code 404')    
        //if there are users in db, status code 200               
        }else{
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log('*******3rd error********', err);
    })
})

//update user data in db
app.post('/backend/user/userdata', jsonParser, (req, res) =>{
    var filter = {_id: req.body.id}
    var update = { city: req.body.city, email2: req.body.email2, job: req.body.job, education: req.body.education}
    var user = User.findOneAndUpdate(filter, update)
    .then(result => {
        var updateduser = User.findOne(filter)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => console.log('*******4th error********', error))
    })
    .catch(error => console.log('*******5th error********', error))
})

//update userdata/introduction in db
app.post('/backend/user/userdata/introduction', jsonParser, (req, res) =>{
    var filter = {_id: req.body.id}
    var update = { introduction: req.body.introduction}
    var user = User.findOneAndUpdate(filter, update)
    .then(result => {
        var updateduser = User.findOne(filter)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => console.log('*******6th error********', error))
    })
    .catch(error => console.log('*******7th error********', error))    
})

//save new status to db
app.post('/backend/statuses', jsonParser, (req, res) =>{
    var newStatus = new Status({ status: req.body.status, ownerId: req.body.ownerId, ownerFirstName: req.body.ownerFirstName, ownerLastName: req.body.ownerLastName, date: req.body.date});
    newStatus.save()
    .then(result =>{
        res.status(200).send(result)
    })
    .catch(error =>{
        console.log('*******8th error********', error)
    })
})

//update status in db (add likes)
app.post('/backend/statuses/likes', jsonParser, (req, res) =>{
    console.log(req.body.id)
    var filter = {_id: req.body.id}
    var user = Status.findOne(filter)
    .then(result => {
        console.log('result of pressing like: ', result)
        const found = result.likes.findIndex(element => element === req.body.like);
        console.log('found is: ', found)
        if (found == -1){
            result.likes.push(req.body.like)
        } else{
            result.likes.splice(found, 1)
        }
        result.save().then(() => {
        var updatedUserLike = Status.findOne(filter)
        .then(result => {
            console.log('result updated like: ', result)
            res.status(200).send(result)
        })
        })
        .catch(error => console.log('*******9th error********', error))
    })
    .catch(error => console.log('*******10th error********', error))
})

//update status in db (add comments)
app.post('/backend/statuses/comments', jsonParser, (req, res) =>{
    console.log(req.body)
    var filter = {_id: req.body.statusId}
    Status.findOne(filter)
        .then(result => {
            console.log('result of pressing comment: ', result) 
            result.comments.push({
                comment: req.body.comment,
                ownerId: req.body.ownerId,
                ownerFirstName: req.body.ownerName,
                ownerLastName: req.body.ownerLastName,
                date: req.body.date
            })

            result.save().then(() => {
                Status.findOne(filter)
                .then(result => {
                    res.status(200).send(result)
                })
            })
        
        })
        .catch(error => console.log('*******10th error********', error))
})

//delete particualar comment
app.post('/backend/comments/delete', jsonParser, (req, res) => {
    console.log('erase triggers: ', req.body.id)
   console.log('erase triggers commentId: ', req.body.commentId)
    Status.findOne({_id: req.body.id})
    .then(function(result){
    var indexOfFoundComment = result.comments.findIndex(comment => comment._id == req.body.commentId)
    console.log('indexOfFoundComment: ', indexOfFoundComment)
    result.comments.splice(indexOfFoundComment, 1) 
     result.save().then(() => {
        var updatedUserComment = Status.findOne({_id: req.body.id})
        .then(result => {
           console.log('status after erasing comment: ', result)
           res.status(200).send(result)
        })
     })
    })
    .catch(function(err){
            console.log('*******between 10th and 11th error********', err);
    })
    
 })



//get all satuses from db
app.get('/backend/statuses', (req, res) =>{
    var statuses = Status.find({ownerId: req.query.ownerId})
    .then(function(result){
        //if there are no statuses in db, status code 404
        if (result===null){
            res.status(404).send('status code 404')    
        //if there are statuses in db, status code 200               
        }else{
            res.status(200).send(result)
        }
    })
    .catch(function(err){
            console.log('*******11th error********', err);
    })
})

//delete particualar status
app.delete('/backend/statuses/:id', (req, res) => {
    
    Status.findOneAndRemove({_id: req.query.id})
    .then(function(result){
        res.send('status deleted')
    })
    .catch(function(err){
            console.log('*******12th error********', err);
    })
    
 })






app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))