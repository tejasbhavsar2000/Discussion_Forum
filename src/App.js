import React from 'react';
import './App.css';
import {useState,useEffect} from 'react';
import Posts from './Components/posts'
import Post from './Pages/Post_Details'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Nav from './Components/Nav';
import CreatePost from './Pages/CreatePost'

function App() {
  const [post, setPost] = useState([]);
  const [topPost, setTopPost] = useState([]);
  const [searchToken, setsearchToken] = useState('');
  useEffect(() => {
    getPosts();
  }, []);
  
  const getPosts = async () => {
    const res = await fetch("/getAllPosts")
      .then();
    let data = await res.json();
    let data2 = JSON.parse(JSON.stringify(data));
    data.sort(function (a, b) {
      return a.timestamp - b.timestamp;
    });
    data2.sort(function (a, b) {
      return b.votes - a.votes;
    });
    setTopPost(data2);
    setPost(data);
  };

  const updatePostsAsTokens = () => {
      const newPost = post.filter((item) => JSON.stringify(item).toLowerCase().includes(searchToken));
      console.log(newPost)
      return(newPost)
  }
  return (
    <Router>
    <div className="App">
      <Nav/>
      <Switch>
        
        <Route path="/" exact>
            <input className="search" placeholder="Search!" value={searchToken} onEmptied={() => getPosts()} onChange={(e) => {
              setsearchToken(e.target.value);
              console.log(searchToken);         
            }}></input>
        <div className='home'>
        <div className='top' style={{overflow:"hidden"}}>
            <h2 style={{color:"#883ff5", borderBottom:"solid white 0.06em"}}>Top Discussions</h2>
            <ul>
                  {topPost.map((top) => (
                    <Link style={{color:"white",  textDecoration:"none"}} to={`post/${top._id}`}><li>{top.title}</li></Link>
                    
                  ))}
            </ul>
              </div>
              <hr width="1" size="100vh" style={{marginLeft:"1vw"}}></hr>
          <div className='posts'>
            <h1>Recent Discussions</h1>
            {updatePostsAsTokens().map(post => (
              <Posts key= {post._id} id= {post._id} title= {post.title} text={post.content}></Posts>
            ))}
          </div>
        </div>
        </Route>
        <Route path="/post/:id" exact component={Post}/>
        <Route path="/createPost" exact component={CreatePost}/>
        
      </Switch>
      
    </div>
    </Router>
  );
}

export default App;