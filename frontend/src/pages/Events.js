import React, { Component } from "react";

import "./Events.css";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  fetchEvents = async () => {
    try {
      this.setState({ isLoading: true })
      const requestBody = {
        query: `
        query {
          events {
            _id
            title
            description
            price
            date
            createdBy {
              _id
              email
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
      const events = resData.data.events;
      this.setState({ events: events, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
      throw err;
    }

  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  confirmCreateEventHandler = async () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            price
            date
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
      throw new Error("Creation failed");
    }

    const resData = await response.json();

    this.setState(prevState => {
      const updatedEvents = [...prevState.events]
      updatedEvents.push({
        _id: resData.data.createEvent._id,
        title: resData.data.createEvent.title,
        description: resData.data.createEvent.description,
        price: resData.data.createEvent.price,
        date: resData.data.createEvent.date,
        createdBy: {
          _id: this.context.userId,
        }
      });
      return { events: updatedEvents };
    });
  };

  bookEventHandler = () => { }

  onViewDetailsHandler = (eventId) => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    })
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.confirmCreateEventHandler}
            confirmText="Create"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                ></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  id="description"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText="Book"
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ?
          (<Spinner />) :
          (<EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetails={this.onViewDetailsHandler}
          />)
        }

      </React.Fragment>
    );
  }
}

export default EventsPage;
