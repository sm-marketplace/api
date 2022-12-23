import dotenv from 'dotenv';
dotenv.config();
import pinataSDK from '@pinata/sdk';

const PINATA_CREDS = {
  pinataApiKey: process.env.PINATA_API_KEY, 
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY 
}

// Use the api keys by specifying your api key and api secret
const pinata = new pinataSDK(PINATA_CREDS);

pinata.testAuthentication()
.then(
  (result) => {
    //handle successful authentication here
    console.log(result);
  })
.catch((err) => {
  //handle error here
  console.log(err);
});