'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  Search, 
  Send, 
  MessageCircle,
  ArrowLeft,
  Car,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { getErrorMessage } from '@/lib/error-utils'

interface User {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
  sender: User
  receiver: User
  booking?: {
    id: string
    car: {
      id: string
      make: string
      model: string
      images: { url: string }[]
    }
  }
}

interface Conversation {
  partnerId: string
  partner: User
  lastMessage: Message
  unreadCount: number
  booking?: {
    id: string
    car: {
      id: string
      make: string
      model: string
      images: { url: string }[]
    }
  }
}

function ConversationsSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 flex items-start gap-3 border-b">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialUserId = searchParams.get('userId')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(initialUserId)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/messages')
            return
          }
          throw new Error('Failed to fetch user')
        }
        const data = await res.json()
        setCurrentUser(data)
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }
    fetchUser()
  }, [router])

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/messages')
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/messages')
            return
          }
          throw new Error('Failed to fetch conversations')
        }
        const data = await res.json()
        setConversations(data.conversations || [])
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load messages'))
        console.error('Error fetching conversations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [router])

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedPartnerId) {
      setMessages([])
      return
    }

    async function fetchMessages() {
      setMessagesLoading(true)
      try {
        const res = await fetch(`/api/messages?userId=${selectedPartnerId}`)
        if (!res.ok) throw new Error('Failed to fetch messages')
        const data = await res.json()
        setMessages(data.messages || [])
      } catch (err) {
        console.error('Error fetching messages:', err)
        toast.error('Failed to load messages')
      } finally {
        setMessagesLoading(false)
      }
    }
    fetchMessages()
  }, [selectedPartnerId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPartnerId || !currentUser) return

    setSending(true)
    const messageContent = newMessage
    setNewMessage('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedPartnerId,
          content: messageContent,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const newMsg = await res.json()
      setMessages(prev => [...prev, newMsg])

      // Update conversation in list
      setConversations(prev => {
        const existing = prev.find(c => c.partnerId === selectedPartnerId)
        if (existing) {
          return prev.map(c => 
            c.partnerId === selectedPartnerId 
              ? { ...c, lastMessage: newMsg }
              : c
          ).sort((a, b) => 
            new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
          )
        }
        return prev
      })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to send message'))
      setNewMessage(messageContent)
    } finally {
      setSending(false)
    }
  }

  const selectedConvo = conversations.find(c => c.partnerId === selectedPartnerId)

  const filteredConversations = conversations.filter(c => 
    c.partner.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.partner.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with hosts and renters</p>
          </div>
        </div>

        {error ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Failed to load messages</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="rounded-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
            {/* Conversations List */}
            <Card className={`overflow-hidden ${selectedPartnerId ? 'hidden lg:block' : ''}`}>
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
                {loading ? (
                  <ConversationsSkeleton />
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((convo) => (
                    <button
                      key={convo.partnerId}
                      onClick={() => setSelectedPartnerId(convo.partnerId)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b text-left ${
                        selectedPartnerId === convo.partnerId ? 'bg-muted/50' : ''
                      }`}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={convo.partner.avatarUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {convo.partner.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium truncate">
                            {convo.partner.firstName} {convo.partner.lastName?.charAt(0)}.
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {format(new Date(convo.lastMessage.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {convo.lastMessage.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {convo.booking && (
                            <>
                              <Car className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {convo.booking.car.make} {convo.booking.car.model}
                              </span>
                            </>
                          )}
                          {convo.unreadCount > 0 && (
                            <Badge className="h-5 px-1.5 text-xs">{convo.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start a conversation by messaging a host from a car listing</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Chat Area */}
            <Card className={`lg:col-span-2 flex flex-col overflow-hidden ${!selectedPartnerId ? 'hidden lg:flex' : ''}`}>
              {selectedPartnerId && selectedConvo ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedPartnerId(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConvo.partner.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedConvo.partner.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedConvo.partner.firstName} {selectedConvo.partner.lastName}
                      </p>
                      {selectedConvo.booking && (
                        <p className="text-sm text-muted-foreground">
                          {selectedConvo.booking.car.make} {selectedConvo.booking.car.model}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              msg.senderId === currentUser?.id
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {format(new Date(msg.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                        className="rounded-full"
                        disabled={sending}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="rounded-full"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : selectedPartnerId && !selectedConvo ? (
                // New conversation with user not in list
                <>
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedPartnerId(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <p className="font-medium">New Conversation</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              msg.senderId === currentUser?.id
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {format(new Date(msg.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                        className="rounded-full"
                        disabled={sending}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="rounded-full"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
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
        )}
      </div>
    </div>
  )
}
