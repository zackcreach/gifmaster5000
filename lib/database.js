import { Client } from "pg";

// Client looks for PG* configuration variables in process.env
const client = new Client();

client.connect();

export default client;
