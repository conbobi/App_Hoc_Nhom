import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject('6776a13700221a084166'); // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const bucketId = '67774e8f000357f40e88'; // Your bucket ID

export { client, account, databases, storage, bucketId };