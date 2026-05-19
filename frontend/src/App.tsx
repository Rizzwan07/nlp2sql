import { useState } from 'react'
import { Header } from './components/Layout/Header'
import { QueryHistory } from './components/Sidebar/QueryHistory'
import { ChatArea } from './components/Chat/ChatArea'
import { InputBar } from './components/Chat/InputBar'
import { useChat } from './hooks/useChat'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { messages, history, loading, sendMessage, toggleChart, newChat } = useChat()

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="animated-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onNewChat={newChat} />
      <div className="flex flex-1 overflow-hidden relative">
        <QueryHistory
          history={history}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={(q) => {
            sendMessage(q)
            setSidebarOpen(false)
          }}
        />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <ChatArea
            messages={messages}
            loading={loading}
            onSend={sendMessage}
            onToggleChart={toggleChart}
          />
          <InputBar onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default App
