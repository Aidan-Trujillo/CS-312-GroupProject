import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import './styles/style.css'
import {useState, useEffect} from 'react';


function App() {
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPost, setEditPost] = useState(-1);

  useEffect(() => {
    const getData = async () => {
      axios.get('http://localhost:8080').then((data) => {
        //this console.log will be in our frontend console
        console.log(data.data)
        setPosts(data.data)
      })
    };

    getData();

  }, []);

  function handleEdit(post) {
    console.log("Editing post:", post);
    setEditMode(true);
    setEditPost(post);
  }


  return (
    <div className="App">
      <header>
          <h1></h1>
      </header>

      <main>
          <p style={{fontSize: '20px'}}>Below you can enter a blog post or scroll further to see others' posts</p>

          {/* <!-- Blog Post Form Below -->*/}

          <div id="form-div">
          <form action="/submit" method="post">
              <label htmlFor="name">Name: </label>
              <input type="text" id="name" name="name" placeholder="Name" required />
              <br></br>

              <label htmlFor="title">Title: </label>
              <input type="text" id="title" name="title" placeholder="Title" required />
              <br/><br/>

              <label htmlFor="category">Category:</label>
              <select id="category" name="category" required>
                  <option value="" disabled>Select your category</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="None">None</option>
              </select>
              <br/><br/>

              <label htmlFor="message">Message: </label>
              <textarea id="message" name="message" rows="4" cols="50" required></textarea>
              <br/><br/>

              <button type="submit">Post</button>
              
          </form>
          </div>

          <div className="placeholder" ></div>

          {/*<!-- All Current Blog Posts --> */}
          {editMode && <EditPostModal post={editPost} closeEdit={() => setEditMode(false)} />}
          <div className="feed">
              <h1>Blog Posts</h1>

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
                {console.log("posts", typeof posts)}
                <RenderPosts currentPosts={posts} beginEdit={handleEdit}/>  
              </ul>
          </div>

          
      </main>

      <footer>
          <p>&copy; 2024 Aidan Trujillo. All rights reserved.</p>
      </footer>
    </div>
  );
}


function RenderPosts(props) {
  var posts = [];
  const {currentPosts, beginEdit} = props
 
  
  if (Array.isArray(currentPosts)) {
    posts = currentPosts;
  }

  return (
    
    <ul>
      {posts.map( post => (
        <div className="blog-post" id={post.blog_id} key={post.blog_id} >
        {/*<!-- Blog Post edit/delete buttons -->
            */}
        <div className="post-header">
            <button 
            className="mod-button"
            onClick={() => beginEdit(post)}> 
            Edit</button>
            <button 
            className="mod-button">
            Delete</button>

            <h1> {post.title}</h1>
            <h4>Author: {post.creator_name} </h4>
        </div> 
        {/*<!-- Blog Post information -->*/}
        <div className="post-body">
            <p>{post.body}</p>
        </div>
        <div className="post-footer">
            <h6>{post.category}</h6>
            <h6>{post.date_created.slice(0, 10)} at {post.date_created.slice(12)}</h6>
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

export default App;
