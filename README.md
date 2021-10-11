## SUM TravelShare App

Use the App here: </br> 
[SUM TravelShare](https://sumtravelshare.herokuapp.com)

## DESCRIPTION

An app for sharing expenses among friends during trips. The user can create trips, add other users to them and create new expenses. The application will share the expense among the other users, making it simple and easy to track and divide costs. Additionally, the user can search for countries and find useful information about their next destination.

## USER STORIES

Homepage - As a user you want to be able to sign-up, log-in & access your profile, search for destinations and create new trips.

Sign up - As a user you want to sign up so you can have access to all the functionalities of the application.

Login - As a user you want to log in easily by just typing your username and password.

Profile - As a user you want to access your profile and see your details.

Trips - you can see your trips,  create new trips with other users and share costs

Explore - you can check information about your trip destination 

Logout - As a user you want to be able to log out from the webpage so that you can make sure no one will access your account.

404 - As a user you want to see a nice #404 page in case the page doesn't exist.

## MVP

1. Wireframe
2. Navigation / user flow
3. Models
   Populate
   Schema
4. Routes
5. Views
   Partials
   Lay-out
   pages
6. External API
7. Log-in/log-out/Sign-up
8. Edit, add, delete options
9. Search bar

## BACKLOG

1. Add friends (send/accept friend request)
2. Add another API to get the updated exchange rate for different currencies around the world.
3. Edit and delete profile
4. Add pay button to settle balances
5. Improve UX/UI implementation (add responsiveness for mobile users)
6. Add Favicon
7. Upload a trip image and display it in the trip page as background
8. Add error pages

## ROUTES

//Index
- GET / 
  - renders the homepage

//Auth
- GET /auth/signup
  - redirects to /private/profile if user is logged in
  - renders the signup form
- POST /auth/signup
  - redirects to /private/profile if user is logged in
  - body:
    - username
    - email
    - password
- GET /auth/login
  - redirects to /private/profile if user logged in
  - renders the login page
- POST /auth/login
  - redirects to /private/profile if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: 
  - render the Homepage

//Private profile
- GET /private/profile 
    - renders user profile

//Private trips
- GET /private/trips
  - renders all the trips of the current user
- GET /private/trips/country
  - opens form to search for a country destination  
- POST /private/trips/country
  - displays the results of a country search   
- GET /private/trips/:id
  - renders a specific trip details
- GET /private/trips/add
  - opens form to add a new trip
- POST /private/trips/add
  - creates new trip 
- GET /private/trips/:id/edit
  - opens form to edit a trip
- POST /private/trips/:id/edit
  - updates the edited trip
- POST /private/trips/:id/delete
  - deletes a specific trip

//Private expenses
- GET /private/expenses/:id
  -renders details of an expense
- GET /private/expenses/:id/add
  - opens form to create a new expense in a trip
- POST /private/expenses/:id/add
  - creates new expense
- GET /private/expenses/:id/edit
  - opens form to edit an expense
- POST /private/expenses/:id/edit
  - updates the edited expense
- POST /private/expenses/:id/delete
  - deletes an expense

## MODELS

1. User
    username: String,
    password: String,
    email: String

2. Trip
    name: String,
    description: String,
    imageUrl: String,
    participants: [Schema.types.ObjectId],
    expenses: [Schema.types.ObjectId],
    totalExpenses: Number

3. Expense
    description: string,
    category: string,
    cost: Number,
    user: Schema.types.ObjectId,
    trip: Schema.types.ObjectId,
    contributors: [Schema.types.ObjectId],
    partialCost: Number

4. Balance
    user: Schema.types.ObjectId,
    trip: Schema.types.ObjectId,
    amount: Number

## Additional Links

Link to the Figma UX/UI design: https://www.figma.com/file/9qk32Zo78RMOK373VoHJig/Web-Dev-Collaboration-%7C-Group-8%3A-Iona%2C-Anna%2C-Iulia?node-id=2%3A3

Link to the application: https://sumtravelshare.herokuapp.com

Link to the project presentation: https://docs.google.com/presentation/d/109dgSeHBmhRZRcwdOvpDNyZQjnavhtgI9-W67PcOozc/edit?usp=sharing

Ling to the GitHub repository: https://github.com/OsvaldoPicazo/TravelShare

