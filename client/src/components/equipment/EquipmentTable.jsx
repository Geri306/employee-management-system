import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ColumnSelector from '../ColumnSelector'
import Filter from '../Filter'
import Row from './Row'
import SortBtn from '../SortBtn'
import { v4 as uuidv4 } from 'uuid'

export default function EquipmentTable({ onPopulate, objKeys, setObjKeys }) {
  const [records, setRecords] = useState([])
  const [query, setQuery] = useState({
    find: { category: 'all', filterValue: 'all' },
    sort: { column: 'name', direction: 'asc' },
    select: ['all'],
  })

  const defaultColumns = {
    _id: false,
    name: true,
    type: true,
    amount: true,
    createdAt: false,
    updatedAt: false,
  }

  const [selectedColumns, setSelectedColumns] = useState(defaultColumns)

  async function getRecords() {
    const { find, sort, select } = query

    const url = `/equipment/records/?findCat=${find.category}&findVal=${find.filterValue}&sortCol=${sort.column}&sortDir=${sort.direction}&select=${select}`

    const response = await fetch(url)

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`
      return window.alert(message)
    }

    const records = await response.json()

    setRecords(records)
    if (objKeys.length === 0 && records.length !== 0) {
      setObjKeys(Object.keys(records[0]))
    }
  }

  useEffect(() => {
    getRecords()
  }, [query])

  const deleteRecord = async (id) => {
    await fetch(`/equipment/delete/${id}`, { method: 'DELETE' })
    const newRecords = records.filter((el) => el._id !== id)
    setRecords(newRecords)
  }

  const deleteAll = async () => {
    if (!window.confirm('are you sure?')) return
    await fetch('/equipment/deleteAll', { method: 'DELETE' })
    setRecords([])
  }

  const sortHandler = async (e) => {
    e.target.textContent = e.target.textContent === '▲' ? '▼' : '▲'
    const directionValue = e.target.textContent === '▲' ? 'asc' : 'desc'

    setQuery((prev) => {
      return {
        ...prev,
        sort: { column: e.target.name, direction: directionValue },
      }
    })
  }

  const calculateColSpan = () => {
    if (records.length > 0) {
      return Object.keys(selectedColumns).filter((k) => selectedColumns[k])
        .length
    } else {
      return (
        Object.keys(selectedColumns).filter((k) => selectedColumns[k]).length +
        1
      )
    }
  }

  return (
    <div>
      <h3 className="m-2">Equipment</h3>
      <br />
      <ColumnSelector
        setQuery={setQuery}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <br />
      <br />
      <Filter setQuery={setQuery} selectedColumns={selectedColumns} />
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead className="table-dark">
          <tr className="text-center">
            {Object.keys(selectedColumns)
              .filter((k) => selectedColumns[k])
              .map((fieldName) => (
                <SortBtn
                  key={uuidv4()}
                  name={fieldName}
                  query={query}
                  sortHandler={sortHandler}
                />
              ))}

            <th>
              <button
                className="btn btn-secondary btn-sm mb-2"
                onClick={() => onPopulate('equipment')}
              >
                Populate
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <Row
              key={record._id}
              record={record}
              selectedColumns={selectedColumns}
              deleteRecord={() => deleteRecord(record._id)}
            />
          ))}

          <tr>
            <td align="center" colSpan={calculateColSpan()}>
              <NavLink className="nav-link" to="/create/equipment">
                <button className="btn btn-primary btn-sm">New record</button>
              </NavLink>
            </td>

            {records.length > 0 ? (
              <td align="center">
                <button
                  className="btn btn-danger btn-secondary btn-sm"
                  onClick={deleteAll}
                >
                  Delete all
                </button>
              </td>
            ) : null}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
