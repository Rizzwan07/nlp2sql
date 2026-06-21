import type { ChartType } from '../types'

const SKIP_COLS = /^(id|_id|user_id|product_id|order_id)$/i

function isNumeric(val: unknown): boolean {
  if (typeof val === 'number') return true
  if (typeof val === 'string' && val !== '' && !isNaN(Number(val))) return true
  return false
}

function classifyColumns(columns: string[], rows: Record<string, unknown>[]) {
  const numericCols: string[] = []
  const stringCols: string[] = []
  const dateCols: string[] = []

  for (const col of columns) {
    if (SKIP_COLS.test(col)) continue

    const sample = rows.slice(0, 3)
    const firstVal = sample[0]?.[col]

    if (typeof firstVal === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(firstVal)) {
      dateCols.push(col)
    } else if (sample.every((r) => isNumeric(r[col]))) {
      numericCols.push(col)
    } else {
      stringCols.push(col)
    }
  }

  return { numericCols, stringCols, dateCols }
}

export function detectChartType(columns: string[], rows: Record<string, unknown>[]): ChartType {
  if (!columns.length || !rows.length) return 'stat'
  if (rows.length === 1 && columns.length <= 3) return 'stat'

  const { numericCols, stringCols, dateCols } = classifyColumns(columns, rows)

  if (numericCols.length >= 2 && stringCols.length === 0 && dateCols.length === 0) return 'scatter'
  if (stringCols.length >= 1 && numericCols.length >= 3 && rows.length <= 10 && dateCols.length === 0) return 'radar'
  if (stringCols.length >= 1 && numericCols.length === 1 && rows.length <= 8) return 'pie'
  if (dateCols.length >= 1 && numericCols.length >= 1 && rows.length > 5) return 'area'
  if (stringCols.length >= 1 && numericCols.length >= 1) return 'bar'
  if (numericCols.length >= 1) return 'bar'

  return 'stat'
}

export function getChartDataKey(columns: string[], rows: Record<string, unknown>[]): { categoryKey: string; valueKeys: string[]; xKey?: string; yKey?: string } {
  const { numericCols, stringCols, dateCols } = classifyColumns(columns, rows)

  let categoryKey: string
  if (dateCols.length > 0) {
    categoryKey = dateCols[0]
  } else if (stringCols.length > 0) {
    // prefer 'name' columns as category labels
    const nameCol = stringCols.find((c) => /name/i.test(c))
    categoryKey = nameCol || stringCols[0]
  } else {
    categoryKey = columns.find((c) => !SKIP_COLS.test(c)) || columns[0]
  }

  // pick meaningful numeric columns (exclude the category)
  const valueKeys = numericCols.filter((c) => c !== categoryKey)

  // if we have too many value keys, pick the most likely meaningful ones (prefer stock, total, price, quantity, count)
  if (valueKeys.length > 4) {
    const preferred = valueKeys.filter((c) => /stock|total|price|quantity|count|amount/i.test(c))
    if (preferred.length > 0) return { categoryKey, valueKeys: preferred.slice(0, 4) }
    return { categoryKey, valueKeys: valueKeys.slice(0, 4) }
  }

  return { categoryKey, valueKeys: valueKeys.length ? valueKeys : [numericCols[0] || columns[1] || columns[0]] }
}
