import React, { Component } from "react";

import BookingsList from "../components/Bookings/BookingsList";

class BookingsPage extends Component {
  state = {
    bookings: [],
    isLoading: false
  }

  constructor(props) {
    super(props);
  }

  fetchBookings = async () => {
    try {
      this.setState({ isLoading: true })
      const requestBody = {
        query: `
        query {
          bookings {
            _id
            event
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
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Creation failed");
      }

      const resData = await response.json();
      const bookings = resData.data.bookings;
      this.setState({ bookings: bookings, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
      throw err;
    }

  };

  render() {
    return (<div>
      <BookingsList
        bookings={this.state.bookings}
      />
    </div>);
  }
}

export default BookingsPage;
