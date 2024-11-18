import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import './styles/style.css'
import {useState, useEffect} from 'react';


function App() {
  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editExpense, setEditExpense] = useState(-1);
  // variables to control login state and manual refresh
  const [logInState, setLogInState] = useState({loggedIn: false, user_id: -1})
  const [refresh, setRefresh] = useState(false)

  // form data entries
  const [amount, setAmount] = useState(0.00);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("")

  useEffect(() => {
    const getData = async () => {
      axios.get(`http://localhost:8080/expenses?user_id=${logInState.user_id}`).then((data) => {
        //this console.log will be in our frontend console
        console.log(data.data)
        setExpenses(data.data)
      })
    };

    if(logInState.loggedIn){
      getData();
      setRefresh(false);
    }
  }, [logInState, refresh]);

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

  console.log("logInState app: ", logInState)

  return (
    <div className="App">
      <header>
          <h1></h1>
      </header>

      <main>
          {logInState.loggedIn ? <div></div> : <LogInModal setLogIn={setLogInState} logInState={logInState} />}
          
          <p style={{fontSize: '20px'}}>Below you can enter a blog post or scroll further to see others' posts</p>

          {/* <!-- Blog Post Form Below -->*/}

          <div id="form-div">
          <form onSubmit={handleSubmit}>
              <label htmlFor="amount">Amount: </label>
              <input type="text" id="amount" name="amount" value={amount} placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required />
              <br></br>

              <label htmlFor='date' >Date: </label>
              <input type="date" onChange={(e)=>setDate(e.target.value)} required/>
              <br/><br/>

              <label htmlFor='description' >Description: </label>
              <textarea rows="4" cols="50" id='description' value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
              <br/><br/>

              <label htmlFor='category'>Category: </label>
              <input type='text' id='category' name='category' value={category} onChange={(e) => setCategory(e.target.value)}></input>

              <button type="submit">Post</button>
              
          </form>
          </div>

          <div className="placeholder" ></div>

          {/*<!-- All Current Blog Posts --> */}
          {editMode && <EditPostModal post={editExpense} closeEdit={() => setEditMode(false)} />}
          <div className="feed">
              <h1>Expenses</h1>

              {/*<!-- Filter for Posts -->*/}
              <label>Change Category:</label>
              <select id="categoryPosts" name="categoryPosts">
                  <option value="" disabled>Select your category</option>
                  <option value="All" >All</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="None">None</option>
              </select>
              
              <div className="placeholder"></div>

              {/*<!-- Blog Posts sorted newest at the top -->*/}
              <ul>
                {console.log("posts", typeof expenses)}
                <RenderExpenses currentExpenses={expenses} setCurrentExpenses={setExpenses} beginEdit={handleEdit}/>  
              </ul>
          </div>

          
      </main>

      <footer>
          <p>&copy; 2024 Aidan Trujillo. All rights reserved.</p>
      </footer>
    </div>
  );
}


function RenderExpenses(props) {
  const [expenses, setExpenses] = useState([]);
  const {currentExpenses, setCurrentExpenses, beginEdit} = props
  
  useEffect(() => {
    if (Array.isArray(currentExpenses)) {
      setExpenses(currentExpenses);
    }

  }, [currentExpenses]);
  
  

  // function that makes the api request call to delete
  const handleDelete = (expense) => {
    // expense already in json Format
    axios.post('http://localhost:8080/delete', expense)

    setCurrentExpenses(expenses.filter(expense_item => expense_item.expense_id !== expense.expense_id))
  }

  return (
    
    <ul>
      {expenses.map( expense => (
        <div className="expense" id={expense.expense_id} key={expense.expense_id} >
        {/*<!-- Blog Post edit/delete buttons -->
            */}
        <div className="expense-header">
            <button 
            className="mod-button"
            onClick={() => beginEdit(expense)}> 
            Edit</button>
            <button 
            className="mod-button"
            onClick={() => handleDelete(expense)}>
            Delete</button>

            <h1> {expense.date}</h1>
            <h4>{expense.amount}</h4>
            <h4>Expense: {expense.description} </h4>
            <h4>Category: {expense.category} </h4>
        </div> 
      </div>
    
      ))}
    </ul>
  );
}

// function to edit the post. 
function EditPostModal(props) {  
  const {post, closeEdit} = props
  const [new_body, setNew_body] = useState(post.body);
  const [new_author, setNew_author] = useState(post.creator_name);
  const [new_title, setNew_title] = useState(post.title);
  const [new_category, setNew_category] = useState(post.category);
//closeEdit={closeEdit}, old_post={post}, body={new_body}, author={new_author}, title={new_title}, category={new_category}
  return (
    <div style={styles.overlay}>
    <div id="form-div" style={styles.modalContent}>
    <form onSubmit={() => submitEditPost(closeEdit, post, new_body, new_author, new_title, new_category)}>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" name="name" value={new_author} onChange={(e) => setNew_author(e.target.value)} required />
        <br></br>

        <label htmlFor="title">Title: </label>
        <input type="text" id="title" name="title" value={new_title} onChange={(e) => setNew_title(e.target.value)} required />
        <br/><br/>

        <label htmlFor="category">Category:</label>
        <select id="category" name="category" onChange={(e) => setNew_category(e.target.value)} required>
            <option value="" disabled>Select your category</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Education">Education</option>
            <option value="None">None</option>
        </select>
        <br/><br/>

        <label htmlFor="message">Message: </label>
        <textarea id="message" name="message" rows="4" cols="50" onChange={(e) => setNew_body(e.target.value)} required>
          {new_body}</textarea>
        <br/><br/>

        <input style={{display: "none"}} type="text" id="time" name="time" value={post.time} ></input>
        <input style={{display: "none"}} type="text" id="blog_id" name="blog_id" value={post.blog_id} ></input>
        <input style={{display: "none"}} type="text" id="creator_user_id" name="creator_user_id" value={post.creator_user_id} ></input>


        <button type="submit">Post</button>
        <button onClick={closeEdit}>Cancel</button>
    </form>
    </div>
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
