const express = require('express')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
var jsonParser = bodyParser.json()

const port = 4000

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nsmokva:nsmokva12@cluster0-wgok7.mongodb.net/fejsbuk-app?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const User = mongoose.model('User', { 
    email: String,
    password: String
});

//const firstUser = new User({ email: 'nina', password: '1234' });
//firstUser.save().then(() => console.log('Nikolina in db'));

// routes
app.get('/backend/login', (req, res) => {
    console.log("received get request on backhand")
    console.log(req.query)
    var user = User.findOne({email: req.query.email})
    .then(function(result){
        //if there is no user with given username in db, status code 404
        if (result===null){
            console.log('status code 404')
            res.send('status code 404')
        //if there is user with given username in db but given password is not matching password from db, status code 401 (unauthorized)
        }else if (result.password !== req.query.password){
            console.log("status code 401")
            res.send("status code 401")     
        //if there is given user in db and given password matches password fom db, status code 200               
        }else{
            console.log('status code 200')
            res.send('status code 200')
        }
    })
    .catch(function(err){
            console.log(err);
    })
})
app.post('/backend/register', jsonParser, (req, res) =>{
    console.log('post request on backhand')
    //check if there is already user with given username in db
    var user = User.findOne({username: req.body.username})
    .then(function(result){
        console.log(result);
        //if there is no uder with given username in db, add user to db
        if(result===null){
            console.log('Logging from if statement')
            user = new User(req.body)
            user.save().then(() => console.log(user.username + ' saved db'));
            res.send(user.username + " have been successfully added to db")
        //if there is already user with given username, refuse to add user to db
        }else{
            console.log('Logging from else statement')
            res.send("User with username ** " + req.body.username + ' ** already exists. Please choose another username')

        }
        })
    .catch(function(err){
        console.log(err);
    })
    
    //var user=req.body
    //user = new User(user)
    //user.save().then(() => console.log('User from response in db'));
    
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))