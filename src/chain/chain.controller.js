import express from 'express';
import Event from './chain.model';

let router = express.Router();

// we don't expose the chain model for now
// the user only directly manipulate events

export default router;
