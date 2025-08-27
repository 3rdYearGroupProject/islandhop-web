import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserUID, getUserData } from '../../utils/userStorage';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Send, 
  Image, 
  Paperclip, 
  Search,
  MoreVertical,
  Star,
  MapPin,
  Clock,
  Car,
  User,
  Users,
  AlertCircle,
  Loader
} from 'lucide-react';

const DriverChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedGroupMessages, setSelectedGroupMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  // Get current user's Firebase UID and data
  const currentUserUID = getUserUID();
  console.log('Current User UID:', currentUserUID);
  const userData = getUserData();
  const currentUserName = userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : `Driver ${currentUserUID?.substring(0, 8) || 'User'}`;

  // Chat API base URL
  const CHAT_API_BASE = 'http://localhost:8090/api/v1';

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [selectedGroupMessages]);

  // Fetch user's groups
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!currentUserUID) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching groups for user:', currentUserUID);
        const response = await axios.get(`${CHAT_API_BASE}/chat/group/user/${currentUserUID}`);
        
        if (response.data && Array.isArray(response.data)) {
          const transformedGroups = response.data.map(group => ({
            id: group.groupId,
            groupName: group.groupName,
            description: group.description,
            groupType: group.groupType,
            memberCount: group.memberIds ? group.memberIds.length : 0,
            adminId: group.adminId,
            createdAt: new Date(group.createdAt),
            lastActivity: group.lastActivity ? new Date(group.lastActivity) : new Date(group.createdAt),
            unreadCount: 0, // This would need to be calculated from messages
            isAdmin: group.adminId === currentUserUID
          }));
          
          setGroups(transformedGroups);
          console.log('Fetched groups:', transformedGroups);
        } else {
          setGroups([]);
        }
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to fetch groups: ' + (err.response?.data?.message || err.message));
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [currentUserUID]);

  // Fetch messages for selected group
  const fetchGroupMessages = async (groupId) => {
    try {
      setMessagesLoading(true);
      console.log('Fetching messages for group:', groupId);
      
      const response = await axios.get(`${CHAT_API_BASE}/chat/group/${groupId}/messages?page=0&size=50`);
      
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        const messages = response.data.content.map(msg => ({
          id: msg.messageId,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.senderName || `User ${msg.senderId.substring(0, 8)}`,
          timestamp: new Date(msg.timestamp),
          messageType: msg.messageType,
          isRead: msg.isRead || false
        }));
        
        // Sort messages by timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);
        setSelectedGroupMessages(messages);
        console.log('Fetched messages:', messages);
      } else {
        setSelectedGroupMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (err.response?.status === 404) {
        setSelectedGroupMessages([]);
      } else {
        setError('Failed to fetch messages: ' + (err.response?.data?.message || err.message));
        setSelectedGroupMessages([]);
      }
    } finally {
      setMessagesLoading(false);
    }
  };

  // Auto-refresh messages for selected group
  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      const interval = setInterval(() => {
        fetchGroupMessages(selectedChat.id);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Send message to group
  const sendGroupMessage = async (groupId, content) => {
    if (!content.trim() || !currentUserUID) return;

    try {
      setSendingMessage(true);
      
      const messagePayload = {
        groupId: groupId,
        senderId: currentUserUID,
        content: content.trim(),
        messageType: 'TEXT',
        senderName: currentUserName
      };

      console.log('Sending message:', messagePayload);
      
      const response = await axios.post(`${CHAT_API_BASE}/chat/group/send`, messagePayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('Message sent successfully:', response.data);
        
        // Add the new message to the current messages
        const newMessage = {
          id: response.data.messageId || Date.now().toString(),
          content: content.trim(),
          senderId: currentUserUID,
          senderName: currentUserName,
          timestamp: new Date(),
          messageType: 'TEXT',
          isRead: true
        };

        setSelectedGroupMessages(prev => [...prev, newMessage]);
        setMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group) => {
    setSelectedChat(group);
    setSelectedGroupMessages([]);
    fetchGroupMessages(group.id);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (message.trim() && selectedChat && !sendingMessage) {
      sendGroupMessage(selectedChat.id, message);
    }
  };

  // Filter groups based on search
  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!currentUserUID) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access chat features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80  border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Group Chats</h1>
                {currentUserUID && (
                  <p className="text-sm text-gray-500">User: {currentUserUID.substring(0, 12)}...</p>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh groups"
              >
                <Loader className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Chat List */}
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-6 w-6 animate-spin text-primary-600 mr-2" />
              <span className="text-gray-600">Loading groups...</span>
            </div>
          )}

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto">
            {!loading && filteredGroups.map(group => (
              <div
                key={group.id}
                onClick={() => handleGroupSelect(group)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === group.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    {group.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {group.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {group.groupName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {group.isAdmin && (
                          <Star className="h-3 w-3 text-yellow-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(group.lastActivity)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {group.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        group.groupType === 'PRIVATE' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {group.groupType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* No Groups State */}
            {!loading && filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? "No groups match your search" 
                    : "You haven't joined any groups yet"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Group Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedChat.groupName}</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{selectedChat.memberCount} members</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          selectedChat.groupType === 'PRIVATE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedChat.groupType}
                        </span>
                        {selectedChat.isAdmin && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-600 text-xs font-medium">Admin</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{selectedChat.description}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Loading */}
              {messagesLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader className="h-6 w-6 animate-spin text-primary-600 mr-2" />
                  <span className="text-gray-600">Loading messages...</span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!messagesLoading && selectedGroupMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUserUID ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === currentUserUID
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      {msg.senderId !== currentUserUID && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === currentUserUID ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* No Messages State */}
                {!messagesLoading && selectedGroupMessages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600">Be the first to start the conversation!</p>
                  </div>
                )}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Image className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                      placeholder="Type your message..."
                      disabled={sendingMessage}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendingMessage}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {sendingMessage ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a passenger from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverChat;
