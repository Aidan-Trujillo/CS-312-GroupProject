import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import './styles/style.css'
import {useState, useEffect} from 'react';


function App() {
  // variables to control login state and manual refresh
  const [logInState, setLogInState] = useState({loggedIn: false, user_id: -1})
  const [refresh, setRefresh] = useState(false)

  // variables to set editing and filtering
  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editExpense, setEditExpense] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState('');
  

  // form data entries
  const [amount, setAmount] = useState(0.00);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("")

    useEffect(() => {
      const getData = async (category) => {
        // query for a specific category
        const categoryQ = '&category=' + category

        axios.get(`http://localhost:8080/expenses?user_id=${logInState.user_id}${categoryQ}`).then((data) => {
          //this console.log will be in our frontend console
          console.log(data.data)
          setExpenses(data.data)
        })
      };

        if (logInState.loggedIn) {
            getData(selectedCategory);
            setRefresh(false);
        }
    }, [logInState, refresh, selectedCategory]);


    function handleEdit(expense) {
      console.log("Editing post:", expense);
      setEditMode(true);
      setEditExpense(expense);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // make api call to add expense
    const jsonData = {user_id: logInState.user_id, amount: amount, category: category, date: date, description: description}
    axios.post('http://localhost:8080/expense', jsonData)

    // set back to defaults and re render the page
    setAmount(0.00);
    setCategory('');
    setDate('');
    setDescription('');

    // setRefresh
    setRefresh(true);
  }
  console.log("Selected Month", selectedMonth)

    return (
        <div className="App">
            <header>
                <h1>Expense Tracker</h1>
            </header>

            <main>
                {logInState.loggedIn ? (
                    <>
                        {/** Form for adding an expense.  */}
                        <div id="form-div">
                            <form onSubmit={handleSubmit}>
                                {/* Amount Input */}
                                <label htmlFor="amount">Amount:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={amount}
                                    placeholder="Amount"
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                                <br/>

                                {/* Date Input */}
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={date}
                                    onChange={(e) => {setDate(e.target.value); console.log(e.target.value)}}
                                    required
                                />
                                <br/>

                                {/* Category Input */}
                                <label htmlFor="category">Category:</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required>
                                    <option value="">Select a category</option> {/* Default empty option */}
                                    <option value="Food">Food</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Fun">Fun</option>
                                    <option value="Groceries">Groceries</option>
                                    <option value="Other">Other</option>
                                  </select>
                                <br/>

                                {/* Description Input */}
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    placeholder="Describe the expense"
                                    rows="4"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                                <br/>

                                {/* Submit Button */}
                                <button type="submit">Add Expense</button>
                            </form>
                        </div>

                        <div className='placeholder'></div>

                        {/* Edit Post Modal that will pop up when edit is pressed */}
                        {editMode && 
                          <EditPostModal 
                            expense={editExpense} 
                            closeEdit={() => setEditMode(false)} 
                            refresh={() => setRefresh(true)} />}


                        <h1>Expenses</h1>
                        {/** Filters */}
                        <h4>Filters</h4>
                        <label>Category: </label>
                        <select
                          id="selectedCategory"
                          name="selectedCategory"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}>
                          <option value="All">All</option> {/* Default empty option */}
                          <option value="Food">Food</option>
                          <option value="Bills">Bills</option>
                          <option value="Fun">Fun</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Other">Other</option>
                        </select>
                        <label htmlFor="month"> Month and Year: </label>
                          <input
                            type="selectedMonth"
                            id="selectedMonth"
                            name="selectedMonth"
                            value={selectedMonth} 
                            placeholder='yyyy-mm'
                            onChange={(e) => setSelectedMonth(e.target.value)} // Update the state when the user selects a month
                            required
                          />

                        {/*feed*/}
                        <div className="feed">
                            
                            {expenses.length === 0 ? (
                                <p>No expenses match your criteria.</p>
                            ) : (
                                <RenderExpenses
                                    currentExpenses={expenses}
                                    setCurrentExpenses={setExpenses}
                                    beginEdit={handleEdit}
                                    selectedCategory={selectedCategory}
                                    selectedMonth={selectedMonth}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <LogInModal setLogIn={setLogInState} logInState={logInState}/>
                )}

            </main>

            <footer>
                <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
            </footer>
        </div>
    );

}


function RenderExpenses(props) {
    const [expenses, setExpenses] = useState([]);
    const {currentExpenses, 
      setCurrentExpenses, 
      beginEdit, 
      selectedCategory,
      selectedMonth} = props

    useEffect(() => {
        if (Array.isArray(currentExpenses)) {
            // filter the expenses by category
            setExpenses(currentExpenses);
        }

    }, [currentExpenses]);


    // function that makes the api request call to delete
    const handleDelete = (expense) => {
        // expense already in json Format
        axios.post('http://localhost:8080/delete', expense)

        setCurrentExpenses(expenses.filter(expense_item => expense_item.expense_id !== expense.expense_id))
    }

    // set up the filtering 
    const prodExpenseList = filterExpenses(expenses, selectedCategory, selectedMonth)

    
    return (
        <table className="expenses-table">
            <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {prodExpenseList.map(expense => 
                <tr key={expense.expense_id}>
                    <td>{expense.date}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>
                        <button onClick={() => beginEdit(expense)}>Edit</button>
                        <button onClick={() => handleDelete(expense)}>Delete</button>
                    </td>
                </tr>
              
            )}
            </tbody>
        </table>
    );
}

