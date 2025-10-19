/**
 * Shared API Types
 * Used by both frontend and backend
 */

export interface DemoResponse {
  message: string;
}

export interface ThreatAnalysisResult {
  isAttack: boolean;
  threatScore: number;
  confidence: number;
  reasoning: string[];
  analysis?: Record<string, unknown>;
  timestamp: string;
}

export interface ThreatDecision {
  action: "BLOCK" | "ALLOW";
  threatScore: number;
  confidence: number;
  reasoning: string[];
  encryptionUsed: string;
  latency: string;
}

export interface AnalysisResult {
  analysis: ThreatAnalysisResult;
  decision: ThreatDecision;
  encrypted: {
    algorithm: string;
    encryptionTime: string;
    keySize: string;
    securityLevel: string;
    nodeTarget?: string;
    status: string;
  };
  timestamp: string;
}

export interface DDoSAttackData {
  requestsPerSecond?: number;
  sourceIPs?: { unique?: number };
  packetSize?: number;
  packetSizeVariance?: number;
  protocol?: string;
}

export interface MalwareData {
  fileSignature?: string;
  entropy?: number;
  fileSize?: number;
  behaviorFlags?: string[];
}

export interface TransactionData {
  amount?: number;
  location?: { impossibleTravel?: boolean };
  timeOfDay?: number;
  category?: string;
  deviceFingerprintChanged?: boolean;
  velocityCheck?: {
    transactionsInLastHour?: number;
    cardsUsedInLastHour?: number;
  };
  historicalPattern?: {
    avg?: number;
    usualTimes?: number[];
    usualCategories?: string[];
  };
}