// imports
import express from 'express'; // Import Express
import mongoose from 'mongoose'; // Import Mongoose
 
import { UrlEntry } from './urlEntry'; // Contains 'urlEntrySchema' function
import { createFullUrl, isValidUrl } from './url-utils'; // Contains 'isValidUrl' and 'createFullUrl' functions
import { getShortCode, isDuplicate, insertNew } from './mongo-utils'; // Contains 'getShortCode', 'isDuplicate', and 'insertNew' functions

// We're using NodeJS Promises as Mongoose Promises are now outdated
mongoose.Promise = global.Promise;
 
export const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlShortener');

// Check if shortCode is a number and if there is a current entry in the DB with that numeric code
app.get('/:shortCode', (req, res) => {
  let shortCode = parseInt(req.params.shortCode);
  if (isNaN(shortCode)) {
    // Throw error if shortCode is not numeric
    res.status(200).json({ error: 'URL shortCode must be a number.' })
  } else {
    UrlEntry.findOne({ shortCode }).then(doc => {
      if (!doc) {
        res.status(404).json({ error: 'Page not found' });
      } else {
        res.redirect(doc.original);
      }
    });
  }
});
 
// User path params to send data through to endpoint handler. We used a wildcard instead of fixed/named path parms
app.get('/new/*', (req, res) => {
  let url = req.params[0];
  if (isValidUrl(url)) {
    isDuplicate(url).then(exists => {
      if (exists) {
        // Throw error if URL already exists in DB
        res.status(500).json({ error: 'The URL already exists in our database.', shortCode: exists });
      } else {
        // If URL does not yet exist in the DB, add the URL to the DB and shorten it
        insertNew(url).then(inserted => {
          res.status(200).json({ message: 'The URL was successfully shortened', url: createFullUrl(req, inserted.shortCode) });
        });
      }
    });
  } else {
    // Throw error if input URL does not meed required format
    res.status(500).json({ error: 'Invalid URL format. Input URL must comply to the following format: http(s)://(www.)domain.ext(/)(path)'});
  }
});