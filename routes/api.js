const express = require('express');
const router = express.Router();
const {getProfileInformation, webhook} = require('../controller/WebhookController');


router.post('/profile', getProfileInformation);
router.post('/webhook', webhook);


module.exports = router;
