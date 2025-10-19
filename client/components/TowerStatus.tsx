import { Badge } from "@/components/ui/badge";

interface Tower {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  threatLevel: number;
}

interface TowerStatusProps {
  towers: Tower[];
  attackedTowerId?: string;
}

function getTowerStatusColor(threatLevel: number) {
  if (threatLevel < 30)
    return "bg-green-400/20 text-green-300 border-green-400/50";
  if (threatLevel < 60)
    return "bg-yellow-400/20 text-yellow-300 border-yellow-400/50";
  if (threatLevel < 80)
    return "bg-orange-400/20 text-orange-300 border-orange-400/50";
  return "bg-red-400/20 text-red-300 border-red-400/50";
}

function getTowerStatusLabel(threatLevel: number) {
  if (threatLevel < 30) return "SECURE";
  if (threatLevel < 60) return "ALERT";
  if (threatLevel < 80) return "WARNING";
  return "CRITICAL";
}

export function TowerStatus({ towers, attackedTowerId }: TowerStatusProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">
        5G Edge Network Status
      </h4>
      {towers.map((tower) => (
        <div
          key={tower.id}
          className={`p-3 rounded-lg border transition-all ${
            tower.id === attackedTowerId
              ? "bg-red-400/10 border-red-400/50"
              : "bg-slate-800/50 border-slate-700/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  tower.threatLevel < 30
                    ? "bg-green-400"
                    : tower.threatLevel < 60
                      ? "bg-yellow-400"
                      : tower.threatLevel < 80
                        ? "bg-orange-400"
                        : "bg-red-400"
                } ${tower.id === attackedTowerId ? "animate-pulse" : ""}`}
              ></div>
              <div>
                <p className="text-sm font-medium text-white">{tower.name}</p>
                <p className="text-xs text-slate-400">
                  {tower.latitude.toFixed(2)}°, {tower.longitude.toFixed(2)}°
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-slate-400">Threat Level</p>
                <p className="text-sm font-semibold">{tower.threatLevel}/100</p>
              </div>
              <Badge
                className={`border ${getTowerStatusColor(tower.threatLevel)}`}
              >
                {getTowerStatusLabel(tower.threatLevel)}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
