import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../firebase";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon as CheckIconSolid } from "@heroicons/react/24/solid";
import { getAuth } from "firebase/auth";
import userServicesApi from "../../api/axios";
import axios from "axios"; // Import axios for HTTP requests

const Communications = () => {
  const [selectedChat, setSelectedChat] = useState("system");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [supportAgents, setSupportAgents] = useState([]);
  const [loadingSupportAgents, setLoadingSupportAgents] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true); // New state for loading chats
  const messagesEndRef = useRef(null);

  // Chats state: system group and personal conversations from backend
  const [chats, setChats] = useState([
    {
      id: "system",
      name: "System",
      type: "group",
      avatar: null,
      lastMessage: "",
      lastTime: "",
      unreadCount: 0,
      isOnline: true,
      participants: [],
    },
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
      console.log("Fetching support agents from backend");
      const response = await axios.get("http://localhost:4011/users/support");
      console.log('Fetched users:', response.data);

      if (response.data.success) {
        // Filter only support agents
        const supportUsers = response.data.data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          contactNo: user.contact_no,
          address: user.address,
          profilePicture: user.profile_picture,
          permission: user.permission,
          type: 'support',
          avatar: user.profile_picture || null,
          lastMessage: '',
          lastTime: '',
          unreadCount: 0,
          isOnline: user.status === 'ACTIVE',
          role: 'Support Agent'
        }));

        console.log('Support agents found:', supportUsers);
        setSupportAgents(supportUsers);

        // Add support agents to chats
        setChats(prev => [
          prev[0], // Keep system group
          ...supportUsers.map(agent => ({
            id: `support_${agent.email}`,
            name: `${agent.firstName} ${agent.lastName}`.trim() || agent.email, // Use full name if available, fallback to email
            ...agent
          }))
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
        console.error("Could not get user ID for agent:", agentEmail);
        return;
      }

      const currentUserId = auth.currentUser.uid;

      // Create conversation payload
      const conversationPayload = {
        senderId: currentUserId,
        receiverId: userId,
        content: `Hello! This is an admin message.`,
        messageType: "TEXT",
        senderName: auth.currentUser?.displayName || "Admin",
      };

      // Send initial message to create conversation
      const response = await fetch(
        "http://localhost:8090/api/v1/chat/personal/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(conversationPayload),
        }
      );
      console.log(
        "Starting conversation with agent:",
        agentEmail,
        "Payload:",
        conversationPayload
      );

      if (response.ok) {
        console.log("Conversation started with agent:", agentEmail);
        // Refresh personal conversations
        fetchPersonalConversations();
      } else {
        console.error(
          "Failed to start conversation with agent:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error starting conversation with agent:", error);
    }
  };
  const fetchDisplayNameFromBackend = async (userId) => {
    console.log(`Fetching display name for user: ${userId}`);
    if (userDisplayNames[userId]) {
      console.log(
        `Display name already cached for ${userId}: ${userDisplayNames[userId]}`
      );
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
        return userId;
      }
    } catch (error) {
      console.error(`Error fetching display name for ${userId}:`, error);
      return userId;
    }
  };

  // Fetch personal conversations for current user
  const fetchPersonalConversations = async () => {
    if (authToken && auth.currentUser) {
      console.log(
        `Fetching personal conversations for user: ${auth.currentUser.uid}`
      );
      const userId = auth.currentUser.uid;

      try {
        // ORIGINAL API CALL - TEMPORARILY DISABLED
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
        /*
        // TEMPORARILY DISABLED - Use mock conversations
        console.log("Using mock personal conversations");
        const mockConversations = [
          {
            conversationId: "conv_1",
            receiverId: "mock_user_id_sarah",
            lastMessage: "Hello, how can I help you today?",
            lastMessageTime: new Date().toISOString(),
            isOnline: true,
            receiverRole: "Support Agent",
          },
          {
            conversationId: "conv_2",
            receiverId: "mock_user_id_mike",
            lastMessage: "I will look into this issue for you.",
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            isOnline: false,
            receiverRole: "Support Agent",
          },
        ];

        console.log("Mock personal conversations:", mockConversations);
        setPersonalConversations(mockConversations);

        // Fetch display names for all receivers
        const conversationsWithNames = await Promise.all(
          mockConversations.map(async (conv) => {
            const displayName = await fetchDisplayNameFromBackend(
              conv.receiverId
            );
            return {
              id: conv.conversationId,
              name: displayName,
              type: "personal",
              avatar: null,
              lastMessage: conv.lastMessage || "",
              lastTime: conv.lastMessageTime
                ? new Date(conv.lastMessageTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "",
              unreadCount: 0,
              isOnline: conv.isOnline || false,
              role: conv.receiverRole || "",
              receiverId: conv.receiverId, // Store the actual receiverId
            };
          })
        );

        // Add to chats state (keep system group and support agents)
        setChats((prev) => {
          const systemChat = prev.find((chat) => chat.id === "system");
          const supportChats = prev.filter((chat) => chat.type === "support");
          return [
            systemChat,
            ...supportChats,
            ...conversationsWithNames,
          ].filter(Boolean);
        });

        // Mock unread counts
        setUnreadCounts({
          conv_1: 2,
          conv_2: 0,
        });
        */
      } catch (error) {
        console.error("Error fetching personal conversations:", error);
      }
    }
  };

  useEffect(() => {
    fetchPersonalConversations();
  }, [authToken, auth.currentUser, userDisplayNames]);


