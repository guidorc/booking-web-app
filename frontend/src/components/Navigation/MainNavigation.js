import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

function MainNavigation(props) {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <div className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Sign in</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
              </ul>
            </div>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
}

export default MainNavigation;
