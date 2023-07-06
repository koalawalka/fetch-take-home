# Take Home Assignment for Fetch
## Description
This implements the take home assignment detailed [here](https://github.com/fetch-rewards/receipt-processor-challenge#rules). This application uses [NestJS](https://docs.nestjs.com) which is a NodeJS framework written in typescript.

## Running the app
The application can be run through docker using the following commands.
```bash
# build the image
$ docker build --tag "nestjs-app" .

# run the docker image on port 3000 with the name jeff-fetch-take-home
$ docker run -d --name jeff-fetch-take-home -p 3000:3000 nestjs-app
```

When this is running, you can now access the APIs through http://localhost:3000/receipts/process and http://localhost:3000/receipts/:id/points.


## Test
In the terminal of the docker container you can run the unit tests. In order to run the tests in the docker terminal you'll need the docker container id (after it's been started following the above commands) by doing:
```
$ docker ps
```
Which should return something like the below
```
ONTAINER ID   IMAGE        COMMAND                  CREATED         STATUS         PORTS                    NAMES
a304c33a1ce0   nestjs-app   "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes   0.0.0.0:3000->3000/tcp   myapp
```

Take the `CONTAINER ID` and run the following command to get into the terminal of the running container
```
$ docker exec -it <CONTAINER ID> sh
```
You are now in the container's terminal and can run the tests like below:

```bash
# unit tests
$ npm run test
```
