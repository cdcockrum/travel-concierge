import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Calendar, User, Settings, Plane, Sun, DollarSign } from 'lucide-react';

const TravelAIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI travel assistant. I can help you with trip planning, weather insights, cultural tips, budget optimization, and real-time travel adjustments. Where would you like to go?",
      sender: 'ai',
      timestamp: new Date(),
      features: ['weather', 'culture', 'budget', 'planning']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState({
    destination: '',
    dates: '',
    budget: '',
    preferences: [],
    currentTrip: null
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Mock AI response generator - in production, this would call OpenAI API
  const generateAIResponse = async (userMessage) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    // Context extraction
    const updatedContext = { ...userContext };
    
    // Extract destination
    const destinations = ['paris', 'tokyo', 'london', 'new york', 'bali', 'rome', 'barcelona', 'thailand', 'japan', 'italy', 'spain', 'france', 'uk', 'usa'];
    const foundDestination = destinations.find(dest => lowerMessage.includes(dest));
    if (foundDestination) {
      updatedContext.destination = foundDestination;
    }
    
    // Extract budget info
    if (lowerMessage.includes('budget') || lowerMessage.includes('$') || lowerMessage.includes('cheap') || lowerMessage.includes('expensive')) {
      updatedContext.budget = 'mentioned';
    }
    
    setUserContext(updatedContext);

    // Smart response generation based on message content
    let response = '';
    let features = [];
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('sunny') || lowerMessage.includes('temperature')) {
      response = `Great! I can help with weather-based planning${foundDestination ? ` for ${foundDestination}` : ''}. I'll check the forecast and suggest activities that match the conditions. For example, if it's raining, I'll recommend amazing indoor experiences like museums, markets, or cozy cafes. Would you like me to check the weather forecast for specific dates?`;
      features = ['weather', 'activities'];
    }
    else if (lowerMessage.includes('culture') || lowerMessage.includes('custom') || lowerMessage.includes('etiquette') || lowerMessage.includes('tip')) {
      response = `Absolutely! Cultural context is so important for great travel experiences${foundDestination ? ` in ${foundDestination}` : ''}. I can help you understand local customs, appropriate tipping, dress codes, and social etiquette. I'll also explain why certain behaviors might get odd looks and how to blend in with locals. What specific cultural questions do you have?`;
      features = ['culture', 'etiquette'];
    }
    else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('money') || lowerMessage.includes('cost')) {
      response = `Perfect! I specialize in budget optimization${foundDestination ? ` for ${foundDestination}` : ''}. I can find the cheapest flights, budget accommodations, free activities, and help you stretch every dollar. I'll create a complete breakdown showing how to maximize your experience while minimizing costs. What's your target budget range?`;
      features = ['budget', 'planning'];
    }
    else if (lowerMessage.includes('language') || lowerMessage.includes('translate') || lowerMessage.includes('speak') || lowerMessage.includes('communication')) {
      response = `Language barriers can be tricky! I can help with more than just translation${foundDestination ? ` for ${foundDestination}` : ''} - I'll provide context-specific phrases, help with pronunciation, and explain cultural nuances in communication. I'm especially good with restaurant orders, directions, and emergency situations. What language help do you need?`;
      features = ['language', 'culture'];
    }
    else if (lowerMessage.includes('plan') || lowerMessage.includes('itinerary') || lowerMessage.includes('schedule') || lowerMessage.includes('trip')) {
      response = `I love trip planning! I can create dynamic itineraries${foundDestination ? ` for ${foundDestination}` : ''} that adapt in real-time to weather, your energy levels, and unexpected discoveries. I'll optimize your route, suggest hidden gems, and help you balance must-sees with spontaneous exploration. When are you planning to travel?`;
      features = ['planning', 'itinerary'];
    }
    else if (foundDestination) {
      response = `${foundDestination.charAt(0).toUpperCase() + foundDestination.slice(1)} is an amazing choice! I can help you with everything from weather-appropriate activities and cultural insights to budget optimization and language assistance. I know the best local secrets, seasonal considerations, and insider tips. What aspect of your ${foundDestination} trip would you like to start with?`;
      features = ['destination', 'planning', 'comprehensive'];
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      response = `I'm your comprehensive travel AI assistant! Here's how I can help:

🌤️ **Weather-Activity Matching**: I'll check forecasts and suggest perfect activities for any weather
🌍 **Cultural Context**: Local customs, etiquette, and insider cultural tips
💰 **Budget Optimization**: Find the cheapest flights, accommodation, and maximize your money
🗣️ **Language Support**: Context-aware translation and travel-specific phrases
📅 **Dynamic Planning**: Smart itineraries that adapt to real conditions
🔄 **Real-time Adjustments**: I'll help when plans go sideways

Just tell me about your travel plans or ask any travel question!`;
      features = ['comprehensive'];
    }
    else {
      response = `I'd love to help you with that! As your AI travel assistant, I can provide insights on weather planning, cultural guidance, budget optimization, language help, and create adaptive itineraries. Could you tell me more about what you're planning or what specific travel challenge you're facing?`;
      features = ['general'];
    }

    return { text: response, features };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputText);
      const newAIMessage = {
        id: messages.length + 2,
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        features: aiResponse.features
      };
      setMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error. Please try again!",
        sender: 'ai',
        timestamp: new Date(),
        features: ['error']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const FeatureBadge = ({ feature }) => {
    const getIcon = () => {
      switch(feature) {
        case 'weather': return <Sun size={12} />;
        case 'budget': return <DollarSign size={12} />;
        case 'planning': return <Calendar size={12} />;
        case 'culture': return <User size={12} />;
        case 'destination': return <MapPin size={12} />;
        default: return <Plane size={12} />;
      }
    };

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-1 mb-1">
        {getIcon()}
        {feature}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plane className="text-blue-600" />
            TravelAI
          </h1>
          <p className="text-gray-600 text-sm mt-1">Your AI Travel Assistant</p>
        </div>
        
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-700 mb-3">Trip Context</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{userContext.destination || 'No destination set'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>{userContext.dates || 'Dates not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign size={16} />
              <span>{userContext.budget || 'Budget not set'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <h3 className="font-semibold text-gray-700 mb-3">AI Capabilities</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Sun className="text-blue-600" size={16} />
              <div>
                <div className="font-medium text-gray-800">Weather Matching</div>
                <div className="text-gray-600">Activity suggestions based on forecast</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <User className="text-green-600" size={16} />
              <div>
                <div className="font-medium text-gray-800">Cultural Context</div>
                <div className="text-gray-600">Local customs and etiquette</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <DollarSign className="text-purple-600" size={16} />
              <div>
                <div className="font-medium text-gray-800">Budget Optimization</div>
                <div className="text-gray-600">Maximize value, minimize costs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">AI Travel Assistant</h2>
            <Settings className="text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                {message.features && message.sender === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap">
                      {message.features.map((feature, index) => (
                        <FeatureBadge key={index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about weather, culture, budget, language help, or trip planning..."
                className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Try: "I'm going to Tokyo in March", "What's the weather like?", "Help with cultural tips", or "Find budget options"
          </div>
        </div>
      </div>
    </div>
  );
};

// This is the key change - export as default
export default TravelAIChatbot;
