import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './About.js';
import Home from './Home.js';

function App() {
  return (
    <Router>
      <div>
          <ui>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ui>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
