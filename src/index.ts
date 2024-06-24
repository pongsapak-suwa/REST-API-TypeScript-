import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import comporession from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors({
    credentials: true,
}));

app.use(comporession());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error',(error: Error) => {
    console.log(error);
})

app.use('/',router())