const fs = require('fs');
const { json } = require('express');
const { getExpenses, getUser } = require('./database.js');

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


// function that simplly adds a newly created post
const addPost = async (filePath, post) => {
    // get list of posts
    const {posts, lastId} = await readPosts(PostsPath);
    // get the next index to add to the post
    post.id = Number(lastId) + 1;
    
    // push the post and get it ready to write to the file
    posts.push(post);
    const formattedData = JSON.stringify(posts, null, 2);

    await fs.promises.writeFile(filePath, formattedData, (err) => {
        if (err) throw err;
        console.log("added " +data+ " to blogPost");
    });
};


// a function that saves a post. Takes post list and just writes to the file
const savePosts = async (posts) => {
    const formattedData = JSON.stringify(posts, null, 2);

    await fs.promises.writeFile(PostsPath, formattedData, (err) => {
        if (err) throw err;
        console.log("blog post saved");
    });
}


module.exports = {
    readExpenses,
    loginUser,
    addPost, 
    savePosts
}