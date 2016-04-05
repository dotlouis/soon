import express from 'express';

let ChainRouter = express.Router();

// we don't expose the chain model for now
// the user only directly manipulate events

export default ChainRouter;
