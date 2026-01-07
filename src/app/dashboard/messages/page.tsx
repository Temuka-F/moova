'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Send, 
  MessageCircle,
  ArrowLeft,
  Car
} from 'lucide-react'
import { format } from 'date-fns'
import { DUMMY_MESSAGES, DUMMY_USERS, DUMMY_BOOKINGS, DUMMY_CARS } from '@/lib/dummy-data'

// Sample conversations
const conversations = [
  {
    id: '1',
    otherUser: DUMMY_USERS[3], // Ana
    lastMessage: 'Hi Giorgi! I\'m excited about picking up the BMW X5 on Friday.',
    unread: false,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    booking: { car: DUMMY_CARS[0] }
  },
  {
    id: '2',
    otherUser: DUMMY_USERS[6], // Irakli
    lastMessage: 'The E-Class is amazing! Quick question - where\'s the best place to get it washed?',
    unread: true,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    booking: { car: DUMMY_CARS[1] }
  },
  {
    id: '3',
    otherUser: DUMMY_USERS[4], // David
    lastMessage: 'Thanks for the smooth experience!',
    unread: false,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    booking: { car: DUMMY_CARS[2] }
  },
]

const sampleMessages = [
  { id: '1', senderId: 'user-4', content: 'Hi Giorgi! I\'m excited about picking up the BMW X5 on Friday. Will you be available at 10 AM?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: '2', senderId: 'user-1', content: 'Hello Ana! Yes, 10 AM works perfectly for me. I\'ll have the car ready and fueled up for you.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600000) },
  { id: '3', senderId: 'user-4', content: 'Perfect! Should I meet you at the address listed, or is there a specific spot?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7200000) },
  { id: '4', senderId: 'user-1', content: 'Yes, the address on the listing is correct. I\'ll send you the exact parking spot location before pickup. See you Friday!', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10800000) },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const currentUserId = 'user-1' // Giorgi (host)
  
  const selectedConvo = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In a real app, this would send the message via API
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with hosts and renters</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversations List */}
          <Card className={`overflow-hidden ${selectedConversation ? 'hidden lg:block' : ''}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-72px)]">
              {conversations.length > 0 ? (
                conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConversation(convo.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b text-left ${
                      selectedConversation === convo.id ? 'bg-muted/50' : ''
                    }`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={convo.otherUser.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {convo.otherUser.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium truncate">
                          {convo.otherUser.firstName} {convo.otherUser.lastName?.charAt(0)}.
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {format(convo.updatedAt, 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {convo.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Car className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {convo.booking.car.make} {convo.booking.car.model}
                        </span>
                        {convo.unread && (
                          <Badge className="h-5 px-1.5 text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className={`lg:col-span-2 flex flex-col overflow-hidden ${!selectedConversation ? 'hidden lg:flex' : ''}`}>
            {selectedConvo ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConvo.otherUser.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedConvo.otherUser.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {selectedConvo.otherUser.firstName} {selectedConvo.otherUser.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConvo.booking.car.make} {selectedConvo.booking.car.model}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {sampleMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.senderId === currentUserId
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {format(msg.timestamp, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="rounded-full"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="rounded-full"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
