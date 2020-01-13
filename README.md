# Employee_management_REST_API
A Restful API and database for an employee management system



### Heroku API
[Employee_management_REST_API link](https://employeeman.herokuapp.com)

### Documentation of APIs
[Endpoints documentation](https://documenter.getpostman.com/view/5339931/SWLiZ6L5)

## Tools Used

[Javascript](https://javascript.info/) : Language used.

[NodeJS](https://nodejs.org/en/) : Javascript runtime.

[Express](http://expressjs.com/) : NodeJs framework.

[Mocha, Chai and Supertest](https://www.youtube.com/watch?v=MLTRHc5dk6s) : Testing Framework.

[Airbnb](https://github.com/airbnb/javascript) : Javascript style Guide.

[Travis](https://travis-ci.org/) : Continuous Integration.

[nyc](https://github.com/istanbuljs/nyc) : Test coverage.

[Coveralls](https://coveralls.io/) : Git badge.

[Codeclimate](https://codeclimate.com/) : Git badge.

[Heroku](https://www.heroku.com/) : Deployment.

[Postman](https://www.getpostman.com/) : Documentation


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
TO setup the project on your local machine do the following
Install Node
``` npm install node ```

Clone the repo by running

```git clone https://github.com/bihire/Broadcatser.git```

Then install all the necessary dependencies

``` 
npm install 
``` 
or 
``` 
npm i 
```

## Database setup

```
Creata a .env file
```

Export the port number to be accessible in the file

```
{
    port: process.env.PORT || 8080
}
```

## Deployment

* URL = http://localhost:8080
* PORT = 8080


## Run the application

```
npm start
```

## Run tests

```
npm run test
```

## Run coveralls

```
npm run ci
```

## API ENDPOINTS

| Ressource URL | Methods  | Description  |
| ------- | --- | --- |
| / | GET | The index (welcome message) |
| /api/v1/auth/signup | POST | Signup as new Manager |
| /api/v1/auth/signin | POST | Signin a registered manager |
| /api/v1/employees | POST | POST an an employee |
| /api/v1/employees/`employee-id` | PATCH | Edit a specific employee info |
| /api/v1/employees/`employee-id`/activate | PATCH | Update a specific employee's status to activated |
| /api/v1/employees/`red-flag-id`/suspend | PATCH | Update a specific employee's status to suspended|
| /api/v1/employees | GET | Get all the employees |
| /api/v1/employees `?:search` | GET | Get all the matching employees |
| /api/v1/employees/`employee-id` | DELETE | Delete an employee |


## Contributor
- Bihire Jules Boris <muhireboris@yahoo.fr>

---

## License & copyright
Copyright (c) Bihire Jules Boris, Web developer


