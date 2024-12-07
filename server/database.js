const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 1234,
  password: "1234",
  database: "GroupProject",
});

client.connect();


// database code to get a post
const getExpenses = async(user_id, categoryQ, month) => {  

    // change this to read my posts. 
    const result = await client.query(`SELECT * FROM public.expenses WHERE user_id = ${user_id} ` + categoryQ + ' ORDER BY date DESC;');
    return result;
}

// database code to insert an expense
const insertExpense = async(expense) => {
    const result = await client.query(`INSERT INTO public.expenses (user_id, amount, category, date, description)
        VALUES ($1, $2, $3, $4, $5)`,
  [expense.user_id, expense.amount, expense.category, expense.date, expense.description])
}

// database code to delete an expense. 
const deleteExpense = async(expense_id) => {
    const result = await client.query(
        `DELETE FROM public.expenses WHERE expense_id = $1;`, [expense_id] 
    )
}

const updateExpense = async(expense) => {
    const result = await client.query(
        `UPDATE public.expenses
         SET user_id = $1, amount = $2, category = $3, date = $4, description = $5
         WHERE expense_id = $6`,
        [expense.user_id, expense.amount, expense.category, expense.date, expense.description, expense.expense_id]
      );
    
}

// database code to get a user
const getUser = async(user_name) => {
    // connect to the database

    // change this to read my posts. 
    const result = await client.query(`SELECT * FROM public.users WHERE username = '${user_name}'`)
    
    if (result.rows.length > 0){
        var userData = result.rows[0];
    } else {
        var userData = null
    }

    return userData;
}

// code to sign up a user
const insertUser = async(user_name, password) => {
    // insert data into table now.
    await client.query(`
        INSERT INTO public.users(username, password)
	    VALUES ($1, $2);`, 
    [user_name, password])

    console.log("Expense added successfully.")

}

module.exports = {
    getExpenses,
    insertExpense,
    deleteExpense,
    updateExpense,
    getUser,
    insertUser
};