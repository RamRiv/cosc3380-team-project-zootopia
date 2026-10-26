// reusable table, pass in columns + rows
// column options: isDate (cuts off the time), isMoney (adds the $)
function DataTable({ columns, rows, rowKey, actions }) {
  if (rows.length === 0) {
    return <p>No records found.</p>
  }

  // what to show in one cell
  function showValue(value, col) {
    if (value == null) return '—'
    if (col.isDate) return String(value).slice(0, 10) 
    if (col.isMoney) return '$' + Number(value).toFixed(2) 
    return String(value)
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key}>{showValue(row[col.key], col)}</td>
            ))}
            {actions ? <td>{actions(row)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable