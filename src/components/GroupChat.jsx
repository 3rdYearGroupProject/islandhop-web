import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  UserGroupIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const GroupChat = ({ isOpen, onClose, participants, poolName, embedded = false }) => {
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

  if (!isOpen && !embedded) return null;

  const chatContent = (
    <div className={`w-full h-full flex flex-col ${embedded ? 'bg-transparent' : 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{poolName}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{participants?.length} participants • Group Chat</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {!embedded && (
            <>
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 sm:gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-blue-500 flex-shrink-0">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
              <div className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                msg.isOwn 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}>
                {!msg.isOwn && (
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {msg.author}
                  </p>
                )}
                <p className="text-xs sm:text-sm">{msg.message}</p>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>

      {/* Participants List (Collapsed) */}
      <div className="px-3 sm:px-4 pb-2 sm:pb-3 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active now:</span>
          <div className="flex -space-x-2">
            {participants?.slice(0, 4).map((participant, index) => (
              <div key={index} className="relative">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
              </div>
            ))}
            {participants?.length > 4 && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                  +{participants.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // If embedded, render directly without modal overlay
  if (embedded) {
    return chatContent;
  }

  // Otherwise, render as modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl h-[700px]">
        {chatContent}
      </div>
    </div>
  );
};

export default GroupChat;
