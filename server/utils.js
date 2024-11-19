const fs = require('fs');
const { json } = require('express');
const { getExpenses, insertExpense, deleteExpense, updateExpense, 
     getUser } = require('./database.js');

// function that outputs an array of blog posts
const readExpenses = async (user_id, category, month) => {
    try {
        const result = await getExpenses(user_id, category, month);

        // format the date for all expenses
        const expenses = result.rows.map( expense => {

            // convert the date back to a string from date object
            const year = expense.date.getFullYear();
            const month = String(expense.date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(expense.date.getDate()).padStart(2, '0');

            // format
            expense.date = `${year}-${month}-${day}`

            return expense
        })


        return { expenses: expenses };
    } catch (err) {
        console.error('Error querying data: ', err);
        return { expenses: [] };
    }
};


const loginUser = async (username, password) => {
    try{
        const {success, user_id} = await getUser(username, password);
        console.log("Login User: ", success, user_id)
        return {success: success, user_id: user_id}

    } catch (err) {
        console.error('Error quering data: ', err)
        // send black blank file
        return []
    }
}


// function that simplly adds a newly created expense for a user
const addExpense = async (expense) => {
    try{
        const result = await insertExpense(expense);

        console.log("Added expense to the table.")
        return {success: true}

    } catch (err) {
        console.error('Error adding data: ', err)
        // send black blank file
        return {success: false}
    }
};

const removeExpense = async (expense) => {
    try{
        const result = await deleteExpense(expense.expense_id);
        console.log("Post deleted successfuly")
        return {success: true}
    } catch (err) {
        console.error('Error deleting the post', err)

        return {success: false}
    }
}

// a function that saves a post. Takes post list and just writes to the file
const saveExpense = async (expense) => {
    try{
        const result = await updateExpense(expense);
        console.log("Post saved successfuly")
        return {success: true}
    } catch (err) {
        console.error('Error saving the post', err)

        return {success: false}
    }
    
}


module.exports = {
    readExpenses,
    loginUser,
    addExpense,
    removeExpense, 
    saveExpense
}