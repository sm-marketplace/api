import dotenv from 'dotenv';
dotenv.config();
import pinataSDK from '@pinata/sdk';
import util from 'util';

const PINATA_CREDS = {
  pinataApiKey: process.env.PINATA_API_KEY, 
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY 
}
// Use the api keys by specifying your api key and api secret
const pinata = new pinataSDK(PINATA_CREDS);

function printFull(obj) {
  console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}))
}

// pinata.pinList().then((result) => {
//   printFull(result);
// }).catch((err) => {
//   printFull(err);
// });

pinata.pinList({
  hashContains: 'QmRZVAozYgkw3C8zyGAaBQGE81zBV5ekFP7BiTc2Tfw3Gy___'
}).then((result) => {
  printFull(result);
}).catch((err) => {
  printFull(err);
});