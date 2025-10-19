import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Zap,
  Shield,
  Lock,
  ArrowLeft,
  Activity,
  Loader2,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AzerbaijanMap } from "@/components/AzerbaijanMap";
import { TowerStatus } from "@/components/TowerStatus";

// Demo towers for Azercell 5G network
const DEMO_TOWERS = [
  {
    id: "tower-baku",
    name: "Baku Main",
    latitude: 40.3856,
    longitude: 49.892,
    threatLevel: 0,
  },
  {
    id: "tower-ganja",
    name: "Ganja Hub",
    latitude: 40.6831,
    longitude: 46.3604,
    threatLevel: 0,
  },
  {
    id: "tower-sumgait",
    name: "Sumgait Edge",
    latitude: 40.5861,
    longitude: 48.7589,
    threatLevel: 0,
  },
  {
    id: "tower-shaki",
    name: "Shaki Node",
    latitude: 41.1925,
    longitude: 47.1724,
    threatLevel: 0,
  },
  {
    id: "tower-lankaran",
    name: "Lankaran Port",
    latitude: 38.7521,
    longitude: 48.8546,
    threatLevel: 0,
  },
];

interface ThreatAnalysis {
  isAttack: boolean;
  threatScore: number;
  confidence: number;
  reasoning: string[];
  analysis?: Record<string, unknown>;
}

interface AnalysisResult {
  analysis: ThreatAnalysis;
  decision: {
    action: string;
    threatScore: number;
    confidence: number;
    reasoning: string[];
    encryptionUsed: string;
    latency: string;
  };
  timestamp: string;
}

