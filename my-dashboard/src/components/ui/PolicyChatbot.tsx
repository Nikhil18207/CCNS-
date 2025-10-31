"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Sparkles, Shield, Zap, Network } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { label: "Netflix vs Amazon Prime Priority", icon: <Zap className="h-3 w-3" /> },
  { label: "Gaming Latency Requirements", icon: <Shield className="h-3 w-3" /> },
  { label: "Teams vs Meet Classification", icon: <Network className="h-3 w-3" /> },
  { label: "Uplink vs Downlink Policies", icon: <Sparkles className="h-3 w-3" /> },
]

const aiResponses = [
  "Netflix and Amazon Prime are classified as Medium Priority with High Throughput policy, optimized for downlink-heavy traffic at 25-50 Mbps for 4K streaming.",
  "GeForce Gaming and Metaverse/Roblox require Ultra-Low Latency with <10ms RTT. High Priority classification ensures balanced uplink/downlink for real-time gameplay.",
  "Microsoft Teams and Google Meet are classified as High Priority with Low Latency policy (<50ms). They use balanced traffic patterns for video conferencing.",
  "Uplink traffic prioritizes voice/video uploads for conferencing apps. Downlink prioritizes streaming content. Balanced mode is optimal for gaming and metaverse applications.",
  "Current classification: High Priority (Gaming, Teams, Meet, Metaverse) gets QCI-1/2, Medium Priority (Netflix, Prime) gets QCI-5/7 for bandwidth optimization.",
  "ML model detects application signatures: QUIC for streaming services, WebRTC for conferencing, UDP for gaming. 96.2% classification accuracy achieved.",
]

export default function PolicyChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your Network Priority Assistant. I can help you understand application classifications, priority policies, and traffic direction optimization for Netflix, Amazon Prime, Google Meet, Microsoft Teams, Metaverse/Roblox, and GeForce Gaming. How can I help?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: "assistant",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const handleQuickAction = (action: string) => {
    handleSend(action)
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Priority Assistant</h2>
        </div>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3 text-yellow-500" />
          AI Powered
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleQuickAction(action.label)}
          >
            {action.icon}
            <span className="ml-1">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="text-sm leading-relaxed">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.type === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSend()}
          placeholder="Ask about application priorities, classifications, or traffic patterns..."
          className="flex-1"
        />
        <Button onClick={() => handleSend()} size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Footer */}
      <div className="mt-3 text-xs text-center text-muted-foreground">
        AI responses are simulated for demonstration purposes
      </div>
    </Card>
  )
}