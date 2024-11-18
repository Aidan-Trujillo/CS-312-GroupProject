const fs = require('fs');
const { json } = require('express');
const { getExpenses, insertExpense, deleteExpense, updateExpense, 
     getUser } = require('./database.js');

// function that outputs an array of blog posts
const readExpenses = async (user_id) => {
    try{
        const result = await getExpenses(user_id);
        const expenses = result.rows;
        
        return {expenses};

    } catch (err) {
        console.error('Error quering data: ', err)
        // send black blank file
        return []
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
        const result = await updateExpense(expense.expense_id);
        console.log("Post deleted successfuly")
        return {success: true}
    } catch (err) {
        console.error('Error deleting the post', err)

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