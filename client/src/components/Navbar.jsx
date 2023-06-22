import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { NavLink } from 'react-router-dom'

export default function Navbar({
  selectedTables,
  setSelectedTables,
  onPopulate,
}) {
  const onCheck = () => {
    const checkBoxes = document.querySelectorAll('.table-checkboxes')
    const newArray = []
    checkBoxes.forEach((box) => {
      if (box.checked) {
        newArray.push(box.name)
      }
    })
    setSelectedTables(newArray)
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <img
            style={{ width: 25 + '%', marginLeft: 2 + 'em' }}
            src={require('../images/mern-logo.png')}
            alt="mern stack logo"
          />
        </NavLink>
        <NavLink
          to="/create/new/company"
          className="btn btn-info btn-secondary"
          style={{ margin: '1rem' }}
        >
          Create Company
        </NavLink>
        <label className="form-check-label"></label>
        Show tables:
        <div
          className="btn-group m-3 h "
          role="group"
          aria-label="Basic checkbox toggle button group"
        >
          <input
            type="checkbox"
            className="btn-check table-checkboxes"
            id="btncheck1"
            name="employees"
            checked={selectedTables.includes('employees')}
            onChange={onCheck}
          />
          <label className="btn btn-outline-primary" htmlFor="btncheck1">
            Employees
          </label>

          <input
            type="checkbox"
            className="btn-check table-checkboxes"
            id="btncheck2"
            name="equipment"
            checked={selectedTables.includes('equipment')}
            onChange={onCheck}
          />
          <label className="btn btn-outline-primary" htmlFor="btncheck2">
            Equipment
          </label>
        </div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button
              className="btn btn-secondary"
              onClick={() => onPopulate('all')}
            >
              Populate all table
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
