// Imports
import express from "express";
import authRouter from "./routes/auth";

const app = express();

// Middlewares
app.use(express.json());

// Routers
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Starting at Port : ${process.env.PORT}`);
});
