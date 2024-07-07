import { MongoClient } from "mongodb";

let client;

export const connectToDatabase = async() => {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    console.log(`Connected to MongoDb`);
    return client.db(process.env.MongoDbName);
}

export const disconnectFromDatabase = async() => {
    if (client) {
        await client.close();
        console.log('Disconnected from mongodb');
    }
}