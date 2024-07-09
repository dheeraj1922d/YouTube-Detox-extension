const express = require('express')
const Router = express.Router();
const { getPreferences, savePreferences , deletePreferences} = require('../controllers/Preference')

Router.post('/preferences', savePreferences);
Router.get('/preferences/:email', getPreferences);
Router.delete('/delete/:email', deletePreferences);

module.exports = Router