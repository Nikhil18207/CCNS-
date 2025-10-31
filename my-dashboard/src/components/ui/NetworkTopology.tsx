"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"
import { Network, Cpu, Server, Smartphone, Radio, ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react"

interface Node {
  id: string
  type: "UE" | "gNodeB" | "AMF" | "SMF" | "UPF" | "Server"
  x: number
  y: number
  status: "active" | "warning" | "offline"
  label: string
  application?: string
}

interface Connection {
  from: string
  to: string
  qos: "high" | "medium" | "low"
  active: boolean
  application?: string
  direction?: "uplink" | "downlink" | "balanced"
}

interface Packet {
  id: string
  fromId: string
  toId: string
  progress: number
  qos: "high" | "medium" | "low"
  application: string
}

const applications = [
  { name: "Netflix", priority: "medium", qos: "medium" as const },
  { name: "Amazon Prime", priority: "medium", qos: "medium" as const },
  { name: "Google Meet", priority: "high", qos: "high" as const },
  { name: "Microsoft Teams", priority: "high", qos: "high" as const },
  { name: "Metaverse/Roblox", priority: "high", qos: "high" as const },
  { name: "GeForce Gaming", priority: "high", qos: "high" as const }
]

export default function NetworkTopology() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [packets, setPackets] = useState<Packet[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize network topology
    const topology: Node[] = [
      // UEs (User Equipment) with applications
      { id: "ue1", type: "UE", x: 10, y: 25, status: "active", label: "Netflix", application: "Netflix" },
      { id: "ue2", type: "UE", x: 10, y: 40, status: "active", label: "Teams", application: "Microsoft Teams" },
      { id: "ue3", type: "UE", x: 10, y: 55, status: "active", label: "Gaming", application: "GeForce Gaming" },
      { id: "ue4", type: "UE", x: 10, y: 70, status: "active", label: "Prime", application: "Amazon Prime" },
      
      // gNodeB (5G Base Station)
      { id: "gnb1", type: "gNodeB", x: 30, y: 47, status: "active", label: "gNB-01" },
      
      // Core Network
      { id: "amf1", type: "AMF", x: 50, y: 35, status: "active", label: "AMF" },
      { id: "smf1", type: "SMF", x: 50, y: 59, status: "active", label: "SMF" },
      { id: "upf1", type: "UPF", x: 70, y: 47, status: "active", label: "UPF" },
      
      // Servers
      { id: "srv1", type: "Server", x: 90, y: 35, status: "active", label: "Streaming", application: "Streaming Services" },
      { id: "srv2", type: "Server", x: 90, y: 47, status: "active", label: "Gaming", application: "Gaming Servers" },
      { id: "srv3", type: "Server", x: 90, y: 59, status: "active", label: "Conference", application: "Conference Servers" },
    ]

    const links: Connection[] = [
      // UE to gNodeB
      { from: "ue1", to: "gnb1", qos: "medium", active: true, application: "Netflix", direction: "downlink" },
      { from: "ue2", to: "gnb1", qos: "high", active: true, application: "Microsoft Teams", direction: "balanced" },
      { from: "ue3", to: "gnb1", qos: "high", active: true, application: "GeForce Gaming", direction: "balanced" },
      { from: "ue4", to: "gnb1", qos: "medium", active: true, application: "Amazon Prime", direction: "downlink" },
      
      // gNodeB to Core
      { from: "gnb1", to: "amf1", qos: "high", active: true },
      { from: "gnb1", to: "upf1", qos: "high", active: true },
      
      // Core Network
      { from: "amf1", to: "smf1", qos: "high", active: true },
      { from: "smf1", to: "upf1", qos: "high", active: true },
      
      // UPF to Servers
      { from: "upf1", to: "srv1", qos: "medium", active: true, application: "Streaming" },
      { from: "upf1", to: "srv2", qos: "high", active: true, application: "Gaming" },
      { from: "upf1", to: "srv3", qos: "high", active: true, application: "Conference" },
    ]

    setNodes(topology)
    setConnections(links)

    // Simulate packet flows
    const packetInterval = setInterval(() => {
      const activeLinks = links.filter(l => l.active && l.application)
      if (activeLinks.length > 0 && Math.random() > 0.3) {
        const link = activeLinks[Math.floor(Math.random() * activeLinks.length)]
        const app = applications.find(a => link.application?.includes(a.name))
        if (app) {
          const newPacket: Packet = {
            id: `packet-${Date.now()}-${Math.random()}`,
            fromId: link.from,
            toId: link.to,
            progress: 0,
            qos: app.qos,
            application: app.name
          }
          setPackets(prev => [...prev, newPacket])
        }
      }
    }, 600)

    // Animate packets
    const animationInterval = setInterval(() => {
      setPackets(prev => {
        return prev
          .map(p => ({ ...p, progress: p.progress + 4 }))
          .filter(p => p.progress <= 100)
      })
    }, 50)

    // Randomly update node status
    const statusInterval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (Math.random() > 0.97) {
          return {
            ...node,
            status: node.status === "active" ? "warning" : "active"
          }
        }
        return node
      }))
    }, 5000)

    return () => {
      clearInterval(packetInterval)
      clearInterval(animationInterval)
      clearInterval(statusInterval)
    }
  }, [])

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "UE": return <Smartphone className="h-4 w-4" />
      case "gNodeB": return <Radio className="h-5 w-5" />
      case "AMF": return <Cpu className="h-4 w-4" />
      case "SMF": return <Cpu className="h-4 w-4" />
      case "UPF": return <Server className="h-4 w-4" />
      case "Server": return <Server className="h-5 w-5" />
    }
  }

  const getNodeColor = (status: Node["status"]) => {
    switch (status) {
      case "active": return "bg-green-500 border-green-400 shadow-green-500/50"
      case "warning": return "bg-yellow-500 border-yellow-400 shadow-yellow-500/50"
      case "offline": return "bg-red-500 border-red-400 shadow-red-500/50"
    }
  }

  const getQoSColor = (qos: "high" | "medium" | "low") => {
    switch (qos) {
      case "high": return "#22c55e"
      case "medium": return "#eab308"
      case "low": return "#ef4444"
    }
  }

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  const getDirectionIcon = (direction?: "uplink" | "downlink" | "balanced") => {
    switch (direction) {
      case "uplink": return <ArrowUp className="h-3 w-3" />
      case "downlink": return <ArrowDown className="h-3 w-3" />
      case "balanced": return <ArrowLeftRight className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Network Topology</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 text-green-500 border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {nodes.filter(n => n.status === "active").length} Active
          </Badge>
        </div>
      </div>

      {/* Topology Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 bg-linear-to-br from-muted/30 to-muted/10 rounded-lg border border-border relative overflow-hidden"
      >
        {/* Draw Connections */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {connections.map((conn, idx) => {
            const from = getNodePosition(conn.from)
            const to = getNodePosition(conn.to)
            return (
              <line
                key={idx}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={getQoSColor(conn.qos)}
                strokeWidth="2"
                strokeDasharray={conn.qos === "low" ? "5,5" : "none"}
                opacity="0.4"
                className="transition-all"
              />
            )
          })}

          {/* Draw Packets */}
          {packets.map((packet) => {
            const from = getNodePosition(packet.fromId)
            const to = getNodePosition(packet.toId)
            const x = from.x + (to.x - from.x) * (packet.progress / 100)
            const y = from.y + (to.y - from.y) * (packet.progress / 100)
            
            return (
              <circle
                key={packet.id}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={getQoSColor(packet.qos)}
                className="animate-pulse"
              />
            )
          })}
        </svg>

        {/* Draw Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute cursor-pointer transition-all hover:scale-110"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10
            }}
            onClick={() => setSelectedNode(node)}
          >
            <div className={`p-3 rounded-lg border-2 ${getNodeColor(node.status)} shadow-lg backdrop-blur-sm`}>
              <div className="text-white flex flex-col items-center gap-1">
                {getNodeIcon(node.type)}
                <span className="text-xs font-medium whitespace-nowrap">{node.label}</span>
                <span className="text-[10px] opacity-75">{node.type}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 shadow-lg" style={{ zIndex: 20 }}>
          <div className="text-xs font-semibold mb-2">Priority Levels</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500" />
              <span className="text-xs">High (Gaming, Teams, Meet)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-yellow-500" />
              <span className="text-xs">Medium (Netflix, Prime)</span>
            </div>
          </div>
          <div className="text-xs font-semibold mt-3 mb-2">Traffic Direction</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-3 w-3" />
              <span className="text-xs">Downlink (Streaming)</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-3 w-3" />
              <span className="text-xs">Balanced (Gaming/Conf)</span>
            </div>
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border p-4 shadow-xl animate-in fade-in slide-in-from-right-2 max-w-xs" style={{ zIndex: 20 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type)}
                <span className="font-semibold">{selectedNode.label}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{selectedNode.type}</span>
              </div>
              {selectedNode.application && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application:</span>
                  <span className="font-medium">{selectedNode.application}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={selectedNode.status === "active" ? "bg-green-500" : "bg-yellow-500"}>
                  {selectedNode.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connections:</span>
                <span className="font-medium">
                  {connections.filter(c => c.from === selectedNode.id || c.to === selectedNode.id).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}