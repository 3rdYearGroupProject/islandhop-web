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
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        {/* ...existing code... */}
      </div>
    </div>
  );
}

export default Communications;
