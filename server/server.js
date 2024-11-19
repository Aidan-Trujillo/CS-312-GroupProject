// server to handle backend of a expense tracker website 

// dependencies
const {readExpenses, addExpense, loginUser, removeExpense, saveExpense} = require('./utils.js')
const cors = require('cors');


// server initialization
var express = require('express');

// start app
var app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// below are the applications
app.get('/test', async (req, res) => {
    const { success, user_id } = await loginUser('teestUser', '1234')

    console.log("server.js", success)

    res.send('Success?')
})

app.post('/login', async (req,res) => {
    try{
        // get the username and password
        const {username, password} = req.body;
        console.log("Logging in", req.body)

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


// page for viewing expenses
app.get('/expenses', async (req, res) => {
    try {
        const { user_id, category, month } = req.query;
        const { expenses } = await readExpenses(user_id, category, month);

        /*console.log(expenses);
        console.log(expenses.length);
        */
        res.send(JSON.stringify(expenses));

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing the request');
    }
});


// API for posting a expense
app.post('/expense', async (req,res) => {
    try{
        // get the username and password
        const new_expense = req.body
        console.log("Request body: ", req.body)

        const { success } = await addExpense(new_expense);

        if (success) {
            var jsonData = { success: success }
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

app.post('/delete', async (req,res) => {
    try{
        // get the request information
        // asssuming that the user is logged in to delete their own expenses
        const expense = req.body;
        console.log(expense)
        const { success } = await removeExpense(expense);

        if (success) {
            var jsonData = { success: success }
            res.send(JSON.stringify(jsonData, null, 2))
        } else {
            var jsonData = { success: success }
            res.send(JSON.stringify(jsonData, null, 2))
        }

    }catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing the form');
    }
})

app.post('/save', async (req,res) => {
    try{
        // get the request information
        // asssuming that the user is logged in to delete their own expenses
        const expense = req.body;
        console.log("Editing a post, saving now: ", expense)
        const { success } = await saveExpense(expense);

        if (success) {
            var jsonData = { success: success }
            res.send(JSON.stringify(jsonData, null, 2))
        } else {
            var jsonData = { success: success }
            res.send(JSON.stringify(jsonData, null, 2))
        }

    }catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing the form');
    }
})


app.listen(8080);
console.log('Server is listening on port 8080');