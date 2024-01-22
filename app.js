import express from "express";
import helmet from "helmet";
import cors from "cors";
import user from "./src/route/v1/user.route.js";

export default function (database) {
  const app = express()
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());
  app.set('database', database)
  app.use('/v1/user', user);
  app.use((err, req, res) => {
      console.error(err.stack)
      res.status(500).send({ 'error': ' Internal Server Error' })
  })
  return app
}