import { PINATA_CREDS } from './config.js';
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream';


const pinata = new pinataSDK(PINATA_CREDS);


export async function pinataUpload(file, name) {

  const options = {
    pinataMetadata: {
        name: name,
        keyvalues: {
            uploadedBy: 'SMMP API'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
  };

  const stream = Readable.from(file.data)
  
  try {

    return await pinata.pinFileToIPFS(stream, options)
  
  } catch (err) {
    console.log(err);
    return undefined
  }
}