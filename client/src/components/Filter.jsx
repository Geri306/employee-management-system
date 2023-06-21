import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function Filter({ setQuery, selectedColumns }) {
  const inputRef = useRef()
  const categoryRef = useRef()
  const clearRef = useRef()

  const handleKeyup = (e) => {
    if (e.key === 'Enter') return onSearch()
  }

  useEffect(() => {
    inputRef.current.addEventListener('keyup', handleKeyup)
  }, [])

  const onSearch = (e) => {
    if (inputRef.current.value === '') {
      onClear()
      // e.target.nextElementSibling.classList.remove('btn-warning')
      clearRef.current.classList.remove('btn-warning')
      return
    }

    const category = categoryRef.current.value
    const filterValue = inputRef.current.value

    // e.target.nextElementSibling.classList.add('btn-warning')
    clearRef.current.classList.add('btn-warning')

    setQuery((prev) => {
      return { ...prev, find: { category: category, filterValue: filterValue } }
    })
  }

  const onClear = (e) => {
    inputRef.current.value = ''
    e && e.target.classList.remove('btn-warning')
    setQuery((prev) => {
      return { ...prev, find: { category: 'all', filterValue: 'all' } }
    })
  }

  return (
    <>
      <span style={{ fontSize: 20 + 'px' }} className="m-2">
        Filter by:
      </span>

      <select
        style={{ height: 1.85 + 'rem' }}
        ref={categoryRef}
        className="m-1"
      >
        {Object.keys(selectedColumns)
          .filter((k) => selectedColumns[k])
          .map((column) => {
            return (
              <option key={uuidv4()} value={column}>
                {column}
              </option>
            )
          })}
      </select>

      <input ref={inputRef} className="m-1" type="text" />

      <button
        className="btn-sm btn btn-success btn-secondary m-1"
        onClick={onSearch}
      >
        Search
      </button>

      <button
        ref={clearRef}
        id="btn-clear"
        className="btn-sm btn btn btn-secondary m-1"
        onClick={onClear}
      >
        Clear
      </button>
    </>
  )
}
