// Chat service for handling messaging functionality
import { useState, useEffect } from 'react';

// Get user groups from the chat API
const getUserGroups = async (userId) => {
  try {
    console.log(`Fetching groups for user: ${userId}`);
    const response = await fetch(`http://localhost:8090/api/v1/chat/group/user/${userId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch user groups. Status: ${response.status}, Error: ${errorText}`);
      throw new Error(`Failed to fetch user groups: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('User groups response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Chat service is not available. Please check if the chat server is running on http://localhost:8090');
    }
    throw error;
  }
};

// Find the group for a specific trip
const findTripGroup = (groups, tripId) => {
  console.log('Finding trip group for tripId:', tripId);
  console.log('Available groups:', groups);
  
  if (!groups || !Array.isArray(groups)) {
    console.warn('Groups is not an array:', groups);
    return null;
  }
  
  // Try to find exact match first
  let tripGroup = groups.find(group => group.tripId === tripId);
  
  if (!tripGroup) {
    // Try alternative matching if exact match fails
    console.log('Exact match failed, trying alternative matching strategies...');
    
    // Try matching with different possible ID fields
    tripGroup = groups.find(group => 
      group.tripId === tripId ||
      group._id === tripId ||
      group.id === tripId ||
      group.trip === tripId ||
      group.trip_id === tripId
    );
  }
  
  if (!tripGroup) {
    console.warn('No group found for tripId:', tripId);
    console.log('Available group tripIds:', groups.map(g => ({ groupId: g.id, tripId: g.tripId, groupName: g.name })));
  } else {
    console.log('Found group:', tripGroup);
  }
  
  return tripGroup;
};

// Get messages for a specific group
const getGroupMessages = async (groupId, page = 0, size = 20) => {
  try {
    console.log(`Fetching messages for group: ${groupId}, page: ${page}, size: ${size}`);
    const response = await fetch(`http://localhost:8090/api/v1/chat/group/${groupId}/messages?page=${page}&size=${size}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch group messages. Status: ${response.status}, Error: ${errorText}`);
      throw new Error(`Failed to fetch group messages: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Group messages response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching group messages:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Chat service is not available. Please check if the chat server is running on http://localhost:8090');
    }
    throw error;
  }
};

// Send message to group
const sendMessageToGroup = async (groupId, senderId, content, senderName, messageType = 'TEXT') => {
  try {
    console.log(`Sending message to group: ${groupId}, from: ${senderId} (${senderName})`);
    const payload = {
      groupId,
      senderId,
      content,
      messageType,
      senderName
    };
    console.log('Message payload:', payload);
    
    const response = await fetch('http://localhost:8090/api/v1/chat/group/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send message. Status: ${response.status}, Error: ${errorText}`);
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Chat service is not available. Please check if the chat server is running on http://localhost:8090');
    }
    throw error;
  }
};

export const useChatMessages = (tripId, userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh messages
  const refreshMessages = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Fetch messages when component mounts or refresh is triggered
  useEffect(() => {
    const fetchMessages = async () => {
      if (!tripId || !userId) {
        console.warn('Missing required parameters for chat:', { tripId, userId });
        setLoading(false);
        if (!tripId) {
          setError('Trip ID is required for chat functionality');
        }
        return;
      }

      // Validate that tripId is not just a trip name
      if (typeof tripId === 'string' && tripId.length < 20 && !tripId.includes('-')) {
        console.warn('TripId appears to be a trip name rather than a valid ID:', tripId);
        setError('Invalid trip ID format for chat');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Get user groups
        console.log('Fetching groups for user:', userId);
        const groups = await getUserGroups(userId);
        console.log('User groups:', groups);

        // 2. Find the group for this trip
        const tripGroup = findTripGroup(groups, tripId);
        console.log('Trip group found:', tripGroup);

        if (!tripGroup) {
          console.log('No group found for trip:', tripId);
          setMessages([]);
          setLoading(false);
          return;
        }

        setGroupId(tripGroup.id);

        // 3. Get messages for the group
        console.log('Fetching messages for group:', tripGroup.id);
        const groupMessages = await getGroupMessages(tripGroup.id);
        console.log('Group messages:', groupMessages);

        // Transform messages to match the expected format
        const transformedMessages = (groupMessages.content || groupMessages || []).map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderName,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: msg.senderId === userId,
          messageType: msg.messageType
        }));

        setMessages(transformedMessages);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages. Please check if chat service is running.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [tripId, userId, refreshTrigger]);

  return { messages, loading, error, groupId, refreshMessages };
};

export const useSendMessage = (tripId, userId, userDisplayName = 'User') => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (messageText, groupId) => {
    if (!messageText.trim() || !groupId) return null;

    try {
      setSending(true);
      setError(null);

      console.log('Sending message to group:', groupId);
      const response = await sendMessageToGroup(
        groupId,
        userId,
        messageText.trim(),
        userDisplayName,
        'TEXT'
      );

      console.log('Message sent successfully:', response);
      setSending(false);
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      setSending(false);
      throw err;
    }
  };

  return { sendMessage, sending, error };
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
  formatMessageTime,
  groupMessagesByDate,
  shouldShowChat
};
