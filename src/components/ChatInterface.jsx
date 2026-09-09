import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockAiService } from '../services/mockAiService';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './ChatInterface.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: "Hello! 👋 I am your **AI Government Scheme Assistant**, powered by IBM Bob.\n\nI can help you with:\n- Finding schemes you are eligible for.\n- Explaining government policies.\n- Answering any general questions you have!\n\n**How can I assist you today?**"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await mockAiService(userMessage.content);
      
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        type: response.type,
        content: response.message,
        schemes: response.schemes || []
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isTyping && (
          <motion.div 
            className="message-wrapper bot"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="avatar"><Bot size={20} /></div>
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <form onSubmit={handleSend} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... e.g., 'What is PM Kisan?' or 'Find me scholarships'"
            className="chat-input"
            disabled={isTyping}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
