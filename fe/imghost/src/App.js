import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import AllImages from './AllImages.js';
import About from './About.js';
import Home  from './Home.js';
import ImagePage from './Image.js';
import { 
  Navbar,
  Nav
} from 'react-bootstrap'
import {Get} from 'react-axios';

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Route exact path = '/' component={Home}/>
        <Route path = '/about' component={About}/>
        <Route path = '/allimages' component={AllImages}/>
        <Route path = '/image/:imageId' component={ImagePage}/>
        <Route path = '/random' component={Random}/>
      </div>
    </Router>
  );
}

function Header() {
  return (
    <Navbar 
      style={{color: '#F8F8F8'}}
      className="navStyle"  variant="dark" sticky='top'>
      <Navbar.Brand as = {Link} to='/'>
        <img
          style={{marginRight:10}}
          src="ghost-inverted.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=''
        />
        ImGhost
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as = {Link} to='/allimages'>All Images</Nav.Link>
        <Nav.Link as = {Link} to='/about'>About</Nav.Link>
        <Nav.Link as = {Link} to='/random'>Random</Nav.Link>
      </Nav>
    </Navbar>

  );
};

function Random() {
  return (
    <Get url='/random'>
      {(error, response, isLoading, makeRequest, axios) => {
          if(error) {
            return (<div>Something bad happened: {error.message} <button onClick={() => makeRequest({ params: { reload: true } })}>Retry</button></div>)
          }
          else if(isLoading) {
            return (<div>Loading...</div>)
          }
          else if(response !== null) {
            return (<Redirect to={`/image/${response.data.img_url}`}/>)
          }
          return (<div>Default message before request is made.</div>)
          }}
    </Get>
  )
};  

export default App;
