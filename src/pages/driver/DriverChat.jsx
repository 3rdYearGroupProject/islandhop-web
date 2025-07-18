import React, { useState } from 'react';
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
  User
} from 'lucide-react';

const DriverChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chatList = [
    {
      id: 1,
      passenger: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1589302701986-b539f78cae26?q=80&w=1070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.9
      },
      trip: {
        id: 'TR001',
        from: 'Colombo Airport',
        to: 'Galle Fort',
        status: 'active',
        startTime: '2:30 PM'
      },
      lastMessage: {
        text: 'I\'m waiting at the pickup point',
        time: new Date(Date.now() - 5 * 60 * 1000),
        sender: 'passenger',
        unread: true
      },
      messages: [
        {
          id: 1,
          text: 'Hi! I\'m your driver for today. I\'ll be there in 5 minutes.',
          time: new Date(Date.now() - 15 * 60 * 1000),
          sender: 'driver'
        },
        {
          id: 2,
          text: 'Great! I\'m at the main entrance.',
          time: new Date(Date.now() - 12 * 60 * 1000),
          sender: 'passenger'
        },
        {
          id: 3,
          text: 'Perfect, I can see you. White Toyota Prius, plate CAR-1234',
          time: new Date(Date.now() - 10 * 60 * 1000),
          sender: 'driver'
        },
        {
          id: 4,
          text: 'I\'m waiting at the pickup point',
          time: new Date(Date.now() - 5 * 60 * 1000),
          sender: 'passenger'
        }
      ]
    },
    {
      id: 2,
      passenger: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.7
      },
      trip: {
        id: 'TR002',
        from: 'Kandy Central',
        to: 'Nuwara Eliya',
        status: 'pending',
        requestTime: '3:45 PM'
      },
      lastMessage: {
        text: 'When can you pick me up?',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'passenger',
        unread: false
      },
      messages: [
        {
          id: 1,
          text: 'Hi! I saw your trip request. I can pick you up in about 30 minutes.',
          time: new Date(Date.now() - 3 * 60 * 60 * 1000),
          sender: 'driver'
        },
        {
          id: 2,
          text: 'That works for me. I\'ll be ready.',
          time: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          sender: 'passenger'
        },
        {
          id: 3,
          text: 'When can you pick me up?',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sender: 'passenger'
        }
      ]
    },
    {
      id: 3,
      passenger: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 4.9
      },
      trip: {
        id: 'TR003',
        from: 'Ella Station',
        to: 'Colombo',
        status: 'pending',
        completedTime: '1:00 PM'
      },
      lastMessage: {
        text: 'Thank you for the great ride! ⭐⭐⭐⭐⭐',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000),
        sender: 'passenger',
        unread: false
      },
      messages: [
        {
          id: 1,
          text: 'Welcome to my car! Ready for the journey to Colombo?',
          time: new Date(Date.now() - 6 * 60 * 60 * 1000),
          sender: 'driver'
        },
        {
          id: 2,
          text: 'Yes! Thanks for accepting the partial trip.',
          time: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
          sender: 'passenger'
        },
        {
          id: 3,
          text: 'We\'ve arrived safely! Thank you for choosing IslandHop.',
          time: new Date(Date.now() - 4.2 * 60 * 60 * 1000),
          sender: 'driver'
        },
        {
          id: 4,
          text: 'Thank you for the great ride! ⭐⭐⭐⭐⭐',
          time: new Date(Date.now() - 4 * 60 * 60 * 1000),
          sender: 'passenger'
        }
      ]
    }
  ];

  const filteredChats = chatList.filter(chat =>
    chat.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.trip.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        text: message,
        time: new Date(),
        sender: 'driver'
      };
      
      // Add message to chat (in real app, this would be sent to server)
      selectedChat.messages.push(newMessage);
      setMessage('');
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80  border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={chat.passenger.avatar}
                      alt={chat.passenger.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Trip Name */}
                    <div className="text-xs font-medium text-primary-600 mb-1">
                      Trip #{chat.trip.id} - {chat.trip.from} → {chat.trip.to}
                    </div>
                    
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {chat.passenger.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {chat.lastMessage.unread && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(chat.lastMessage.time)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {/* <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-gray-500">{chat.passenger.rating}</span>
                      <span className="text-xs text-gray-400">•</span> */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chat.trip.status)}`}>
                        {chat.trip.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage.sender === 'driver' ? 'You: ' : ''}
                      {chat.lastMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedChat.passenger.avatar}
                      alt={selectedChat.passenger.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedChat.passenger.name}</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Car className="h-3 w-3" />
                        <span>Trip #{selectedChat.trip.id}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedChat.trip.status)}`}>
                          {selectedChat.trip.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600">From: {selectedChat.trip.from}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-gray-600">To: {selectedChat.trip.to}</span>
                      </div>
                    </div>
                    {selectedChat.trip.status === 'active' && (
                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Started at {selectedChat.trip.startTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'driver'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'driver' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.time)}
                      </p>
                    </div>
                  </div>
                ))}
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
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
