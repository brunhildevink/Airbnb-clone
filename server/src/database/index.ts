import { MongoClient } from "mongodb";
import { Database } from "../lib/types";
import * as dotenv from "dotenv";

dotenv.config();

const url = `mongodb+srv://${process.env.USER_USERNAME}:${process.env.USER_PASSWORD}@${process.env.CLUSTER}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("main");

  return {
    listings: db.collection("test_listings"),
  };
};
