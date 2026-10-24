// reusable table. give it columns + rows and it draws them
// columns: [{ key: 'AnimalName', label: 'Name' }, { key: 'DateOfBirth', label: 'Born', isDate: true }]
// rowKey: the field that's unique per row (like 'AnimalID')
// actions (optional): function that gets a row and returns buttons for it
function DataTable({ columns, rows, rowKey, actions }) {
  if (rows.length === 0) {
    return <p>No records found.</p>
  }

  // what to show in one cell
  function showValue(value, isDate) {
    if (value == null) return '—'
    if (isDate) return String(value).slice(0, 10) // 2012-11-11T06:00... -> 2012-11-11
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
              <td key={col.key}>{showValue(row[col.key], col.isDate)}</td>
            ))}
            {actions ? <td>{actions(row)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable