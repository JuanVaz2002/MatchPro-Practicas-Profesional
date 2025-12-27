import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';

export default function InterviewPrepChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      message: "Hi! I'm your AI interview preparation assistant. I can help you practice common interview questions, provide feedback on your answers, and share tips for success. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedTopics = [
    'Practice behavioral questions',
    'Technical interview questions',
    'Tell me about yourself',
    'Salary negotiation tips',
    'Questions to ask interviewer'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('behavioral') || lowerMessage.includes('behavior')) {
      return "Great choice! Let's practice behavioral questions. Here's a common one:\n\n**'Tell me about a time when you faced a significant challenge at work and how you overcame it.'**\n\nWhen answering, use the STAR method:\n- **Situation**: Set the context\n- **Task**: Explain your responsibility\n- **Action**: Describe what you did\n- **Result**: Share the outcome\n\nTry answering this question, and I'll provide feedback!";
    }
    
    if (lowerMessage.includes('technical')) {
      return "Technical interviews can be challenging! Here are some key areas to focus on:\n\n🔧 **Common Topics:**\n- Data structures & algorithms\n- System design basics\n- Coding best practices\n- Problem-solving approach\n\n**Practice Question:**\n'How would you optimize a slow-loading web page?'\n\nWalk me through your thought process - I'll help refine your answer!";
    }
    
    if (lowerMessage.includes('tell me about yourself')) {
      return "Perfect! This is often the first question. Here's a winning structure:\n\n**The 3-Part Formula:**\n1. **Present**: Current role/situation (30 seconds)\n2. **Past**: Relevant experience (30 seconds)  \n3. **Future**: Why you're here (30 seconds)\n\n**Example opener:**\n'I'm currently a frontend developer with 5 years of experience building user-focused web applications...'\n\nTry crafting your version - keep it under 2 minutes!";
    }
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('negotiation')) {
      return "Salary negotiation is crucial! Here's your strategy:\n\n💰 **Key Tips:**\n- Research market rates first\n- Let them make the first offer\n- Negotiate the whole package, not just salary\n- Be prepared to justify your ask\n\n**Sample Response:**\n'Based on my research and experience, I was expecting something in the range of $X to $Y. How does that align with your budget for this role?'\n\nWhat's your target range? Let's practice!";
    }
    
    if (lowerMessage.includes('questions to ask') || lowerMessage.includes('questions for')) {
      return "Excellent! Asking great questions shows your interest. Here are some winners:\n\n❓ **About the Role:**\n- What does success look like in the first 90 days?\n- What are the biggest challenges facing the team?\n\n❓ **About Growth:**\n- How do you support professional development?\n- What career paths have others in this role taken?\n\n❓ **About Culture:**\n- How would you describe the team dynamics?\n- What do you enjoy most about working here?\n\nAvoid asking about salary/benefits in the first interview. What specific area interests you most?";
    }
    
    // Default response for practice answers
    return "That's a great start! Here's some feedback:\n\n✅ **Strengths:**\n- Clear structure in your response\n- Good use of specific examples\n\n🎯 **Areas to improve:**\n- Try to quantify your impact with numbers\n- Connect your experience to this specific role\n- Practice your delivery timing\n\n**Next steps:** Try the same question again with these improvements, or ask me about another interview topic!";
  };

  const handleTopicClick = (topic: string) => {
    handleSendMessage(topic);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
            Interview Preparation Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Practice with AI-powered interview coaching and get personalized feedback
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-blue-50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Interview Coach</h3>
                <p className="text-sm text-gray-600">Ready to help you ace your interview</p>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-purple-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className={`rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.message}</div>
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topics */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">Quick start topics:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic)}
                    className="bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors text-sm"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                placeholder="Ask about interview tips, practice questions, or share your answers..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={isTyping || !inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}