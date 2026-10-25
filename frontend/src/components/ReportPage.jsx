import { useEffect, useState } from 'react'
import DataTable from './DataTable.jsx'

// reusable report page: loads rows from a backend url and shows them in a table
// title, description, url, columns, rowKey all come from whoever uses it
function ReportPage({ title, description, url, columns, rowKey }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadReport() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      } else {
        setRows(data)
      }
    } catch (err) {
      setError('Could not connect to the server')
    }
    setLoading(false)
  }

  // load when the page opens (and again if the url ever changes)
  useEffect(() => {
    loadReport()
  }, [url])

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={loadReport}>Refresh</button>

      {error ? <p className="message error">{error}</p> : null}

      {loading ? <p>Loading...</p> : null}
      {!loading && !error ? (
        <DataTable columns={columns} rows={rows} rowKey={rowKey} />
      ) : null}
    </div>
  )
}

export default ReportPage