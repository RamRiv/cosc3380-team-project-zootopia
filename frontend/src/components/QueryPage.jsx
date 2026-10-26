import { useState } from 'react'
import DataTable from './DataTable.jsx'

// reusable search page: filters on top, results below
// fields with type 'select' show up as a dropdown
function QueryPage({ title, description, url, fields, columns, rowKey }) {
  // what's in each filter box, like { species: 'lion', sex: 'Male' }
  const [filters, setFilters] = useState({})
  const [rows, setRows] = useState([])
  const [searched, setSearched] = useState(false) // false = haven't searched yet
  const [error, setError] = useState('')

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  async function handleSearch(e) {
    e.preventDefault()
    setError('')

    // turn the filters into ?species=lion&sex=Male (skip empty boxes)
    const params = new URLSearchParams()
    for (const field of fields) {
      if (filters[field.name]) {
        params.append(field.name, filters[field.name])
      }
    }

    try {
      const response = await fetch(url + '?' + params.toString())
      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        setRows([])
      } else {
        setRows(data)
      }
      setSearched(true)
    } catch (err) {
      setError('Could not connect to the server')
    }
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>

      <form className="search-form" onSubmit={handleSearch}>
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}
            {field.type === 'select' ? (
              <select name={field.name} value={filters[field.name] || ''} onChange={handleChange}>
                <option value="">Any</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input name={field.name} value={filters[field.name] || ''} onChange={handleChange} />
            )}
          </label>
        ))}
        <button type="submit">Search</button>
      </form>

      {error ? <p className="message error">{error}</p> : null}

      {/* only show results after the first search */}
      {searched && !error ? (
        <>
          <p>{rows.length} result(s)</p>
          <DataTable columns={columns} rows={rows} rowKey={rowKey} />
        </>
      ) : null}
    </div>
  )
}

export default QueryPage