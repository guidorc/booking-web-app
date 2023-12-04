import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

function MainNavigation(props) {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <div className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/auth">Sign in</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default MainNavigation;
