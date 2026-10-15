import express from "express";
import cors from "cors";
import path from "path";

import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

if (ENV.FRONTEND_URL) {
  app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
}
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);    // 3. request backend with the data from frontend 

if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendDistPath, "index.html"));
      return;
    }

    next();
  });
}

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
