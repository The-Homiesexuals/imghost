import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './About.js'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ui>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ui>
        </nav>

        <Switch>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>
}

function AboutPage() {
  return About()
}
export default App;
