// Chat service for handling messaging functionality
import { useState, useEffect, useRef } from 'react';

// Mock data for demonstration - replace with actual API calls
const mockMessages = [
  {
    id: 1,
    sender: 'driver',
    senderName: 'Ravi (Driver)',
    message: 'Hi! I\'m your assigned driver for the trip. I\'ll be picking you up at 9 AM tomorrow.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'driver'
  },
  {
    id: 2,
    sender: 'user',
    senderName: 'You',
    message: 'Great! What type of vehicle will you be using?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    type: 'user'
  },
  {
    id: 3,
    sender: 'guide',
    senderName: 'Priya (Guide)',
    message: 'Hello! I\'m your tour guide. I have some great insights about the places you\'ll be visiting!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: 'guide'
  },
  {
    id: 4,
    sender: 'driver',
    senderName: 'Ravi (Driver)',
    message: 'I\'ll be using a comfortable sedan. It has AC and plenty of space for your luggage.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    type: 'driver'
  }
];

export const useChatMessages = (tripId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/trips/${tripId}/messages`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data for now
        setMessages(mockMessages);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    if (tripId && userId) {
      fetchMessages();
    }
  }, [tripId, userId]);

  return { messages, loading, error, isOnline };
};

export const useSendMessage = (tripId, userId) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (messageText, messageType = 'user') => {
    if (!messageText.trim()) return null;

    try {
      setSending(true);
      setError(null);

      const newMessage = {
        id: Date.now(),
        sender: 'user',
        senderName: 'You',
        message: messageText.trim(),
        timestamp: new Date(),
        type: messageType
      };

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/trips/${tripId}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     message: messageText.trim(),
      //     type: messageType,
      //     userId: userId
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }
      // 
      // const data = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSending(false);
      return newMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      setSending(false);
      throw err;
    }
  };

  return { sendMessage, sending, error };
};

export const useTypingIndicator = (tripId) => {
  const [typingUsers, setTypingUsers] = useState([]);

  const setTyping = (isTyping) => {
    // TODO: Implement real-time typing indicators
    // This would typically use WebSockets or Socket.IO
    console.log('User typing:', isTyping);
  };

  return { typingUsers, setTyping };
};

// Utility function to format message timestamps
export const formatMessageTime = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    return messageTime.toLocaleDateString();
  }
};

// Utility function to group messages by date
export const groupMessagesByDate = (messages) => {
  const groups = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
};

// Utility function to check if chat should be enabled
export const shouldShowChat = (trip) => {
  return trip && (trip.driverNeeded === 1 || trip.guideNeeded === 1);
};

export default {
  useChatMessages,
  useSendMessage,
  useTypingIndicator,
  formatMessageTime,
  groupMessagesByDate,
  shouldShowChat
};
