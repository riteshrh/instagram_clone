// import logo from 'react';
import './App.css';
import Post from './Post';
import { db,auth} from './firebase';
import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Input} from '@material-ui/core'
import Modal from '@material-ui/core/Modal'
import ImageUpload from './ImageUpload';
import LinkT from './LinkT';







  function getModalStyle() {
    const top = 50;
    const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`, 
  };
}


  const useStyles= makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2,4,3),
    },
  }));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);/*Short Term memory in react*/
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
        
        if(authUser.displayName) {
          //dont update username

        }else {
          // if we just created someone
          return authUser.updateProfile({
            displayName: username,
          });
        }

      } else {
        //user has logged out
        setUser(null);
      } 
    })
    
    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  },[user, username]);
  
  
 
  // useEffect rins a piece of code on a specific condition 

  useEffect(() =>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //Every time a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[]);


  const signup = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
      .then((authUser)=> {
        setUser(authUser);
      })
    })
    .catch((error) => alert(error.message)) 
    setOpen(false);
  }
  

  const signIn = (event) => {
    event.preventDefault();
    
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
  
  setOpenSignIn(false);
  }

  return (
    <div className="app">

        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
                <img
                  className="app_headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/130px-Instagram_logo.svg.png"
                  alt=""
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> 

              <Button type="submit" onClick={signup}>Sign Up</Button>
        </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
              <img
                className="app_headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/130px-Instagram_logo.svg.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /> 

            <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
        </div>
      </Modal>



      {/* Header */}
      <div className="app__header">
       <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/130px-Instagram_logo.svg.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
     </div>
     


     

     <div className='app__posts'>
      {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ) ) //Mapping to the post , here key={id} it will just refesh the one which is newly post added
      }
     </div>

     

    
      {user?.displayName ? ( //check for login and then upload
        <ImageUpload username={user.displayName}/>        
      ): (
        <h3> <center> Sorry You need to login to upload </center></h3>
      )}

    </div>
  );
}

export default App;
