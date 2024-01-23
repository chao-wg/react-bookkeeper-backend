import express from 'express';
import sessionRouter from './Session.js';
import validationController from './ValidationController.js';
import userInfo from './UserInfo.js';
import tagsActions from './Tags.js';
import cors from "cors";

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors()); // Use cors middleware to allow cross-origin requests

//
app.use('/api/v1/session', sessionRouter);
app.use('/api/v1/validation_codes', validationController);
app.use('/api/v1/me', userInfo);
app.use('/api/v1/tags', tagsActions);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
