import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import AllImages from './AllImages.js';
import Home  from './Home.js';
import ImagePage from './Image.js';
import Search from './Search.js'
import { 
  Navbar,
  Nav,
  Form,
  FormControl,
  Button
} from 'react-bootstrap'
import {Get} from 'react-axios';
import {useState} from 'react';
import axios from 'axios';
const queryString = require('query-string');

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Route exact path = '/' component={Home}/>
        <Route path = '/allimages' component={AllImages}/>
        <Route path = '/image/:imageId' component={ImagePage}/>
        <Route path = '/search' component={Search}/>
        <Route path = '/random' component={Random}/>
      </div>
    </Router>
  );
}

function Header() {
  const[search,setSearch] = useState("");
  const[qString,setqString] = useState("");
  const[res,setRes] = useState("");
  const history = useHistory();

  return (
    <Navbar 
      style={{color: '#F8F8F8'}}
      className="navStyle"  variant="dark" sticky='top'>
      <Navbar.Brand as = {Link} to='/'>
        <img
          style={{marginRight:10}}
          src={process.env.PUBLIC_URL + '/ghost-inverted.png'}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=''
        />
        ImGhost
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as = {Link} to='/allimages'>All Images</Nav.Link>
        <Nav.Link as = {Link} to='/random'>Random</Nav.Link>
      </Nav>
      <Form inline onSubmit={async event=> {
          event.preventDefault();
          const [qs,r] = await Search_Images(search);
          setSearch("")
          history.push({
            pathname:'/search',
            search: '?'+qs,
            state : { images: r}
          })}}>
        <FormControl type="text" placeholder="Search Tags" className="mr-sm-2" value={search} onChange={val=> {setSearch(val.target.value);}}/>
        <Button type="submit">Search</Button>
      </Form>
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

async function Search_Images(query) {
  let splitVals = query.split(" ")
  let qString = queryString.stringify({tag:splitVals},{arrayFormat:'index'})
  try {
    let res = await axios({
      method: 'get',
      url: '/search?'+qString,
      response: 'json',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        "Access-Control-Allow-Headers": "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
      }
    });
    return [qString,res.data.images];
  } catch(err) {
    alert("There was a problem fetching the images!")
    console.log(err)
    return "ERROR"
  }

}

export default App;