// Fetch personal messages for selected chat
useEffect(() => {
  if (selectedChat !== "system" && authToken && auth.currentUser) {
    console.log("Selected chat:", selectedChat);
    
    // Handle support agent chats
    if (selectedChat.startsWith("support_")) {
      const agentEmail = selectedChat.replace("support_", "");
      console.log("Fetching messages for support agent:", agentEmail);
      
      // Get the receiver ID dynamically
      const fetchMessagesForAgent = async () => {
        const receiverId = await getUserIdByEmail(agentEmail);
        if (!receiverId) {
          console.error("Could not get receiver ID for agent:", agentEmail);
          return;
        }
        
        const senderId = auth.currentUser.uid;
        
        fetch(`http://localhost:8090/api/v1/chat/personal/messages?senderId=${senderId}&receiverId=${receiverId}&page=0&size=20`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
          .then(res => res.json())
          .then(async (data) => {
            console.log('Fetched support agent messages:', data);
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
          })
          .catch(error => {
            console.error("Error fetching support agent messages:", error);
          });
      };
      
      fetchMessagesForAgent();
    } else {
      // Handle regular personal conversations
      const conversation = chats.find((c) => c.id === selectedChat);
      if (!conversation || !conversation.receiverId) return;

      const senderId = auth.currentUser.uid;
      const receiverId = conversation.receiverId;

      fetch(`http://localhost:8090/api/v1/chat/personal/messages?senderId=${senderId}&receiverId=${receiverId}&page=0&size=20`, {
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
          console.log("Display name:", currentUser.displayName);
        } catch (err) {
          setAuthToken("");
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
    if (selectedChat === "system" && authToken) {
      // ORIGINAL API CALLS - TEMPORARILY DISABLED
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages, personalMessages, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    console.log(`Sending message to ${selectedChat}:`, messageInput);

    if (selectedChat === "system") {
      setSending(true);
      try {
        // ORIGINAL API CALL - TEMPORARILY DISABLED
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
        console.error("Error sending group message:", err);
      }
      setSending(false);
    } else if (selectedChat.startsWith("support_")) {
  // Handle support agent messaging
  setSending(true);
  const agentEmail = selectedChat.replace("support_", "");

  try {
    // Get the receiver ID dynamically
    const receiverId = await getUserIdByEmail(agentEmail);
    if (!receiverId) {
      console.error("Could not get user ID for agent:", agentEmail);
      setSending(false);
      return;
    }

    const messagePayload = {
      senderId: auth.currentUser.uid,
      receiverId,
      content: messageInput,
      messageType: 'TEXT',
    };
    console.log('Support agent message payload:', messagePayload);
    
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
      
      // Refresh messages
      const senderId = auth.currentUser.uid;
      fetch(`http://localhost:8090/api/v1/chat/personal/messages?senderId=${senderId}&receiverId=${receiverId}&page=0&size=20`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(async (data) => {
          const messages = Array.isArray(data.content) ? data.content : [];
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
      console.error('Failed to send message to support agent:', res.status);
    }

  } catch (err) {
    console.error("Error sending message to support agent:", err);
  }
  setSending(false);
}
else {
  // Personal chat
  setSending(true);
  const userId = auth.currentUser.uid;
  const conversation = chats.find((c) => c.id === selectedChat);
  if (!conversation || !conversation.receiverId) return;
  
  const receiverId = conversation.receiverId;

  try {
    const messagePayload = {
      senderId: userId,
      receiverId,
      content: messageInput,
      messageType: 'TEXT',
      senderName: auth.currentUser?.displayName || 'Admin'
    };
    console.log('Personal message payload:', messagePayload);
    
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
          const messages = Array.isArray(data.content) ? data.content : [];
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
    console.error("Error sending personal message:", err);
  }
  setSending(false);
}
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckIcon className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return (
          <div className="flex">
            <CheckIcon className="h-3 w-3 text-gray-400 -mr-1" />
            <CheckIcon className="h-3 w-3 text-gray-400" />
          </div>
        );
      case "read":
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

  const currentChat =
    chats.find((chat) => chat.id === selectedChat) ||
    (selectedChat.startsWith("support_")
      ? supportAgents.find(
          (agent) => selectedChat === `support_${agent.email}`
        ) && {
          id: selectedChat,
          name: (() => {
            const agent = supportAgents.find(
              (agent) => selectedChat === `support_${agent.email}`
            );
            return agent
              ? `${agent.firstName} ${agent.lastName}`
              : "Support Agent";
          })(),
          type: "support",
          isOnline: (() => {
            const agent = supportAgents.find(
              (agent) => selectedChat === `support_${agent.email}`
            );
            return agent ? agent.status === "ACTIVE" : false;
          })(),
          role: "Support Agent",
        }
      : null);



  const currentMessages =
  selectedChat === "system"
    ? groupMessages.map((msg) => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "",
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: "read",
      }))
    : (personalMessages[selectedChat] || []).map((msg) => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "",
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: msg.read ? "read" : "delivered",
      }));

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        await fetchSupportAgents(); // Fetch support agents as part of chats
        // Add any additional chat fetching logic here if needed
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, []); // Fetch chats on component mount

  if (loadingChats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-secondary-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl shadow-sm border border-primary-200 dark:border-primary-700 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
              {/* Sidebar content - blue background now covers entire card */}
              <div className="p-6 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-primary-900 dark:text-primary-100 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400" />
                    Communications
                  </h2>
                </div>

                {/* Recent Conversations Section - moved to top */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    Recent Conversations
                  </h3>
                  <div className="space-y-3">
                    {chats
                      .filter((chat) => chat.type !== "support")
                      .map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`p-4 cursor-pointer rounded-xl mb-3 transition-all duration-200 transform hover:scale-[1.02] ${
                            selectedChat === chat.id
                              ? "bg-primary-50 dark:bg-primary-900/30 shadow-md border-2 border-primary-300 dark:border-primary-600"
                              : "hover:bg-gray-50 dark:hover:bg-secondary-700/50 border-2 border-transparent"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                  chat.type === "group"
                                    ? "bg-primary-100 dark:bg-primary-900/30"
                                    : "bg-gray-100 dark:bg-secondary-600"
                                }`}
                              >
                                {chat.type === "group" ? (
                                  <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                ) : (
                                  <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                )}
                              </div>
                              {chat.isOnline && chat.type === "personal" && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800 shadow-sm"></div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {chat.name}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                                  {chat.lastTime}
                                </span>
                              </div>

                              {chat.type === "personal" && (
                                <div className="mb-1">
                                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                                    {chat.role}
                                  </p>
                                  {chat.type === "support" && chat.address && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      📍 {chat.address}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {chat.lastMessage || "No messages yet"}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 ml-2 font-semibold shadow-sm">
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

                {/* Support Agents Section - now stretches to bottom */}
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-200 uppercase tracking-wide">
                        Support Team
                      </h3>
                      <button
                        onClick={fetchSupportAgents}
                        disabled={loadingSupportAgents}
                        className="p-2 rounded-xl text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-white/50 dark:hover:bg-primary-800/30 transition-all duration-200 shadow-sm"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {loadingSupportAgents && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {supportAgents.map((agent) => (
              // Update the onClick handler for support agents
<button
  key={agent.email}
  onClick={async () => {
    setSelectedChat(`support_${agent.email}`);
    
    // Fetch the Firebase UID for this agent
    const agentUid = await getUserIdByEmail(agent.email);
    if (agentUid) {
      // Store the UID in a state or in the chat object
      setChats(prev => prev.map(chat => 
        chat.id === `support_${agent.email}` 
          ? { ...chat, receiverId: agentUid }
          : chat
      ));
    }
  }}
  className={`w-full p-3 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] ${
    selectedChat === `support_${agent.email}`
      ? "bg-white dark:bg-secondary-700 shadow-md border-2 border-primary-300 dark:border-primary-600"
      : "hover:bg-white/60 dark:hover:bg-secondary-700/50 border-2 border-transparent"
  }`}
>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
                              <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            {agent.status === "ACTIVE" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800 shadow-sm"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {agent.firstName} {agent.lastName}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              Support Agent
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-gray-200 dark:border-secondary-700 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-secondary-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                              currentChat.type === "group"
                                ? "bg-primary-100 dark:bg-primary-900/30"
                                : currentChat.type === "support"
                                ? "bg-purple-100 dark:bg-purple-900/30"
                                : "bg-gray-100 dark:bg-secondary-600"
                            }`}
                          >
                            {currentChat.type === "group" ? (
                              <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            ) : (
                              <UserIcon
                                className={`h-6 w-6 ${
                                  currentChat.type === "support"
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              />
                            )}
                          </div>
                          {currentChat.isOnline &&
                            currentChat.type !== "group" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800 shadow-sm"></div>
                            )}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {currentChat.name}
                          </h2>
                          {currentChat.type === "group" ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {groupDetails
                                ? (groupDetails.members || []).join(", ")
                                : currentChat.participants?.join(", ") ||
                                  "System Group Chat"}
                            </p>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  currentChat.isOnline
                                    ? "bg-success-500"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {currentChat.isOnline
                                    ? "Online"
                                    : "Last seen recently"}{" "}
                                  • {currentChat.role}
                                </p>
                                {currentChat.type === "support" && (
                                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    {currentChat.contactNo && (
                                      <span>📞 {currentChat.contactNo}</span>
                                    )}
                                    {currentChat.address && (
                                      <span>📍 {currentChat.address}</span>
                                    )}
                                    {currentChat.email && (
                                      <span>✉️ {currentChat.email}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-secondary-600 transition-all duration-200">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

            
{/* Messages */}
<div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-secondary-900">
  {loadingMessages && selectedChat === "system" ? (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-500 dark:text-gray-400">
          Loading messages...
        </p>
      </div>
    </div>
  ) : currentMessages.length === 0 ? (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UserIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Start a Conversation
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Send a message to begin chatting
        </p>
      </div>
    </div>
  ) : (
    currentMessages.map((message) => (
      <div
        key={message.id}
        className={`flex ${
          message.isOwn ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md ${
            message.isOwn ? "order-2" : "order-1"
          }`}
        >
          {!message.isOwn && (
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 ml-1">
              {message.sender}
            </p>
          )}
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              message.isOwn
                ? "bg-primary-500 text-white rounded-br-md ml-auto"
                : "bg-white dark:bg-secondary-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-secondary-600"
            }`}
          >
            <p className="text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
          <div
            className={`flex items-center space-x-2 mt-2 ${
              message.isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
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
                  <div className="p-6 bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-secondary-600">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full px-6 py-3 border-2 border-gray-200 dark:border-secondary-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!messageInput.trim() || sending}
                        className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {sending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5" />
                        )}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Welcome to Communications
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Select a conversation from the sidebar to start messaging
                      with your team members or support agents.
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
