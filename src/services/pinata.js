import { PINATA_CREDS } from '../config.js';
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream';

const pinata = new pinataSDK(PINATA_CREDS);


export async function pinataUpload(file, name, metadata) {

  const options = {
    pinataMetadata: {
        name: name,
        keyvalues: {
            uploadedBy: 'SMMP API',
            ...metadata
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
    console.error(err);
    return err
  }
}


export async function testPinataAuth() {

  try {
    return pinata.testAuthentication();

  } catch (err) {

    console.log(err);
    return err
  }
}


export async function getItem(hash) {


  try {
    console.log("Pinata pinList");
    const query = await pinata.pinList({
      hashContains: hash
    });

    const { rows } = query;

    if (rows.length === 0) {
      return undefined
    }

    return rows[0];

  } catch (err) {
    console.error(err);
    return err
  }
}

/**
 * 
 * @param {Object} filters
 * @param {string|undefined} filters.hashContains  string | undefined};
 * @param {string|undefined} filters.pinStart
 * @param {string|undefined} filters.pinEnd
 * @param {string|undefined} filters.unpinStart
 * @param {string|undefined} filters.unpinEnd
 * @param {number|undefined} filters.pinSizeMin
 * @param {number|undefined} filters.pinSizeMax
 * @param {string|undefined} filters.status
 * @param {number|undefined} filters.pageLimit
 * @param {number|undefined} filters.pageOffset
 * @param {PinataMetadataFilter|undefined} filters.metadata
 * @returns {Promise<any>} item
 */
export async function getItems(filters) {

  try {
    const query = await pinata.pinList(filters);

    return query.rows;

  } catch (err) {
    console.error(err);
    return err
  }
}