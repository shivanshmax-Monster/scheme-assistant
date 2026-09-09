import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import SchemeCard from './SchemeCard';

export default function ChatMessage({ msg }) {
  const isUser = msg.sender === 'user';
  
  return (
    <motion.div 
      className={`message-wrapper ${msg.sender}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="message-content">
        <div className="text-bubble">
           {isUser ? (
             msg.content 
           ) : (
             <div className="markdown-content">
               <ReactMarkdown>{msg.content}</ReactMarkdown>
             </div>
           )}
        </div>
        
        {/* Render Schemes if present */}
        {msg.type === 'schemes' && msg.schemes && (
          <div className="schemes-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            {msg.schemes.map((scheme, index) => (
              <motion.div 
                key={scheme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <SchemeCard scheme={scheme} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
