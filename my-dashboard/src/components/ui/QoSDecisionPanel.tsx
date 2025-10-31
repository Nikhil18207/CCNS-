"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Brain, TrendingUp, Shield, AlertTriangle, ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface QoSDecision {
  id: string
  type: "prediction" | "enforcement" | "alert"
  application: string
  confidence: number
  priority: "High" | "Medium" | "Low"
  direction: "uplink" | "downlink" | "balanced"
  timestamp: string
  trend: number[]
  status: "success" | "warning" | "info"
}

const applications = [
  { name: "Netflix", priority: "Medium" as const, qos: "High Throughput" },
  { name: "Amazon Prime", priority: "Medium" as const, qos: "High Throughput" },
  { name: "Google Meet", priority: "High" as const, qos: "Low Latency" },
  { name: "Microsoft Teams", priority: "High" as const, qos: "Low Latency" },
  { name: "Metaverse/Roblox", priority: "High" as const, qos: "Ultra-Low Latency" },
  { name: "GeForce Gaming", priority: "High" as const, qos: "Ultra-Low Latency" }
]

const directions: Array<"uplink" | "downlink" | "balanced"> = ["uplink", "downlink", "balanced"]

export default function QoSDecisionPanel() {
  const [decisions, setDecisions] = useState<QoSDecision[]>([])
  const [mlAccuracy, setMlAccuracy] = useState(94.5)

  useEffect(() => {
    // Initialize decisions
    const initialDecisions: QoSDecision[] = Array.from({ length: 5 }, (_, i) => {
      const app = applications[Math.floor(Math.random() * applications.length)]
      return {
        id: `decision-${Date.now()}-${i}`,
        type: i % 3 === 0 ? "alert" : i % 3 === 1 ? "enforcement" : "prediction",
        application: app.name,
        confidence: Math.random() * 20 + 80,
        priority: app.priority,
        direction: directions[Math.floor(Math.random() * directions.length)],
        timestamp: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
        trend: Array.from({ length: 10 }, () => Math.random() * 100),
        status: i % 3 === 0 ? "warning" : i % 3 === 1 ? "success" : "info"
      }
    })
    setDecisions(initialDecisions)

    // Simulate real-time ML decisions
    const interval = setInterval(() => {
      setDecisions(prev => {
        const app = applications[Math.floor(Math.random() * applications.length)]
        const newDecision: QoSDecision = {
          id: `decision-${Date.now()}-${Math.random()}`,
          type: Math.random() > 0.7 ? "alert" : Math.random() > 0.5 ? "enforcement" : "prediction",
          application: app.name,
          confidence: Math.random() * 20 + 80,
          priority: app.priority,
          direction: directions[Math.floor(Math.random() * directions.length)],
          timestamp: new Date().toLocaleTimeString(),
          trend: Array.from({ length: 10 }, () => Math.random() * 100),
          status: Math.random() > 0.7 ? "warning" : Math.random() > 0.5 ? "success" : "info"
        }
        
        return [newDecision, ...prev.slice(0, 6)]
      })

      // Update ML accuracy
      setMlAccuracy(prev => Math.min(99, Math.max(85, prev + (Math.random() - 0.5) * 2)))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: QoSDecision["type"]) => {
    switch (type) {
      case "prediction": return <Brain className="h-4 w-4" />
      case "enforcement": return <Shield className="h-4 w-4" />
      case "alert": return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: QoSDecision["status"]) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-yellow-500"
      case "Low": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getDirectionIcon = (direction: "uplink" | "downlink" | "balanced") => {
    switch (direction) {
      case "uplink": return <ArrowUp className="h-3 w-3" />
      case "downlink": return <ArrowDown className="h-3 w-3" />
      case "balanced": return <ArrowLeftRight className="h-3 w-3" />
    }
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">ML Classification Engine</h2>
        </div>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          {mlAccuracy.toFixed(1)}% Accuracy
        </Badge>
      </div>

      {/* ML Model Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <div className="text-xs text-muted-foreground mb-1">Predictions</div>
          <div className="text-xl font-bold text-blue-600">
            {decisions.filter(d => d.type === "prediction").length}
          </div>
        </div>
        <div className="bg-linear-to-br from-green-500/10 to-green-500/5 rounded-lg p-3 border border-green-500/20">
          <div className="text-xs text-muted-foreground mb-1">Enforced</div>
          <div className="text-xl font-bold text-green-600">
            {decisions.filter(d => d.type === "enforcement").length}
          </div>
        </div>
        <div className="bg-linear-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg p-3 border border-yellow-500/20">
          <div className="text-xs text-muted-foreground mb-1">Alerts</div>
          <div className="text-xl font-bold text-yellow-600">
            {decisions.filter(d => d.type === "alert").length}
          </div>
        </div>
      </div>

      {/* Decisions List */}
      <div className="flex-1 overflow-auto space-y-3">
        {decisions.map((decision) => (
          <div
            key={decision.id}
            className={`rounded-lg p-3 border transition-all animate-in fade-in slide-in-from-right-2 duration-300 ${getStatusColor(decision.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(decision.type)}
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {decision.application}
                    <span className="flex items-center gap-1 text-xs opacity-70">
                      {getDirectionIcon(decision.direction)}
                    </span>
                  </div>
                  <div className="text-xs opacity-70">{decision.timestamp}</div>
                </div>
              </div>
              <Badge className={`${getPriorityColor(decision.priority)} text-white text-xs`}>
                {decision.priority}
              </Badge>
            </div>

            {/* Confidence Meter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono font-medium">{decision.confidence.toFixed(1)}%</span>
              </div>
              <Progress value={decision.confidence} className="h-1.5" />
            </div>

            {/* Sparkline Trend */}
            <div className="mt-2 flex items-end gap-0.5 h-8">
              {decision.trend.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-current opacity-40 hover:opacity-80 transition-opacity rounded-sm"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}