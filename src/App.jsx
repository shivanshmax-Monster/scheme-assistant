import { useState } from 'react'
import { PlusCircle, Search, Globe, LayoutDashboard, Settings } from 'lucide-react'
import './App.css'
import ChatInterface from './components/ChatInterface'

function App() {
  const [lang, setLang] = useState('EN');
  const [chatKey, setChatKey] = useState(0);

  const handleNewDiscovery = () => {
    // Changing the key forces the ChatInterface to completely reset its state
    setChatKey(prev => prev + 1);
    
    // Also reset backend session
    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'reset' })
    }).catch(e => console.error(e));
  };

  return (
    <div className="app-container">
      {/* Sidebar - Upgraded */}
      <aside className="sidebar glass-panel">
        <div className="brand" style={{ marginBottom: '30px' }}>
          <Search size={28} color="#8b5cf6" />
          <h1 style={{ fontSize: '1.4rem' }}>SchemeBot</h1>
        </div>
        
        <button className="new-chat-btn" onClick={handleNewDiscovery}>
          <PlusCircle size={18} />
          New Discovery
        </button>

        <div className="nav-menu" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
           <div className="nav-item active" style={{ cursor: 'pointer' }}><LayoutDashboard size={18} /> Chat Discovery</div>
           <div className="nav-item" style={{ cursor: 'pointer' }} onClick={() => alert('Settings configuration will be available in the next phase.')}><Settings size={18} /> Settings</div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="lang-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', cursor: 'pointer' }} onClick={() => {
            const newLang = lang === 'EN' ? 'HI' : 'EN';
            setLang(newLang);
            alert(`Language switched to ${newLang === 'EN' ? 'English' : 'Hindi'} (UI translation coming soon)`);
          }}>
            <Globe size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '0.9rem' }}>Language: <strong>{lang}</strong></span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Powered by IBM Bob
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content glass-panel">
        <ChatInterface key={chatKey} />
      </main>
    </div>
  )
}

export default App
