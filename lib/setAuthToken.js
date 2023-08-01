import axios from 'axios';
import 'dotenv/config';

export default async function setAuthToken () {
    delete axios.defaults.headers.common['Authorization'];

    const {data} = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'client_credentials',
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
    }, {
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
        },
    }).catch(function (error) {
        console.log(error);
    })

    //set authtoken to be included in all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
}