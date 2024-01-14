# Bookings web app

This web application uses GraphQL to handle all API calls, it's written in Node.Js using the express framework and MongoDB's Atlas as its object database.

The GraphQL schema is structured as follows

## Queries

<pre>
signin(email, password): AuthData! | performs the user sign in and returns a JWT
events: [Event!]                   | returns an array of available events
bookings: [Booking!]               | returns an array of all bookings made by the user
</pre>

## Mutations

<pre>
signup(email, password): User!     | creates a user account and returns the created user information
createEvent(eventInput): Event!    | creates an event and returns it's information
bookEvent(eventId): Booking!       | books an event for the logged in user and returns the booking information
cancelBooking(bookingId): Event!   | cancels a booking made by the logged in user and return the corresponding event information
</pre>


## Setup and execute

### Backend server

- To set up the backend dependencies, execute npm install on the root directory
- To start the server (listens to port 8000), execute `npm start`

### frontend application

- navigate to the `/frontend` directory
- To set up the web app dependencies, execute npm install
- To start the web application, execute `npm start`

