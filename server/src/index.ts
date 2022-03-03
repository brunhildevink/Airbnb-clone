import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import cookieParser from "cookie-parser";
import compression from "compression";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  // mock response needed for image uploader
  app.post("/statusDone", function (_req, res) {
    res.send({ status: "done" });
  });

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());
  app.use(express.static(`${__dirname}/client`));
  app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

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
