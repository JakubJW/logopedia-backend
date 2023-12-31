import 'dotenv/config'
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose';

import router from "./router";

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.APP_FRONTEND_URL
}));

app.use(compression());
app.use(bodyParser.json());
app.use('/', router());

const server = http.createServer(app);

server.listen(8080, () => console.log('Server running on http://localhost:8080/'))

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
