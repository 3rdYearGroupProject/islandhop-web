import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon,
  PaperAirplaneIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const ChatEmailSupport = () => {
  const [threads, setThreads] = useState([
    {
      id: 'TH-001',
      type: 'Chat',
      user: {
        name: 'Ayesha Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        email: 'ayesha.fernando@email.com',
      },
      subject: 'Booking confirmation not received',
      resolved: false,
      messages: [
        {
          from: 'user',
          text: 'Hi, I booked a ride but did not get a confirmation email.',
          time: '09:12',
        },
        {
          from: 'agent',
          text: 'Hello Ayesha, let me check your booking status.',
          time: '09:13',
        },
      ],
    },
    {
      id: 'TH-002',
      type: 'Email',
      user: {
        name: 'Ruwan Silva',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
        email: 'ruwan.silva@email.com',
      },
      subject: 'Refund request for cancelled trip',
      resolved: false,
      messages: [
        {
          from: 'user',
          text: 'My trip was cancelled by the driver. How do I get a refund?',
          time: '08:45',
        },
        {
          from: 'agent',
          text: 'Hi Ruwan, I will assist you with the refund process.',
          time: '08:46',
        },
      ],
    },
    {
      id: 'TH-003',
      type: 'Chat',
      user: {
        name: 'Ishara Perera',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        email: 'ishara.p@email.com',
      },
      subject: 'Lost item in vehicle',
      resolved: true,
      messages: [
        {
          from: 'user',
          text: 'I left my suitcase in the car after my trip.',
          time: '07:30',
        },
        {
          from: 'agent',
          text: 'We have contacted the driver and will update you soon.',
          time: '07:32',
        },
        {
          from: 'agent',
          text: 'Your suitcase has been found and will be delivered today.',
          time: '08:10',
        },
        {
          from: 'user',
          text: 'Thank you so much!',
          time: '08:12',
        },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState(threads[0].id);
  const [input, setInput] = useState('');

  const selectedThread = threads.find((t) => t.id === selectedId);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      from: 'agent',
      text: input,
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    setThreads(threads.map(thread => 
      thread.id === selectedId 
        ? { ...thread, messages: [...thread.messages, newMessage] }
        : thread
    ));
    setInput('');
  };

  const handleMarkResolved = () => {
    setThreads(threads.map(thread => 
      thread.id === selectedId 
        ? { ...thread, resolved: true }
        : thread
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chat & Email Support
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer conversations and email support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Thread List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-secondary-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={`p-4 border-b border-gray-100 dark:border-secondary-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200 ${
                    selectedId === thread.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={thread.user.avatar}
                      alt={thread.user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-secondary-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {thread.type === 'Chat' ? (
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <EnvelopeIcon className="h-4 w-4 text-info-600 dark:text-info-400" />
                        )}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {thread.type}
                        </span>
                        {thread.resolved && (
                          <CheckCircleIcon className="h-4 w-4 text-success-600 dark:text-success-400" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {thread.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {thread.subject}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {thread.messages[thread.messages.length - 1]?.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedThread && (
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedThread.user.avatar}
                      alt={selectedThread.user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-secondary-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedThread.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedThread.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedThread.type === 'Chat' ? (
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <EnvelopeIcon className="h-5 w-5 text-info-600 dark:text-info-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedThread.type}
                    </span>
                    {selectedThread.resolved && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedThread.subject}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.from === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.from === 'agent'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-secondary-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.from === 'agent' 
                          ? 'text-primary-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              {!selectedThread.resolved && (
                <div className="p-4 border-t border-gray-200 dark:border-secondary-700">
                  <div className="flex space-x-3">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                    />
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="inline-flex items-center justify-center p-2 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleMarkResolved}
                        className="inline-flex items-center justify-center p-2 border border-transparent rounded-lg text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors duration-200"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatEmailSupport;
