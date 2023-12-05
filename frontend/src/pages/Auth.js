import React, { Component } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isSignin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isSignin: !prevState.isSignin };
    });
  };

  submitHandler = async (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          signin(userInput: {email: "${email}", password: "${password}"}) {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!this.state.isSignin) {
      requestBody = {
        query: `
          mutation {
            signup (userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    }

    const response = await fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Sign up failed");
    }

    const parsedResponse = await response.json();
    if (this.state.isSignin) {
      this.context.signin(
        parsedResponse.data.signin.token,
        parsedResponse.data.signin.userId,
        parsedResponse.data.signin.tokenExpiration
      );
    }
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isSignin ? "Signup" : "Signin"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
