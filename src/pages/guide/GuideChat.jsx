import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  MapPin,
  Clock,
  CheckCheck,
  Circle,
  Star,
  Image as ImageIcon,
  X,
  Filter
} from 'lucide-react';

const GuideChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 'conv001',
      tourist: {
        name: 'Emily Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
        status: 'online',
        rating: 4.8
      },
      lastMessage: 'Thank you for the wonderful tour! The temple was amazing.',
      timestamp: '2 min ago',
      unreadCount: 0,
      tour: 'Kandy Cultural Heritage Tour',
      tourDate: '2024-12-15',
      messages: [
        {
          id: 'msg001',
          sender: 'tourist',
          content: 'Hi! I have some questions about tomorrow\'s tour.',
          timestamp: '2024-12-14T10:30:00Z',
          status: 'read'
        },
        {
          id: 'msg002',
          sender: 'guide',
          content: 'Hello Emily! I\'d be happy to help. What would you like to know?',
          timestamp: '2024-12-14T10:32:00Z',
          status: 'read'
        },
        {
          id: 'msg003',
          sender: 'tourist',
          content: 'What should we wear to the temple? And is lunch included?',
          timestamp: '2024-12-14T10:35:00Z',
          status: 'read'
        },
        {
          id: 'msg004',
          sender: 'guide',
          content: 'Great questions! Please wear modest clothing covering shoulders and knees for the temple. Yes, traditional Sri Lankan lunch is included in the package.',
          timestamp: '2024-12-14T10:37:00Z',
          status: 'read'
        },
        {
          id: 'msg005',
          sender: 'tourist',
          content: 'Perfect! We\'re really excited. See you tomorrow at 9 AM.',
          timestamp: '2024-12-14T10:40:00Z',
          status: 'read'
        },
        {
          id: 'msg006',
          sender: 'guide',
          content: 'Looking forward to it! I\'ll be waiting at the pickup point. Have a great evening!',
          timestamp: '2024-12-14T10:42:00Z',
          status: 'read'
        },
        {
          id: 'msg007',
          sender: 'tourist',
          content: 'Thank you for the wonderful tour! The temple was amazing.',
          timestamp: '2024-12-15T16:30:00Z',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'conv002',
      tourist: {
        name: 'Marco Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        status: 'offline',
        rating: 4.6
      },
      lastMessage: 'What time should we start the hike?',
      timestamp: '1 hour ago',
      unreadCount: 2,
      tour: 'Ella Adventure Trek',
      tourDate: '2024-12-16',
      messages: [
        {
          id: 'msg008',
          sender: 'tourist',
          content: 'Hey! Super excited about tomorrow\'s trek.',
          timestamp: '2024-12-14T15:00:00Z',
          status: 'read'
        },
        {
          id: 'msg009',
          sender: 'tourist',
          content: 'What time should we start the hike?',
          timestamp: '2024-12-14T15:30:00Z',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'conv003',
      tourist: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        status: 'online',
        rating: 4.9
      },
      lastMessage: 'Can you recommend some vegetarian restaurants?',
      timestamp: '3 hours ago',
      unreadCount: 1,
      tour: 'Colombo Food Discovery',
      tourDate: '2024-12-17',
      messages: [
        {
          id: 'msg010',
          sender: 'tourist',
          content: 'Hi! Looking forward to the food tour.',
          timestamp: '2024-12-14T12:00:00Z',
          status: 'read'
        },
        {
          id: 'msg011',
          sender: 'guide',
          content: 'Hello Sarah! It\'s going to be delicious. Any dietary restrictions I should know about?',
          timestamp: '2024-12-14T12:05:00Z',
          status: 'read'
        },
        {
          id: 'msg012',
          sender: 'tourist',
          content: 'I\'m vegetarian, and I can\'t handle very spicy food.',
          timestamp: '2024-12-14T12:10:00Z',
          status: 'read'
        },
        {
          id: 'msg013',
          sender: 'guide',
          content: 'No problem! I know some amazing vegetarian spots with mild spice levels. You\'ll love the traditional rice and curry.',
          timestamp: '2024-12-14T12:15:00Z',
          status: 'read'
        },
        {
          id: 'msg014',
          sender: 'tourist',
          content: 'Can you recommend some vegetarian restaurants?',
          timestamp: '2024-12-14T13:00:00Z',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'conv004',
      tourist: {
        name: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'offline',
        rating: 4.7
      },
      lastMessage: 'Thanks for an incredible experience!',
      timestamp: '1 day ago',
      unreadCount: 0,
      tour: 'Sigiriya Historical Tour',
      tourDate: '2024-12-12',
      tourCompleted: true,
      messages: [
        {
          id: 'msg015',
          sender: 'tourist',
          content: 'Thanks for an incredible experience!',
          timestamp: '2024-12-12T17:00:00Z',
          status: 'read'
        },
        {
          id: 'msg016',
          sender: 'guide',
          content: 'It was my pleasure! Thank you for being such wonderful guests.',
          timestamp: '2024-12-12T17:05:00Z',
          status: 'read'
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tour.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: `msg${Date.now()}`,
      sender: 'guide',
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          timestamp: 'now'
        };
      }
      return conv;
    }));

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, message],
      lastMessage: newMessage,
      timestamp: 'now'
    };
    setSelectedChat(updatedChat);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <Circle className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className=" rounded-xl   h-[calc(100vh-8rem)] flex">
        
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                  selectedChat?.id === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.tourist.avatar}
                      alt={conversation.tourist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conversation.tourist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.tourist.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-600">{conversation.tourist.rating}</span>
                    </div>

                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage}
                    </p>

                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{conversation.tour}</span>
                      {conversation.tourCompleted && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedChat.tourist.avatar}
                        alt={selectedChat.tourist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        selectedChat.tourist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedChat.tourist.name}</h2>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>{selectedChat.tour}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{selectedChat.tourDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'guide' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'guide'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        message.sender === 'guide' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'guide' && (
                          <div className="ml-2">
                            {getMessageStatus(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // No Chat Selected
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start chatting with your tourists.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideChat;
