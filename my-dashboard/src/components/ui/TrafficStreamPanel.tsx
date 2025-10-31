"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Activity, Radio, ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react"

interface TrafficFlow {
  id: string
  application: string
  priority: "High" | "Medium" | "Low"
  direction: "uplink" | "downlink" | "balanced"
  rate: string
  status: "active" | "warning" | "critical"
}

const applications = [
  { name: "Netflix", priority: "Medium" as const },
  { name: "Amazon Prime", priority: "Medium" as const },
  { name: "Google Meet", priority: "High" as const },
  { name: "Microsoft Teams", priority: "High" as const },
  { name: "Metaverse/Roblox", priority: "High" as const },
  { name: "GeForce Gaming", priority: "High" as const }
]

const directions: Array<"uplink" | "downlink" | "balanced"> = ["uplink", "downlink", "balanced"]

export default function TrafficStreamPanel() {
  const [flows, setFlows] = useState<TrafficFlow[]>([])
  const [stats, setStats] = useState({ uplink: 0, downlink: 0, balanced: 0 })

  useEffect(() => {
    // Initialize with some flows
    const initialFlows: TrafficFlow[] = Array.from({ length: 8 }, (_, i) => {
      const app = applications[Math.floor(Math.random() * applications.length)]
      return {
        id: `flow-${Date.now()}-${i}`,
        application: app.name,
        priority: app.priority,
        direction: directions[Math.floor(Math.random() * directions.length)],
        rate: `${(Math.random() * 100 + 10).toFixed(1)} Mbps`,
        status: Math.random() > 0.8 ? "warning" : "active"
      }
    })
    setFlows(initialFlows)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setFlows(prev => {
        const newFlows = [...prev]
        
        // Update random flow
        if (newFlows.length > 0 && Math.random() > 0.3) {
          const idx = Math.floor(Math.random() * newFlows.length)
          newFlows[idx] = {
            ...newFlows[idx],
            rate: `${(Math.random() * 100 + 10).toFixed(1)} Mbps`,
            status: Math.random() > 0.85 ? "warning" : "active"
          }
        }

        // Add new flow occasionally
        if (Math.random() > 0.7 && newFlows.length < 12) {
          const app = applications[Math.floor(Math.random() * applications.length)]
          newFlows.unshift({
            id: `flow-${Date.now()}-${Math.random()}`,
            application: app.name,
            priority: app.priority,
            direction: directions[Math.floor(Math.random() * directions.length)],
            rate: `${(Math.random() * 100 + 10).toFixed(1)} Mbps`,
            status: "active"
          })
        }

        // Remove old flows
        if (newFlows.length > 12) {
          newFlows.pop()
        }

        return newFlows
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate stats
    const uplink = flows.filter(f => f.direction === "uplink").length
    const downlink = flows.filter(f => f.direction === "downlink").length
    const balanced = flows.filter(f => f.direction === "balanced").length
    
    setStats({ uplink, downlink, balanced })
  }, [flows])

  const getStatusColor = (status: TrafficFlow["status"]) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "warning": return "bg-yellow-500"
      case "critical": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: TrafficFlow["priority"]) => {
    switch (priority) {
      case "High": return "text-red-500 bg-red-500/10 border-red-500/30"
      case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "Low": return "text-blue-500 bg-blue-500/10 border-blue-500/30"
    }
  }

  const getDirectionIcon = (direction: TrafficFlow["direction"]) => {
    switch (direction) {
      case "uplink": return <ArrowUp className="h-3 w-3 text-blue-500" />
      case "downlink": return <ArrowDown className="h-3 w-3 text-green-500" />
      case "balanced": return <ArrowLeftRight className="h-3 w-3 text-purple-500" />
    }
  }

  const getDirectionLabel = (direction: TrafficFlow["direction"]) => {
    switch (direction) {
      case "uplink": return "Uplink"
      case "downlink": return "Downlink"
      case "balanced": return "Balanced"
    }
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Live Traffic Stream</h2>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3 animate-pulse" />
          {flows.length} flows
        </Badge>
      </div>

      {/* Direction Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-blue-500/10 rounded-lg p-2 text-center border border-blue-500/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowUp className="h-3 w-3 text-blue-500" />
            <div className="text-xs text-blue-500 font-medium">Uplink</div>
          </div>
          <div className="text-lg font-bold text-blue-600">{stats.uplink}</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowDown className="h-3 w-3 text-green-500" />
            <div className="text-xs text-green-500 font-medium">Downlink</div>
          </div>
          <div className="text-lg font-bold text-green-600">{stats.downlink}</div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-2 text-center border border-purple-500/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowLeftRight className="h-3 w-3 text-purple-500" />
            <div className="text-xs text-purple-500 font-medium">Balanced</div>
          </div>
          <div className="text-lg font-bold text-purple-600">{stats.balanced}</div>
        </div>
      </div>

      {/* Flow List */}
      <div className="flex-1 overflow-auto space-y-2">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="bg-muted/30 rounded-lg p-3 border border-border hover:bg-muted/50 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(flow.status)} animate-pulse`} />
                <span className="text-sm font-medium">
                  {flow.application}
                </span>
              </div>
              <Badge variant="outline" className={`text-xs ${getPriorityColor(flow.priority)}`}>
                {flow.priority} Priority
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-muted-foreground">
                  {getDirectionIcon(flow.direction)}
                  {getDirectionLabel(flow.direction)}
                </span>
                <span className="font-mono font-medium text-foreground">
                  {flow.rate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}