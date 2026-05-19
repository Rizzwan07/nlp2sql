interface DataTableProps {
  columns: string[]
  rows: Record<string, unknown>[]
}

export function DataTable({ columns, rows }: DataTableProps) {
  const displayRows = rows.slice(0, 10)
  const hasMore = rows.length > 10

  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100">
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-neutral-500 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-50 last:border-0">
              {columns.map((col) => (
                <td key={col} className="px-3 py-1.5 text-neutral-700 text-xs whitespace-nowrap">
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
        <div className="px-3 py-2 text-xs text-neutral-400 border-t border-neutral-100">
          Showing 10 of {rows.length} rows
        </div>
      )}
    </div>
  )
}
