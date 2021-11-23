import React from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from './services/Firebase'
import Login from './views/Login'
import Home from './views/Home'
import Lojas from './views/Lojas'
import LojasLista from './views/LojasLista'
import Menu from './components/Menu'


function App() {

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return <Route
      {...rest}
      render={props => isAuthenticated() ? (
        <>
          <Menu />
          <Component {...props} />
        </>
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
      }
    />
  }



  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact={true} component={Login} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/lojas" component={Lojas} />
        <PrivateRoute path="/lojaslista" component={LojasLista} />
        
        <Route path="*" component={Login} />
      </Switch>
    </HashRouter>
  );
}

export default App;
