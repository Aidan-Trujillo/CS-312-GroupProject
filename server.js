// server to handle backend of a expense tracker website 

// dependencies
const {readExpenses, loginUser} = require('./utils.js')

// server initialization
var express = require('express');
var fs = require('fs');
var path = require('path');
const { get } = require('https');

// start app
var app = express();

// set view engine to ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

app.get('/test', async (req, res) => {
    const { success, user_id } = await loginUser('teestUser', '1234')

    console.log("server.js", success)

    res.send('Success?')
})

app.post('/login', async (req,res) => {
    try{
        // get the username and password
        const {username, password} = req.body;

        const { success, user_id } = await loginUser(username, password);

        if (success) {
            var jsonData = { success: success, user_id: user_id }
            res.send(JSON.stringify(jsonData, null, 2))
        } else {
            var jsonData = { success: success }
            res.send(JSON.stringify(jsonData, null, 2))
        }
        

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing the form');
    }
})


// index page (where blog shows up)
app.get('/expenses', async (req,res) => {
    try{
        // get the user_id
        const user_id = req.query.user_id;
        // get all posts
        const {expenses} = await readExpenses(user_id);

        console.log(expenses)
        console.log(expenses.length)
        
        res.send(JSON.stringify(expenses))

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing the form');
    }
});



app.listen(8080);
console.log('Server is listening on port 8080');