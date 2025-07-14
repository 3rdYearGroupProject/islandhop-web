import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../../firebase';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import { getAuth } from "firebase/auth";
import userServicesApi from "../../api/axios";

const Communications = () => {
  const [selectedChat, setSelectedChat] = useState('system');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [supportAgents, setSupportAgents] = useState([]);
  const [loadingSupportAgents, setLoadingSupportAgents] = useState(false);
  const messagesEndRef = useRef(null);

  // Chats state: system group and personal conversations from backend
  const [chats, setChats] = useState([
    {
      id: 'system',
      name: 'System',
      type: 'group',
      avatar: null,
      lastMessage: '',
      lastTime: '',
      unreadCount: 0,
      isOnline: true,
      participants: []
    }
  ]);
  const [personalConversations, setPersonalConversations] = useState([]);
  const [personalMessages, setPersonalMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userDisplayNames, setUserDisplayNames] = useState({});

  // Remove old mock messages state
  
  // Function to fetch all users and filter support agents
  const fetchSupportAgents = async () => {
    setLoadingSupportAgents(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      
      const response = await userServicesApi.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log('Fetched users:', response.data);
      
      if (response.status === 200 && response.data.status === "success") {
        // Filter only support agents
        const supportUsers = response.data.users.filter(user => 
          user.accountType && user.accountType.toLowerCase() === 'support'
        );
        
        console.log('Support agents found:', supportUsers);
        setSupportAgents(supportUsers);
        
        // Add support agents to chats
        const supportChats = supportUsers.map(agent => ({
          id: `support_${agent.email}`, // Use email as unique identifier
          name: `${agent.firstName} ${agent.lastName}`,
          email: agent.email,
          type: 'support',
          avatar: agent.profilePicUrl || null,
          lastMessage: '',
          lastTime: '',
          unreadCount: 0,
          isOnline: agent.status === 'ACTIVE',
          role: 'Support Agent'
        }));
        
        // Update chats to include system and support agents
        setChats(prev => [
          prev[0], // Keep system group
          ...supportChats
        ]);
      }
    } catch (error) {
      console.error("Error fetching support agents:", error);
    } finally {
      setLoadingSupportAgents(false);
    }
  };

  // Function to get user ID from Firebase by email
  const getUserIdByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:8093/api/v1/firebase/user/uid-by-email?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Got user ID for ${email}:`, data.uid);
        return data.uid;
      } else {
        console.error(`Failed to get user ID for ${email}:`, response.status);
        return null;
      }
    } catch (error) {
      console.error(`Error getting user ID for ${email}:`, error);
      return null;
    }
  };

  // Function to start a conversation with a support agent
  const startConversationWithAgent = async (agentEmail) => {
    try {
      const userId = await getUserIdByEmail(agentEmail);
      if (!userId) {
        console.error('Could not get user ID for agent:', agentEmail);
        return;
      }

      const currentUserId = auth.currentUser.uid;
      
      // Create conversation payload
      const conversationPayload = {
        senderId: currentUserId,
        receiverId: userId,
        content: `Hello! This is an admin message.`,
        messageType: 'TEXT',
        senderName: auth.currentUser?.displayName || 'Admin'
      };

      // Send initial message to create conversation
      const response = await fetch('http://localhost:8090/api/v1/chat/personal/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(conversationPayload)
      });
      console.log('Starting conversation with agent:', agentEmail, 'Payload:', conversationPayload);

      if (response.ok) {
        console.log('Conversation started with agent:', agentEmail);
        // Refresh personal conversations
        fetchPersonalConversations();
      } else {
        console.error('Failed to start conversation with agent:', response.status);
      }
    } catch (error) {
      console.error('Error starting conversation with agent:', error);
    }
  };
  const fetchDisplayNameFromBackend = async (userId) => {
    console.log(`Fetching display name for user: ${userId}`);
    if (userDisplayNames[userId]) {
      console.log(`Display name already cached for ${userId}: ${userDisplayNames[userId]}`);
      return userDisplayNames[userId];
    }

    try {
      const response = await fetch(`http://localhost:8091/api/v1/firebase/user/display-name/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const displayName = await response.text();
        console.log(`Fetched display name for ${userId}: ${displayName}`);
        setUserDisplayNames(prev => ({
          ...prev,
          [userId]: displayName
        }));
        return displayName;
      } else {
        console.error(`Failed to fetch display name for ${userId}:`, response.status);
        return userId; // Fallback to userId
      }
    } catch (error) {
      console.error(`Error fetching display name for ${userId}:`, error);
      return userId; // Fallback to userId
    }
  };

  // Fetch personal conversations for current user
  const fetchPersonalConversations = async () => {
    if (authToken && auth.currentUser) {
      console.log(`Fetching personal conversations for user: ${auth.currentUser.uid}`);
      const userId = auth.currentUser.uid;
      
      try {
        const response = await fetch(`http://localhost:8090/api/v1/chat/personal/conversations/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        const data = await response.json();
        console.log('Fetched personal conversations:', data);
        setPersonalConversations(Array.isArray(data) ? data : []);
        
        // Fetch display names for all receivers
        const conversationsWithNames = await Promise.all(
          data.map(async (conv) => {
            const displayName = await fetchDisplayNameFromBackend(conv.receiverId);
            return {
              id: conv.conversationId,
              name: displayName,
              type: 'personal',
              avatar: null,
              lastMessage: conv.lastMessage || '',
              lastTime: conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
              unreadCount: 0,
              isOnline: conv.isOnline || false,
              role: conv.receiverRole || '',
              receiverId: conv.receiverId // Store the actual receiverId
            };
          })
        );
        
        // Add to chats state (keep system group and support agents)
        setChats(prev => {
          const systemChat = prev.find(chat => chat.id === 'system');
          const supportChats = prev.filter(chat => chat.type === 'support');
          return [
            systemChat,
            ...supportChats,
            ...conversationsWithNames
          ].filter(Boolean);
        });
        
        // Fetch unread counts
        const unreadResponse = await fetch(`http://localhost:8090/api/v1/chat/personal/unread-count/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        const unreadData = await unreadResponse.json();
        setUnreadCounts(unreadData || {});
      } catch (error) {
        console.error('Error fetching personal conversations:', error);
      }
    }
  };

  useEffect(() => {
    fetchPersonalConversations();
  }, [authToken, auth.currentUser, userDisplayNames]);
  // Fetch personal messages for selected chat
  useEffect(() => {
    if (selectedChat !== 'system' && authToken && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const conversation = chats.find(c => c.id === selectedChat);
      if (!conversation) return;
      // Safely get receiverId
      let receiverId = '';
      if (typeof conversation.receiverId === 'string' && conversation.receiverId) {
        receiverId = conversation.receiverId;
      } else if (typeof conversation.id === 'string' && conversation.id) {
        receiverId = conversation.id.replace(userId, '').replace(/-/g, '');
      }
      fetch(`http://localhost:8090/api/v1/chat/personal/messages?senderId=${userId}&receiverId=${receiverId}&page=0&size=20`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(async (data) => {
          console.log('Fetched personal messages:', data);
          const messages = Array.isArray(data.content) ? data.content : [];
          
          // Fetch display names for all message senders
          const messagesWithNames = await Promise.all(
            messages.map(async (msg) => {
              if (!msg.senderName && msg.senderId) {
                const displayName = await fetchDisplayNameFromBackend(msg.senderId);
                return { ...msg, senderName: displayName };
              }
              return msg;
            })
          );
          
          setPersonalMessages(prev => ({
            ...prev,
            [selectedChat]: messagesWithNames
          }));
        });
    }
  }, [selectedChat, authToken, chats, auth.currentUser, userDisplayNames]);

  // Get Firebase auth token
  useEffect(() => {
    const getToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setAuthToken(token);
          console.log('Display name:', currentUser.displayName);
        } catch (err) {
          setAuthToken('');
        }
      }
    };
    getToken();
  }, []);

  // Fetch support agents when auth token is available
  useEffect(() => {
    if (authToken) {
      fetchSupportAgents();
    }
  }, [authToken]);

  // Fetch group details and messages for system group
  useEffect(() => {
    if (selectedChat === 'system' && authToken) {
      // Fetch group details
      fetch('http://localhost:8090/api/v1/chat/group/6872785e3372e21e0948ecc8', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setGroupDetails(data);
          setChats(prev => prev.map(chat =>
            chat.id === 'system'
              ? { ...chat, participants: data.members || [], name: data.name || 'System' }
              : chat
          ));
        });

      // Fetch group messages
      setLoadingMessages(true);
      fetch('http://localhost:8090/api/v1/chat/group/6872785e3372e21e0948ecc8/messages?page=0&size=20', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(async (data) => {
          console.log('Fetched group messages:', data);
          const messages = Array.isArray(data.content) ? data.content : [];
          
          // Fetch display names for all message senders
          const messagesWithNames = await Promise.all(
            messages.map(async (msg) => {
              if (!msg.senderName && msg.senderId) {
                const displayName = await fetchDisplayNameFromBackend(msg.senderId);
                return { ...msg, senderName: displayName };
              }
              return msg;
            })
          );
          
          setGroupMessages(messagesWithNames);
          setLoadingMessages(false);
        })
        .catch(() => setLoadingMessages(false));
    }
  }, [selectedChat, authToken, userDisplayNames]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, personalMessages, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    console.log(`Sending message to ${selectedChat}:`, messageInput);

    if (selectedChat === 'system') {
      setSending(true);
      try {
        const messagePayload = {
          groupId: '6872785e3372e21e0948ecc8',
          senderId: auth.currentUser.uid,
          content: messageInput,
          messageType: 'TEXT',
          senderName: auth.currentUser?.displayName || 'Admin'
        };
        console.log('Group message payload:', messagePayload);
        
        const res = await fetch('http://localhost:8090/api/v1/chat/group/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(messagePayload)
        });
        
        if (res.ok) {
          console.log('Group message sent successfully');
          setMessageInput('');
          // Refresh group messages
          fetch('http://localhost:8090/api/v1/chat/group/6872785e3372e21e0948ecc8/messages?page=0&size=20', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(res => res.json())
            .then(async (data) => {
              console.log('Refreshed group messages:', data);
              const messages = Array.isArray(data.content) ? data.content : [];
              
              // Fetch display names for all message senders
              const messagesWithNames = await Promise.all(
                messages.map(async (msg) => {
                  if (!msg.senderName && msg.senderId) {
                    const displayName = await fetchDisplayNameFromBackend(msg.senderId);
                    return { ...msg, senderName: displayName };
                  }
                  return msg;
                })
              );
              
              setGroupMessages(messagesWithNames);
            });
        } else {
          console.error('Failed to send group message:', res.status);
        }
      } catch (err) {
        console.error('Error sending group message:', err);
      }
      setSending(false);
    } else if (selectedChat.startsWith('support_')) {
      // Handle support agent messaging
      setSending(true);
      const agentEmail = selectedChat.replace('support_', '');
      
      try {
        const receiverId = await getUserIdByEmail(agentEmail);
        if (!receiverId) {
          console.error('Could not get user ID for agent:', agentEmail);
          setSending(false);
          return;
        }

        const messagePayload = {
          senderId: auth.currentUser.uid,
          receiverId,
          content: messageInput,
          messageType: 'TEXT',
          //senderName: auth.currentUser?.displayName || 'Admin'
        };
        console.log('Support agent message payload:', messagePayload);

        console.log('sending 1');
        
        const res = await fetch('http://localhost:8090/api/v1/chat/personal/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(messagePayload)
        });
        
        if (res.ok) {
          console.log('Message sent to support agent successfully');
          setMessageInput('');
          // Refresh personal conversations
          fetchPersonalConversations();
        } else {
          console.error('Failed to send message to support agent:', res.status);
        }
      } catch (err) {
        console.error('Error sending message to support agent:', err);
      }
      setSending(false);
    } else {
      // Personal chat
      setSending(true);
      const userId = auth.currentUser.uid;
      const conversation = chats.find(c => c.id === selectedChat);
      if (!conversation) return;
      const receiverId = conversation.receiverId || conversation.id.replace(userId, '').replace('-', '');
      
      try {
        const messagePayload = {
          senderId: userId,
          receiverId,
          content: messageInput,
          messageType: 'TEXT',
          senderName: auth.currentUser?.displayName || 'Admin'
        };
        console.log('Personal message payload:', messagePayload);

        console.log('sending 2');
        
        const res = await fetch('http://localhost:8090/api/v1/chat/personal/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(messagePayload)
        });
        
        if (res.ok) {
          console.log('Personal message sent successfully');
          setMessageInput('');
          // Refresh personal messages
          fetch(`http://localhost:8090/api/v1/chat/personal/messages?senderId=${userId}&receiverId=${receiverId}&page=0&size=20`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(res => res.json())
            .then(async (data) => {
              console.log('Refreshed personal messages:', data);
              const messages = Array.isArray(data.content) ? data.content : [];
              
              // Fetch display names for all message senders
              const messagesWithNames = await Promise.all(
                messages.map(async (msg) => {
                  if (!msg.senderName && msg.senderId) {
                    const displayName = await fetchDisplayNameFromBackend(msg.senderId);
                    return { ...msg, senderName: displayName };
                  }
                  return msg;
                })
              );
              
              setPersonalMessages(prev => ({
                ...prev,
                [selectedChat]: messagesWithNames
              }));
            });
        } else {
          console.error('Failed to send personal message:', res.status);
        }
      } catch (err) {
        console.error('Error sending personal message:', err);
      }
      setSending(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckIcon className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <CheckIcon className="h-3 w-3 text-gray-400 -mr-1" />
            <CheckIcon className="h-3 w-3 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <CheckIconSolid className="h-3 w-3 text-primary-500 -mr-1" />
            <CheckIconSolid className="h-3 w-3 text-primary-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const currentChat = chats.find(chat => chat.id === selectedChat) || 
    (selectedChat.startsWith('support_') ? 
      supportAgents.find(agent => selectedChat === `support_${agent.email}`) && 
      {
        id: selectedChat,
        name: (() => {
          const agent = supportAgents.find(agent => selectedChat === `support_${agent.email}`);
          return agent ? `${agent.firstName} ${agent.lastName}` : 'Support Agent';
        })(),
        type: 'support',
        isOnline: (() => {
          const agent = supportAgents.find(agent => selectedChat === `support_${agent.email}`);
          return agent ? agent.status === 'ACTIVE' : false;
        })(),
        role: 'Support Agent'
      } : null);

  const currentMessages = selectedChat === 'system'
    ? groupMessages.map(msg => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: 'read'
      }))
    : selectedChat.startsWith('support_')
    ? [] // For now, support agent messages will be empty until we fetch them
    : (personalMessages[selectedChat] || []).map(msg => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: msg.read ? 'read' : 'delivered'
      }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Communications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your conversations and messages.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
              {/* Sidebar content */}
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-primary-500" />
                    Chats
                  </h2>
                  <button 
                    onClick={fetchSupportAgents}
                    disabled={loadingSupportAgents}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Support Agents Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Agents</h3>
                    {loadingSupportAgents && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {supportAgents.map((agent) => (
                      <button
                        key={agent.email}
                        onClick={() => setSelectedChat(`support_${agent.email}`)}
                        className={`w-full p-2 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors ${
                          selectedChat === `support_${agent.email}` ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700' : 'border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            {agent.status === 'ACTIVE' && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {agent.firstName} {agent.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Support Agent</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-4 mb-2">System & Conversations</h3>
                </div>
                {chats.filter(chat => chat.type !== 'support').map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-700 border-b border-gray-100 dark:border-secondary-700 transition-colors ${
                      selectedChat === chat.id ? 'bg-primary-50 dark:bg-primary-900/20 border-r-4 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          chat.type === 'group' 
                            ? 'bg-primary-100 dark:bg-primary-900/30' 
                            : 'bg-gray-100 dark:bg-secondary-600'
                        }`}>
                          {chat.type === 'group' ? (
                            <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          ) : (
                            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        {chat.isOnline && chat.type === 'personal' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.lastTime}
                          </span>
                        </div>
                        
                        {chat.type === 'personal' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {chat.role}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            currentChat.type === 'group' 
                              ? 'bg-primary-100 dark:bg-primary-900/30' 
                              : currentChat.type === 'support'
                              ? 'bg-purple-100 dark:bg-purple-900/30'
                              : 'bg-gray-100 dark:bg-secondary-600'
                          }`}>
                            {currentChat.type === 'group' ? (
                              <UserGroupIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            ) : (
                              <UserIcon className={`h-5 w-5 ${
                                currentChat.type === 'support' 
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`} />
                            )}
                          </div>
                          {currentChat.isOnline && currentChat.type !== 'group' && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800"></div>
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {currentChat.name}
                          </h2>
                          {currentChat.type === 'group' ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {groupDetails ? (groupDetails.members || []).join(', ') : currentChat.participants?.join(', ') || ''}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {currentChat.isOnline ? 'Online' : 'Last seen recently'} • {currentChat.role}
                            </p>
                          )}
                        </div>
                      </div>
                      <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-secondary-900">
                    {loadingMessages && selectedChat === 'system' ? (
                      <div className="text-center text-gray-500 dark:text-gray-400">Loading messages...</div>
                    ) : selectedChat.startsWith('support_') ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <UserIcon className="h-12 w-12 mx-auto mb-3 text-purple-400" />
                        <p>Start a conversation with this support agent</p>
                        <p className="text-sm mt-1">Type a message below to begin</p>
                      </div>
                    ) : (
                      currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-xs lg:max-w-md">
                            {!message.isOwn && (
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {message.sender}
                              </p>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                message.isOwn
                                  ? 'bg-primary-500 text-white rounded-br-sm'
                                  : 'bg-white dark:bg-secondary-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center space-x-1 mt-1 ${
                              message.isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {message.timestamp}
                              </span>
                              {message.isOwn && getStatusIcon(message.status)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                      >
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!messageInput.trim() || sending}
                        className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {sending ? (
                          <span className="text-xs">Sending...</span>
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5" />
                        )}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Select a chat to start messaging
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Choose from your existing conversations or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communications;