function filterExpenses(expenses, selectedCategory, selectedMonth){
  // filter the expenses by category
  const filteredExpensesCategory = expenses.filter(expense => {
    if(selectedCategory === "All" || 
      selectedCategory === expense.category) {
        return expense
      }
   })

   // further filter the expenses by month
  const filteredExpensesMonth = filteredExpensesCategory.filter(expense => {
    if(selectedMonth === '' || 
      selectedMonth === expense.date.slice(0,7)) {
        return expense
      }
   })

  return filteredExpensesMonth;

}

// function to edit the post. 
function EditPostModal(props) {  
  // pull parameters
  const {expense, closeEdit, refresh} = props

  // form variables
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [description, setDescription] = useState(expense.description)

  const handleSubmit = (event) => {
    event.preventDefault();
    // format the new variables
    const new_expense = {
      expense_id: expense.expense_id,
      user_id: expense.user_id,
      amount: amount,
      date: date, 
      description: description,
      category: category}
    
    axios.post('http://localhost:8080/save', new_expense)

    closeEdit();
    refresh();    
  }

  return (
    <div id="form-div">
      <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <label htmlFor="amount">Amount:</label>
          <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
              required
          />
          <br/>

          {/* Date Input */}
          <label htmlFor="date">Date:</label>
          <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
          />
          <br/>

          {/* Category Input */}
          <label htmlFor="category">Category:</label>
          <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required>
              <option value="">Select a category</option> {/* Default empty option */}
              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Fun">Fun</option>
              <option value="Groceries">Groceries</option>
              <option value="Other">Other</option>
            </select>
          <br/>

          {/* Description Input */}
          <label htmlFor="description">Description:</label>
          <textarea
              id="description"
              name="description"
              value={description}
              placeholder="Describe the expense"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
              required
          ></textarea>
          <br/>

          {/* Submit Button */}
          <button type="submit">Save Expense</button>
          {/*Close Button */}
          <button onClick={closeEdit}>Close</button>
      </form>
      
  </div>
  );
  
}

function submitEditPost(closeEdit, old_post, body, author, title, category) {
  //const {closeEdit, old_post, body, author, title, category} = props

  const post = {"blog_id": old_post.blog_id,  
    "body": body,
    "creator_name": author,
    "title": title,
    "category": category,
    "date_created": old_post.date_created,
    "creator_user_id": old_post.creator_user_id}

  var URL = 'http://localhost:8080/editPost'

  axios.post(
    URL, post, {
      headers: {
        'Content-Type': 'application/json'}}
  ).then((data) => {
    // close the modal
    //closeEdit();
    console.log("worked")
  })
}

const styles = {
  overlay: {
    position: 'fixed',    // Fixed positioning to cover the screen
    top: 0,               // Start from the top
    left: 0,              // Start from the left
    width: '100vw',       // Full viewport width
    height: '100vh',      // Full viewport height
    backgroundColor: 'blanchedalmond', // Semi-transparent background
    zIndex: 1000,         // High z-index to ensure it covers everything
    display: 'flex',      // Center content
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',  // White background for the modal content
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90%',           // Constrain width
    maxHeight: '90%',          // Constrain height
    overflowY: 'auto',         // Scrollable if content is too long
  },
  closeButton: {
    position: 'absolute',      // Absolute positioning inside the modal
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

function LogInModal (props) {
  const {setLogIn, logInState} = props
  // set the user name and password variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (event) => {
    event.preventDefault();

    // attempt to login and query the user database
    const jsonData = {username: username, password: password}
    const fullResult = await axios.post('http://localhost:8080/login', jsonData)

    const result = fullResult.data
    setAttempts(attempts + 1);


    // check result
    if (result.success) {
      // on successful login
      setLogIn({loggedIn: result.success, user_id: result.user_id});
    } 
  }

  return(
    <div style={styles.overlay}>
      <div id="form-div" style={styles.modalContent}>
      <form onSubmit={handleLogin}>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
          <br></br>

          <label htmlFor="password">Password: </label>
          <input type="text" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
          <br/><br/>

          <button type="submit">Post</button>
      </form>
      <p style={attempts !== 0 ? { color: 'red' } : { color: 'red', display: 'none' }}>
        Incorrect Username or Password
      </p>
      </div>
    </div>
  );
  
}

export default App;
