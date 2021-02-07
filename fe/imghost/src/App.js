import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './About.js';
import Home  from './Home.js';
import ImagePage from './Image.js';
import TestPage from './testpage.js';
import { 
  Navbar,
  Nav,
  Col,
  Image
} from 'react-bootstrap'

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path = '/' component={Home}/>
        <Route path = '/about' component={About}/>
        <Route path = '/allimages' component={Home}/>
        <Route path = '/image/:imageId' component={ImagePage}/>
        <Route path = '/testpage' component={TestPage} />
      </div>
    </Router>
  );
}

function Header() {
  return (
    <Navbar className="navStyle"  variant="dark">
      <Navbar.Brand as = {Link} to='/'>
        <img
          style={{marginRight:10}}
          src="ghost-inverted.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        ImGhost
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as = {Link} to='/allimages'>All Images</Nav.Link>
        <Nav.Link as = {Link} to='/about'>About</Nav.Link>
        <Nav.Link as = {Link} to='/image'>Random</Nav.Link>
        <Nav.Link as = {Link} to='/testpage'>Test Page</Nav.Link>
      </Nav>
    </Navbar>

  );
};

export default App;
