import React, { Component } from "react";

import BookingsList from "../components/Bookings/BookingsList";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingsPage extends Component {
  state = {
    bookings: [],
    isLoading: false
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    try {
      this.setState({ isLoading: true });

      const requestBody = {
        query: `
        query {
          bookings {
            _id
            event {
              _id
              title
              date
            }
          }
        }
      `,
      };

      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Unable to retrieve bookings");
      }

      const resData = await response.json();
      const bookings = resData.data.bookings;
      this.setState({ bookings: bookings, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
      throw err;
    }
  };

  cancelBookingHandler = async bookingId => {
    try {
      this.setState({ isLoading: true });

      const requestBody = {
        query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
            }
          }
        `,
      };

      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to cancel bookings");
      }

      const resData = await response.json();
      this.setState(prevState => {
        const updatedBooking = prevState.bookings.filter(booking => booking._id != bookingId);
        return { bookings: updatedBooking, isLoading: false }
      });
    } catch (err) {
      this.setState({ isLoading: false });
      throw err;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ?
          (<Spinner />) :
          (<BookingsList bookings={this.state.bookings} onCancel={this.cancelBookingHandler} />)
        }
      </React.Fragment>
    )
  }
}

export default BookingsPage;
