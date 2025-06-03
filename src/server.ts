// Imports
import express from "express";
import authRouter from "./routes/auth";
import spaceRouter from "./routes/space";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/auth", authRouter);
app.use("/space",spaceRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server Starting at Port : ${process.env.PORT}`);
});
