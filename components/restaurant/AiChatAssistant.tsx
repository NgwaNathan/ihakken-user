"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AiChatAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <>
      {/* The Floating Chat Button */}
      <div className="fixed bottom-28 right-4 z-40">
        <Button onClick={toggleChat} size="icon" className="w-14 h-14 bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg">
          <Bot className="w-7 h-7" />
        </Button>
      </div>

      {/* The Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 z-50">
          <Card className="w-80 shadow-xl border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between bg-muted p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-teal-600" />
                <CardTitle className="text-base">AI Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 h-80 text-sm text-muted-foreground">
              <p>Hello! Ask me anything about the menu, ingredients, or allergens.</p>
              {/* Chat messages will go here */}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}