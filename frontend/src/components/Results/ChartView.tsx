import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { detectChartType, getChartDataKey } from '../../utils/chartHelper'
import type { ChartType } from '../../types'

const COLORS = ['#22c55e', '#6366f1', '#f97316', '#ec4899', '#8b5cf6', '#06b6d4', '#eab308', '#ef4444']

interface ChartViewProps {
  columns: string[]
  rows: Record<string, unknown>[]
}

export function ChartView({ columns, rows }: ChartViewProps) {
  const chartType = detectChartType(columns, rows)
  const { categoryKey, valueKeys } = getChartDataKey(columns, rows)

  const raw = rows.slice(0, 20).map((row) => {
    const item: Record<string, unknown> = { [categoryKey]: String(row[categoryKey] ?? '') }
    for (const key of valueKeys) {
      item[key] = Number(row[key]) || 0
    }
    return item
  })

  const needsSort: ChartType[] = ['area', 'line']
  const data = needsSort.includes(chartType)
    ? raw.sort((a, b) => String(a[categoryKey]).localeCompare(String(b[categoryKey])))
    : raw

  const height = chartType === 'pie' ? 260 : chartType === 'radar' ? 280 : chartType === 'scatter' ? 250 : 200

  if (chartType === 'stat') {
    const value = rows[0]?.[columns[columns.length - 1]] ?? rows[0]?.[columns[0]]
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 py-5 text-center bg-white border border-neutral-200 rounded-xl"
      >
        <p className="text-3xl font-bold text-teal-600 tabular-nums">{String(value)}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-3 bg-white border border-neutral-200 rounded-xl p-4"
    >
      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'pie' ? (
          <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            <Pie
              data={data}
              dataKey={valueKeys[0]}
              nameKey={categoryKey}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={65}
              strokeWidth={2}
              stroke="#fff"
              label={({ name, percent, cx: pieCx, cy: pieCy, midAngle, outerRadius: oR, index }) => {
                const RADIAN = Math.PI / 180
                const radius = (oR as number) + 20
                const x = (pieCx as number) + radius * Math.cos(-midAngle * RADIAN)
                const y = (pieCy as number) + radius * Math.sin(-midAngle * RADIAN)
                return (
                  <text x={x} y={y} textAnchor={x > (pieCx as number) ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fill={COLORS[(index as number) % COLORS.length]} fontWeight={500}>
                    {`${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  </text>
                )
              }}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : chartType === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip />
            {valueKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        ) : chartType === 'radar' ? (
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey={categoryKey} tick={{ fontSize: 10, fill: '#666' }} />
            <PolarRadiusAxis tick={{ fontSize: 9, fill: '#999' }} angle={30} domain={[0, 'auto']} />
            <Tooltip />
            {valueKeys.map((key, i) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        ) : chartType === 'scatter' ? (
          <ScatterChart>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey={valueKeys[0]} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis dataKey={valueKeys[1]} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={raw} fill={COLORS[0]} />
          </ScatterChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip />
            {valueKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
