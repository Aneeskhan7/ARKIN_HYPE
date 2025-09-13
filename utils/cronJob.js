/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable node/no-missing-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');
// eslint-disable-next-line import/extensions
const User = require('../models/userModel');

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        // Find all users and reset their reviewsAllowed to 0
        await User.updateMany({}, { reviewsAllowed: 0 });
        console.log('Successfully reset review limits for all users');
    } catch (err) {
        console.error('Error resetting review limits:', err);
    }
});
