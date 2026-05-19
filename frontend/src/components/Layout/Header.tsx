import { PanelLeft, SquarePen, Database } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
  onNewChat: () => void
}

export function Header({ onToggleSidebar, onNewChat }: HeaderProps) {
  return (
    <header className="h-12 border-b border-neutral-200 bg-white/80 backdrop-blur-md flex items-center px-3 shrink-0 relative z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
      >
        <PanelLeft size={18} />
      </button>
      <div className="flex items-center gap-2 ml-2">
        <Database size={16} className="text-teal-600" />
        <span className="text-sm font-semibold text-neutral-800">NLP2SQL</span>
      </div>
      <button
        onClick={onNewChat}
        className="ml-auto p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
        title="New chat"
      >
        <SquarePen size={18} />
      </button>
    </header>
  )
}
