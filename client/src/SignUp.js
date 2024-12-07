import './App.css';
import './styles/style.css'
import {
    useState, 
    React
} from 'react';
import axios from 'axios';


function SignUpModal (props) {
    const { setSignedUp} = props
    // set the user name and password variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      // attempt to login and query the user database
      const jsonData = {username: username, password: password}
      const fullResult = await axios.post('http://localhost:8080/signup', jsonData)
  
      const result = fullResult.data
  
  
      // check result
      if (result.success) {
        // on successful login
        setSignedUp(true);
      } else {
        setError(true)
      }
    }
  
    return(
      <div style={styles.overlay}>
        <div id="form-div" style={styles.modalContent}>
            <h1>Sign Up</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
                <br></br>
    
                <label htmlFor="password">Password: </label>
                <input type="text" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                <br/><br/>
    
                <button type="submit">Sign Up</button>
            </form>
            <p style={error ? { color: 'red' } : { color: 'red', display: 'none' }}>
            Incorrect Username or Password
            </p>
        </div>
      </div>
    );
    
  }

  const styles = {
    overlay: {
      position: 'fixed',    // Fixed positioning to cover the screen
      top: 0,               // Start from the top
      left: 0,              // Start from the left
      width: '100vw',       // Full viewport width
      height: '100vh',      // Full viewport height
      backgroundColor: 'blanchedalmond', // Semi-transparent background
      zIndex: 1001,         // High z-index to ensure it covers everything
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

  export default SignUpModal;