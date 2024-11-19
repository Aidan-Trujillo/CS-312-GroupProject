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
const getExpenses = async(user_id) => {
    // connect to the database

    // change this to read my posts. 
    const result = await client.query(`SELECT * FROM public.expenses WHERE user_id = ${user_id} ORDER BY date DESC; `)
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
const getUser = async(user_name, password) => {
    // connect to the database

    // change this to read my posts. 
    const result = await client.query(`SELECT * FROM public.users WHERE username = '${user_name}'`)
    
    if (result.rows.length > 0){
        var userData = result.rows[0];
    } else {
        var userData = null
    }

    if (userData !== null && password === userData.password) {
        console.log("password success")

        const user_id = userData.user_id
        return {success: true, user_id: user_id}
    } else {
        return {success: false}
    }

    return userData;
}

// code to sign up a user
const insertUser = async(user_name, password, name) => {
    // get last user
    const result = await client.query(`SELECT user_id FROM public.users ORDERBY user_id DSC`)

    console.log(result.rows)
    // get the first user_id number and add 1
    lastId = result.rows[0].user_id
    newId = lastId + 1
    console.log(`New ID!!! ${newId}`)

    // insert data into table now.
    await client.query(`INSERT INTO public.users(
	user_id, password, name, user_name)
	VALUES (${newId}, ${password}, ${name}, ${user_name});`)

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