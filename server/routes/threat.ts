import { RequestHandler } from "express";
import { ThreatAnalyzer } from "../ml-engine";

export const handleDDoSDetection: RequestHandler = (req, res) => {
  try {
    const result = ThreatAnalyzer.analyze({}, "ddos");
    res.json(result);
  } catch (error) {
    console.error("DDoS detection error:", error);
    res.status(500).json({ error: "Failed to analyze DDoS threat" });
  }
};

export const handleMalwareDetection: RequestHandler = (req, res) => {
  try {
    const result = ThreatAnalyzer.analyze({}, "malware");
    res.json(result);
  } catch (error) {
    console.error("Malware detection error:", error);
    res.status(500).json({ error: "Failed to analyze malware threat" });
  }
};

export const handleFraudDetection: RequestHandler = (req, res) => {
  try {
    const result = ThreatAnalyzer.analyze({}, "fraud");
    res.json(result);
  } catch (error) {
    console.error("Fraud detection error:", error);
    res.status(500).json({ error: "Failed to analyze fraud threat" });
  }
};
