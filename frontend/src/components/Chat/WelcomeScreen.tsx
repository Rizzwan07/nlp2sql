import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp, Hash, Table } from 'lucide-react'

const examples = [
  { icon: BarChart3, text: 'Show total orders by category', color: 'text-blue-500' },
  { icon: PieChart, text: 'Users per country', color: 'text-purple-500' },
  { icon: TrendingUp, text: 'Orders over time', color: 'text-teal-500' },
  { icon: Hash, text: 'How many active users?', color: 'text-orange-500' },
  { icon: Table, text: 'Top 5 orders by total', color: 'text-pink-500' },
]

interface WelcomeScreenProps {
  onSelect: (question: string) => void
}

export function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-1">
          What do you want to know?
        </h2>
        <p className="text-sm text-neutral-400">
          Ask about your data in plain English
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="flex flex-wrap justify-center gap-2 max-w-lg"
      >
        {examples.map((ex, i) => {
          const Icon = ex.icon
          return (
            <motion.button
              key={ex.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.25 }}
              onClick={() => onSelect(ex.text)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-neutral-600 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              <Icon size={14} className={ex.color} />
              {ex.text}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
