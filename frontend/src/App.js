import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import MainNavigation from "./components/Navigation/MainNavigation";

import AuthContext from "./context/auth-context";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  signin = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
    });
  };
  signout = () => {
    this.setState({
      token: null,
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              signin: this.signin,
              signout: this.signout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/events" component={EventsPage} />
                {!this.state.token && <Redirect to="/auth" exact />}
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
