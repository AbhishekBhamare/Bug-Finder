import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute'
import Login from './components/login'
import SignUp from './components/signup'
import MyProject from './components/MyProject';
import Navbar from './components/Navbar';

function App() {
    return ( 
    <Router>
    <Switch>
      <Route exact path="/navbar"> 
        <ProtectedRoute  Component={Navbar} />
     </Route>

      <Route exact path="/login" component={Login}/>
      <Route exact path="/" component={SignUp}/>
      <Route exact path="/myproject" component={MyProject}/>
      
    </Switch>
  </Router>  
  );

 }

export default App;
 