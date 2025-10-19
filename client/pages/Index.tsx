import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Lock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-800 backdrop-blur-sm bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">Entropy</span>
          </div>
          <Button
            onClick={() => navigate("/demo")}
            variant="outline"
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
          >
            Try Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">
                Quantum-Safe Edge AI Security
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Real-Time Threat Detection
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              AI-powered security that detects DDoS attacks, malware, and fraud
              in milliseconds. Powered by quantum-safe encryption and edge AI
              intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/demo")}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 text-base h-12 px-8"
              >
                Launch Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800/50 text-base h-12 px-8"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {/* DDoS Detection */}
            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-lg p-8 hover:border-cyan-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-lg transition-all"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-cyan-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-400/20 transition-all">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">DDoS Detection</h3>
                <p className="text-sm text-slate-400 mb-4">
                  ML-powered detection of SYN floods, UDP amplification, and
                  HTTP floods with 1-5ms latency.
                </p>
                <div className="flex items-center text-cyan-400 text-sm">
                  <span>Real-time monitoring</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Malware Analysis */}
            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-lg p-8 hover:border-blue-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-lg transition-all"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-400/20 transition-all">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Malware Analysis</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Multi-layered detection combining static, dynamic, and entropy
                  analysis with behavioral sandboxing.
                </p>
                <div className="flex items-center text-blue-400 text-sm">
                  <span>Advanced scanning</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Fraud Detection */}
            <div className="group relative bg-slate-900/50 border border-slate-800 rounded-lg p-8 hover:border-purple-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-lg transition-all"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-400/20 transition-all">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fraud Detection</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Anomaly detection for transaction velocity, impossible travel,
                  and merchant category anomalies.
                </p>
                <div className="flex items-center text-purple-400 text-sm">
                  <span>Transaction safety</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-20 border-t border-slate-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">1-5ms</div>
              <p className="text-sm text-slate-400">Detection Latency</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">99%+</div>
              <p className="text-sm text-slate-400">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                Quantum
              </div>
              <p className="text-sm text-slate-400">Safe Encryption</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                3 Types
              </div>
              <p className="text-sm text-slate-400">Threat Detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Raw Data Collection
                </h3>
                <p className="text-slate-400">
                  System collects real-time network data, file signatures, and
                  transaction metadata from edge nodes.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">ML Inference</h3>
                <p className="text-slate-400">
                  Advanced ML models analyze multiple feature vectors
                  simultaneously for pattern recognition and anomaly detection.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-400/20 flex items-center justify-center text-purple-400 font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Quantum-Safe Encryption
                </h3>
                <p className="text-slate-400">
                  Results are secured using ML-KEM lattice-based encryption and
                  SLH-DSA signatures—resistant to quantum attacks.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-400/20 flex items-center justify-center text-pink-400 font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Automated Response
                </h3>
                <p className="text-slate-400">
                  System makes BLOCK/ALLOW decisions in milliseconds with full
                  explainability and confidence scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Experience Quantum-Safe Security
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Test our threat detection engine with real attack simulations. See
            how AI protects against modern threats.
          </p>
          <Button
            onClick={() => navigate("/demo")}
            size="lg"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 h-12 px-8"
          >
            Launch Interactive Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>Entropy • Quantum-Safe Edge Security Platform</p>
          <p className="text-sm mt-2">
            NIST-Approved ML-KEM & SLH-DSA Encryption
          </p>
        </div>
      </footer>
    </div>
  );
}
