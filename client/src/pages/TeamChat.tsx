import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Send, Users } from "lucide-react";

export default function TeamChat() {
  const { data: messages } = trpc.chat.getMessages.useQuery();
  const { data: teamMembers } = trpc.team.getMembers.useQuery();
  const sendMutation = trpc.chat.send.useMutation();
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMutation.mutateAsync({
        content: messageText,
        recipientId: selectedUser || undefined,
      });
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredMessages = messages ? (
    selectedUser
      ? messages.filter(m => m.senderId === selectedUser || m.recipientId === selectedUser)
      : messages
  ) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team Chat</h1>
        <p className="text-gray-600">Collaborate with your team in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Team Members Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team
            </CardTitle>
            <CardDescription>Online members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedUser(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedUser === null
                    ? "bg-blue-100 text-blue-900 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                General Chat
              </button>
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedUser(member.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedUser === member.id
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === "active" ? "bg-green-500" :
                      member.status === "away" ? "bg-yellow-500" :
                      "bg-gray-400"
                    }`} />
                    <span className="truncate">{member.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No team members</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedUser
                ? teamMembers?.find(m => m.id === selectedUser)?.name || "Direct Message"
                : "General Chat"}
            </CardTitle>
            <CardDescription>
              {selectedUser ? "Direct message" : "Team-wide conversation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
              {filteredMessages && filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">
                        {message.senderId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {teamMembers?.find(m => m.id === message.senderId)?.name || "User"}
                        </p>
                      <p className="text-xs text-gray-500">
                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : ''}
                      </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={sendMutation.isPending || !messageText.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

