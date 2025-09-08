import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { 
  useChatMessages, 
  useSendMessage, 
  formatMessageTime,
  groupMessagesByDate,
  shouldShowChat 
} from '../../utils/chatService';

/**
 * TripChat Component
 * 
 * Handles real-time chat functionality for trips with drivers and guides.
 * 
 * API Endpoint: http://localhost:8090/api/v1/chat/group/send
 * Message Structure:
 * {
 *   "groupId": "group_123456789",
 *   "senderId": "user123", 
 *   "content": "Hey everyone! Ready for our Sri Lanka adventure?",
 *   "messageType": "TEXT",
 *   "senderName": "John Doe"
 * }
 */

// Chat Component using our chat service
const TripChat = ({ tripId, tripData }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const userId = currentUser?.uid;
  const userDisplayName = currentUser?.displayName || currentUser?.email || 'User';
  
  const { messages, loading, error, groupId, refreshMessages } = useChatMessages(tripId, userId);
  const { sendMessage, sending } = useSendMessage(tripId, userId, userDisplayName);
  const [messageText, setMessageText] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, optimisticMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) {
      return;
    }
    
    if (sending) {
      return;
    }
    
    if (!groupId) {
      console.error('No group ID available for sending message');
      return;
    }
    
    if (!currentUser) {
      console.error('No current user available for sending message');
      return;
    }

    try {
      // Add optimistic message for immediate UI feedback
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        text: messageText,
        sender: userDisplayName,
        timestamp: new Date(),
        isCurrentUser: true,
        messageType: 'TEXT',
        isOptimistic: true
      };
      
      setOptimisticMessages(prev => [...prev, optimisticMessage]);
      setMessageText('');
      
      await sendMessage(messageText, groupId);
      
      // Remove optimistic message and refresh to get real message
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      refreshMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => !msg.isOptimistic));
    }
  };

  const groupedMessages = groupMessagesByDate([...messages, ...optimisticMessages]);

  // Only log errors and important debugging info
  if (error) {
    console.error('TripChat Error:', {
      tripId,
      userId,
      error,
      groupId
    });
  }

  if (loading) {
    return (
      <div className="border rounded-lg bg-gray-50 h-64 mb-4 p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg bg-red-50 h-64 mb-4 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-2">Error loading chat</p>
          <p className="text-sm">{error}</p>
          {error.includes('Trip ID') && (
            <div className="mt-3 text-xs bg-red-100 p-2 rounded">
              <p><strong>Debug Info:</strong></p>
              <p>Trip ID: {tripId}</p>
              <p>User ID: {userId}</p>
              <p>Check console for more details</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Messages Area */}
      <div className="border rounded-lg bg-gray-50 h-64 mb-4 p-4 overflow-y-auto">
        {messages.length === 0 && optimisticMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-400 mb-2">{date}</div>
                {dayMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isCurrentUser 
                          ? `bg-blue-600 text-white ${message.isOptimistic ? 'opacity-70' : ''}` 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {!message.isCurrentUser && (
                        <div className="text-xs font-medium mb-1 text-gray-600">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        message.isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                        {message.isOptimistic && (
                          <span className="text-xs">📤</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={groupId ? "Type your message..." : "Connecting to chat..."}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          disabled={sending || !groupId || !currentUser}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sending || !messageText.trim() || !groupId || !currentUser
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={sending || !messageText.trim() || !groupId || !currentUser}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  );
};

export default TripChat;
