import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  UserGroupIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';

const GroupChat = ({ isOpen, onClose, participants, poolName }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'John Doe',
      message: 'Hey everyone! Just arrived in Nuwara Eliya. The weather is perfect! 🌿',
      timestamp: '2:15 PM',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isOwn: false
    },
    {
      id: 2,
      author: 'Jane Smith',
      message: 'Amazing views here! Taking so many photos 📸',
      timestamp: '2:18 PM',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isOwn: false
    },
    {
      id: 3,
      author: 'You',
      message: 'Looks incredible! Can\'t wait to see the tea plantations',
      timestamp: '2:20 PM',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isOwn: true
    },
    {
      id: 4,
      author: 'Sam Perera',
      message: 'The tea factory tour starts in 30 minutes. Everyone ready?',
      timestamp: '2:25 PM',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      isOwn: false
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: 'You',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{poolName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{participants?.length} participants</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
              <img
                src={msg.avatar}
                alt={msg.author}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.isOwn 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {!msg.isOwn && (
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {msg.author}
                    </p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Participants List (Collapsed) */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Active now:</span>
            <div className="flex -space-x-2">
              {participants?.slice(0, 4).map((participant, index) => (
                <div key={index} className="relative">
                  <img
                    src={participant.img}
                    alt={participant.name}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
                </div>
              ))}
              {participants?.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{participants.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