export default function Demo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ddos" | "malware" | "fraud">(
    "ddos",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [towers, setTowers] = useState(DEMO_TOWERS);

  const runAnalysis = async (threatType: "ddos" | "malware" | "fraud") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/threat/${threatType}`, {
        method: "POST",
      });
      const data = (await response.json()) as AnalysisResult;
      setResult(data);

      // Update tower threat levels based on attack type
      const updatedTowers = towers.map((tower) => {
        // Randomly select a tower to be under attack
        if (tower.id === towers[Math.floor(Math.random() * towers.length)].id) {
          return {
            ...tower,
            threatLevel: data.decision.threatScore,
          };
        }
        // Adjacent towers get lower threat levels
        return {
          ...tower,
          threatLevel: Math.max(0, data.decision.threatScore - 30),
        };
      });
      setTowers(updatedTowers);
    } catch (error) {
      console.error("Error running analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const getThreatColor = (score: number) => {
    if (score < 30) return "text-green-400";
    if (score < 60) return "text-yellow-400";
    if (score < 80) return "text-orange-400";
    return "text-red-400";
  };

  const getThreatBgColor = (score: number) => {
    if (score < 30) return "bg-green-400/10 border-green-400/50";
    if (score < 60) return "bg-yellow-400/10 border-yellow-400/50";
    if (score < 80) return "bg-orange-400/10 border-orange-400/50";
    return "bg-red-400/10 border-red-400/50";
  };

  const getThreatLabel = (score: number) => {
    if (score < 30) return "BENIGN";
    if (score < 60) return "SUSPICIOUS";
    if (score < 80) return "HIGH RISK";
    return "CRITICAL";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-800 backdrop-blur-sm bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">Entropy</span>
          </div>
          <div className="text-sm text-slate-400">Interactive Demo</div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Threat Detection Demo</h1>
            <p className="text-slate-300">
              Simulate real-world attacks and see how our AI detects threats in
              real-time.
            </p>
          </div>

          {/* Attack Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* DDoS Tab */}
            <Card
              onClick={() => {
                setActiveTab("ddos");
                setResult(null);
              }}
              className={`cursor-pointer p-6 transition-all ${
                activeTab === "ddos"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">DDoS Attack</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Distributed Denial of Service
                  </p>
                </div>
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• 4500 req/s (4.5x baseline)</p>
                <p>• 47 unique source IPs</p>
                <p>• SYN flood pattern detected</p>
              </div>
            </Card>

            {/* Malware Tab */}
            <Card
              onClick={() => {
                setActiveTab("malware");
                setResult(null);
              }}
              className={`cursor-pointer p-6 transition-all ${
                activeTab === "malware"
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Malware</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Advanced Threat Analysis
                  </p>
                </div>
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• High entropy signature</p>
                <p>• Packed/encrypted binary</p>
                <p>• Behavioral red flags detected</p>
              </div>
            </Card>

            {/* Fraud Tab */}
            <Card
              onClick={() => {
                setActiveTab("fraud");
                setResult(null);
              }}
              className={`cursor-pointer p-6 transition-all ${
                activeTab === "fraud"
                  ? "border-purple-400 bg-purple-400/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Fraud Detection</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Transaction Anomalies
                  </p>
                </div>
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Impossible travel detected</p>
                <p>• $12,450 (15.6x average)</p>
                <p>• Device fingerprint changed</p>
              </div>
            </Card>
          </div>

          {/* Action Button */}
          <div className="text-center mb-12">
            <Button
              onClick={() => runAnalysis(activeTab)}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 h-12 px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Threat...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  Run {activeTab.toUpperCase()} Simulation
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-8 animate-in fade-in">
              {/* Threat Score Card */}
              <Card
                className={`p-8 border-2 ${getThreatBgColor(result.decision.threatScore)}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Threat Analysis Result
                    </h3>
                    <p className="text-sm text-slate-400">
                      Analysis completed at{" "}
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {result.decision.action === "BLOCK" ? (
                    <AlertCircle
                      className={`w-8 h-8 ${getThreatColor(result.decision.threatScore)}`}
                    />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Threat Score */}
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Threat Score</p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${getThreatColor(result.decision.threatScore)}`}
                      >
                        {Math.round(result.decision.threatScore)}
                      </span>
                      <span className="text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Confidence</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-cyan-400">
                        {Math.round(result.decision.confidence)}%
                      </span>
                    </div>
                  </div>

                  {/* Decision */}
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Decision</p>
                    <Badge
                      className={
                        result.decision.action === "BLOCK"
                          ? "bg-red-400/20 text-red-300 border border-red-400/50"
                          : "bg-green-400/20 text-green-300 border border-green-400/50"
                      }
                    >
                      {result.decision.action}
                    </Badge>
                  </div>
                </div>

                {/* Threat Level Label */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <Badge
                    className={`text-base px-4 py-2 font-semibold ${
                      getThreatLabel(result.decision.threatScore) === "BENIGN"
                        ? "bg-green-400/20 text-green-300"
                        : getThreatLabel(result.decision.threatScore) ===
                            "SUSPICIOUS"
                          ? "bg-yellow-400/20 text-yellow-300"
                          : getThreatLabel(result.decision.threatScore) ===
                              "HIGH RISK"
                            ? "bg-orange-400/20 text-orange-300"
                            : "bg-red-400/20 text-red-300"
                    }`}
                  >
                    {getThreatLabel(result.decision.threatScore)}
                  </Badge>
                </div>
              </Card>

              {/* Azercell Network Map Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="p-0 border-slate-800 h-[540px] overflow-hidden flex flex-col">
                    <AzerbaijanMap
                      towers={towers}
                      attackedTowerId={
                        result
                          ? towers[Math.floor(Math.random() * towers.length)].id
                          : undefined
                      }
                    />
                  </Card>
                </div>

                {/* Tower Status Panel */}
                <Card className="p-6 border-slate-800">
                  <TowerStatus
                    towers={towers}
                    attackedTowerId={
                      result
                        ? towers.find(
                            (t) =>
                              t.threatLevel === result.decision.threatScore,
                          )?.id
                        : undefined
                    }
                  />
                </Card>
              </div>

              {/* Reasoning */}
              <Card className="p-8 border-slate-800">
                <h3 className="text-lg font-semibold mb-4">
                  Detection Reasoning
                </h3>
                <div className="space-y-3">
                  {result.decision.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      </div>
                      <p className="text-slate-300">{reason}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Technical Details */}
              <Card className="p-8 border-slate-800">
                <h3 className="text-lg font-semibold mb-4">
                  Technical Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Encryption Method
                    </p>
                    <p className="font-semibold text-cyan-400">
                      {result.decision.encryptionUsed}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Quantum-safe lattice-based encryption
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Analysis Latency
                    </p>
                    <p className="font-semibold text-cyan-400">
                      {result.decision.latency}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Edge AI processing time
                    </p>
                  </div>
                </div>
              </Card>

              {/* Run Again Button */}
              <div className="text-center">
                <Button
                  onClick={() => runAnalysis(activeTab)}
                  variant="outline"
                  size="lg"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Run Another Simulation
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && (
            <Card className="p-12 border-slate-800 text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Click "Run {activeTab.toUpperCase()} Simulation" to see threat
                detection in action
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
