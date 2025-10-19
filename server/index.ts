import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleDDoSDetection,
  handleMalwareDetection,
  handleFraudDetection,
} from "./routes/threat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Threat Detection API routes
  app.post("/api/threat/ddos", handleDDoSDetection);
  app.post("/api/threat/malware", handleMalwareDetection);
  app.post("/api/threat/fraud", handleFraudDetection);

  return app;
}
