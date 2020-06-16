Viral Clean
=========

## Table of contents
* [Project Description](#project-description)
* [Screenshots](#screenshots)
* [Project Link](#project-link)
* [Installation](#installation)
* [Dependencies](#dependencies)

## Project Description
Viral Clean is an advertisment (buy/sell) website that targets the redistribution of cleaning supplies and personal hygiene items. The website promotes users to create listings for the items they want to sell, as well as to browse other people's listings. Other features of the website include filtering the listings by name, price and city and messaging between users.

Viral Clean was done as a midterm project for Lighthouse Labs Web Development Bootcamp.

## Project Link
[Viral Clean](https://viral-clean.herokuapp.com/login/3)

## Screenshots
#### Home page
![Home page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/home-page.png?raw=true)
#### All items page
![All items page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/all-items.png?raw=true)
#### Favourites page
![Favourites page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/favourites.png?raw=true)
#### My listings page
![My listings page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/my-listings.png?raw=true)
#### Create new listing page
![Create new listing page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/create-listing.png?raw=true)
#### Messages page
![Messages page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/messages.png?raw=true)
#### Message thread page
![Message thread page](https://github.com/Lucas-Wong99/viral-clean/blob/master/docs/message-thread.png?raw=true)

## Installation

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
6. Run the server: `npm run local`
7. Visit `http://localhost:8080/`


## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
