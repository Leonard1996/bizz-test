# Trip Management API

Start the application by:

1. creating .env file, just copy the .env example and edit the API_KEY=
2. run in the terminal docker compose up -d after starting docker or docker desktop locally
3. for testing, which is later explained in details, run npm i --legacy-peer-deps locally

Core tech stack is NodeJs, Express, Typescript, TypeOrm, MySql, Redis, Docker, PM2

There are 4 APIs as required, they are briefly explained in this readme file but you can also upload postman.json in postman, the file is located in the root directory of the project

Entry point is app.ts and the request then jumps through controllers(there is no routing file), middlewares and then services. The entities folder keeps the TS Class equivalent of the DB tables, which are kept in sync by the files in the migration directory. Common folder includes a couple of types and constants that are for general use through the whole project

Error Handling is done by a global middleware in the middlewares folder, which handles http errors such as 404 and such, for errors that the developer might need to throw. ex( Database conflict duplicate key), the CustomError.ts file has a an error extension which can be thrown with custom message and code and finally everything else that is not accounted for is simply thrown as a 500 error to the client. I chose this over try catch as I think it is a nice minimal solution for this kind of app, if you want super fined grained controler over errors, maybe try catch would be more suitable

Testing is done by vitest. I started with jest but for some reason I had some issues with imports of node core modules such as fs, node:url etc. For middlewares I used unit testing, and for API's I used unit testing with sqlite in memory db. I did not include any tests for the /trips/search api that calls the third party api, if I would have, I would have used unit testing and mocked it as there is no reason to hit the external api and exhaust our API_KEY rate limit. For testing you can go inside docker shell as well of node_app but I would suggest to npm i --legacy-peer-deps and just run npm test.

Docker is used to containerize the app, start mysql, redis and then run pm2 max processes for the node app, pm2 will also do load balancing of requests between the processes.

Final Notes
I thought about enhacing the APIs a bit with rate limiting, but then again I think I have added enough features on top of basic requirments and do not want to go beyond the scope of a "test application".
Also I did not test the /trips/search api as it would need a lot of mocking boilerplate code.

**GET** `/trips/search`  
Retrieves trips from third-party providers based on search criteria.

#### Query Parameters

| Name          | Type   | Required | Description                            |
| ------------- | ------ | -------- | -------------------------------------- |
| `origin`      | string | Yes      | IATA code of the origin airport        |
| `destination` | string | Yes      | IATA code of the destination airport   |
| `sort_by`     | string | No       | Sorting method (`cheapest`, `fastest`) |

**POST** `/trips`  
Creates a new trip.

#### Request Body (JSON)

```json
{
  "origin": "SYD",
  "destination": "GRU",
  "cost": 625,
  "duration": 5,
  "type": "flight",
  "display_name": "from SYD to GRU by flight"
}
```

**DELETE** `/api/trips/:tripId`

Deletes a specific trip by its ID.

#### URL Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| tripId    | string | ID of the trip to delete |

**GET** `/trips`

Fetches a list of trips with pagination

#### Query Parameters (optional)

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| limit     | number | Number of trips to return |
| offset    | number | Number of trips to skip   |
