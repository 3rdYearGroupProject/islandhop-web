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
  CheckIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

const Communications = () => {
  const [selectedChat, setSelectedChat] = useState('system');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
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
  
  // Function to fetch display name from backend
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
  useEffect(() => {
    if (authToken && auth.currentUser) {
        console.log(`Fetching personal conversations for user: ${auth.currentUser.uid}`);
      const userId = auth.currentUser.uid;
      fetch(`http://localhost:8090/api/v1/chat/personal/conversations/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(async (data) => {
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
          
          // Add to chats state
          setChats(prev => [
            prev[0], // system group
            ...conversationsWithNames
          ]);
        });
      // Fetch unread counts
      fetch(`http://localhost:8090/api/v1/chat/personal/unread-count/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUnreadCounts(data || {});
        });
    }
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

  const filteredChats = chats.filter(chat =>
    (chat.name ? chat.name.toLowerCase() : '').includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const currentMessages = selectedChat === 'system'
    ? groupMessages.map(msg => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: 'read'
      }))
    : (personalMessages[selectedChat] || []).map(msg => ({
        id: msg.id,
        sender: msg.senderName || msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
        isOwn: msg.senderId === auth.currentUser?.uid,
        status: msg.read ? 'read' : 'delivered'
      }));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white dark:bg-secondary-800 border-r border-gray-200 dark:border-secondary-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-primary-500" />
              Communications
            </h1>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
                        : 'bg-gray-100 dark:bg-secondary-600'
                    }`}>
                      {currentChat.type === 'group' ? (
                        <UserGroupIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    {currentChat.isOnline && currentChat.type === 'personal' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-secondary-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {currentChat.name}
                    </h2>
                    {currentChat.type === 'group' ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {groupDetails ? (groupDetails.members || []).join(', ') : currentChat.participants.join(', ')}
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
  );
};

export default Communications;
