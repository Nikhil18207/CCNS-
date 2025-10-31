"use client"

import TrafficStreamPanel from "@/components/ui/TrafficStreamPanel"
import QoSDecisionPanel from "@/components/ui/QoSDecisionPanel"
import NetworkTopology from "@/components/ui/NetworkTopology"
import PolicyChatbot from "@/components/ui/PolicyChatbot"
import { Badge } from "@/components/ui/badge"
import { Network } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Network className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">5G QoS Monitoring Dashboard</h1>
            <p className="text-xs text-muted-foreground/80 mt-1">(Nikhil, Sudiksha, Om Dhadhania)</p>
            <p className="text-sm text-muted-foreground">Real-time network orchestration & ML-driven policy enforcement</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            System Operational
          </Badge>
          <Badge variant="outline">ML Engine: Active</Badge>
          <Badge variant="outline">Network: 5G SA</Badge>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Traffic Stream - Top Left */}
        <div className="h-[500px]">
          <TrafficStreamPanel />
        </div>

        {/* QoS Decision Panel - Top Right */}
        <div className="h-[500px]">
          <QoSDecisionPanel />
        </div>

        {/* Network Topology - Bottom Left */}
        <div className="h-[600px]">
          <NetworkTopology />
        </div>

        {/* Policy Chatbot - Bottom Right */}
        <div className="h-[600px]">
          <PolicyChatbot />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <div>5G Network Monitoring System • Real-time Data Visualization • ML-Powered QoS Optimization</div>
        <div className="mt-2">made with &lt;3 by Nikhil</div>
      </div>
    </div>
  )
}