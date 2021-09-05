require("dotenv").config();
const axios = require('axios');
const { google } = require('googleapis');

const CLOUD_FUNCTION_URL = `https://europe-west3-test.cloudfunctions.net/endpoint`;

// Google Service Account to JWT Token to authenticate Cloud function
let jwtClient = new google.auth.JWT(
    process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    null,
    process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    process.env.SERVICE_ACCOUNT_AUDIENCE
);


(async function () {
    try {
        const _token = await jwtClient.authorize();
        console.log(_token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_token.id_token}`
        }
        const { data } = await axios.get(CLOUD_FUNCTION_URL, {
            headers: headers
        });

        return data;

    } catch (error) {
        console.error(error);
    }
})();
