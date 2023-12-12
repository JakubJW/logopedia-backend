import express from 'express';
import http from 'http';
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose';

import router from "./router";

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => console.log('Server running on http://localhost:8080/'))

const MONGO_URL = 'mongodb+srv://jakub2115wysocki:9hf3ONYIzlH43teP@cluster0.3zcof1p.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());