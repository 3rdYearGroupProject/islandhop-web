import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { 
  useChatMessages, 
  useSendMessage, 
  formatMessageTime,
  groupMessagesByDate,
  shouldShowChat 
} from '../../utils/chatService';

// Chat Component using our chat service
const TripChat = ({ tripId, tripData }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log('Send button clicked:', { messageText, sending, groupId, currentUser });
    
    if (!messageText.trim()) {
      return;
    }
    
    if (sending) {
      console.log('Already sending, skipping...');
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
      await sendMessage(messageText);
      setMessageText('');
      refreshMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Debug logging
  console.log('ChatComponent Debug:', {
    tripId,
    userId,
    groupId,
    messagesCount: messages.length,
    loading,
    error,
    currentUser: currentUser ? { uid: currentUser.uid, displayName: currentUser.displayName } : null
  });

  // Additional debug info for chat service
  console.log('ChatComponent Chat Service Debug:', {
    receivedTripId: tripId,
    receivedUserId: userId,
    foundGroupId: groupId,
    hasMessages: messages.length > 0,
    chatServiceError: error
  });

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
        {messages.length === 0 ? (
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
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {!message.isCurrentUser && (
                        <div className="text-xs font-medium mb-1 text-gray-600">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        message.isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          type="submit"
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={sending || !messageText.trim() || !groupId || !currentUser}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  );
};

export default TripChat;
