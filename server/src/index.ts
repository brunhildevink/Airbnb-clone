import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const mount = async (app: Application) => {
  const db = await connectDatabase();

  // mock response needed for image uploader
  app.post("/statusDone", function (_req, res) {
    res.send({ status: "done" });
  });

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({ app, path: "/api" });

  app.use(express.json());

  app.listen(process.env.PORT);

  console.log(`[app]: http://localhost:${process.env.PORT}`);
};

mount(express());
