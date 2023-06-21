import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
// import RecordList from './components/RecordList.jsx'
import EditEmployee from './components/employees/EditEmployee.jsx'
import EditEquipment from './components/equipment/EditEquipment.jsx'
import TableSelector from './components/TableSelector.jsx'
import CreateEquipment from './components/equipment/CreateEquipment.jsx'
import CreateEmployee from './components/employees/CreateEmployee.jsx'
import CreateNewCompany from './components/companies/CreateNewCompany.jsx'

const App = () => {
  const [selectedTables, setSelectedTables] = useState([
    'employees',
    'equipment',
  ])

  const onPopulate = (tableName) => {
    if (tableName === 'all') {
      fetch(`/employees/populate/`).catch((err) => console.error(err.message))
      fetch(`/equipment/populate/`).catch((err) => console.error(err.message))
    } else {
      fetch(`/${tableName}/populate/`).catch((err) =>
        console.error(err.message)
      )
    }

    window.location = '/'
    return
  }

  return (
    <div>
      <Navbar
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        onPopulate={onPopulate}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <TableSelector
              selectedTables={selectedTables}
              onPopulate={onPopulate}
            />
          }
        />
        <Route path="/edit/employee/:id" element={<EditEmployee />} />
        <Route path="/edit/equipment/:id" element={<EditEquipment />} />
        <Route path="/create/employee" element={<CreateEmployee />} />
        <Route path="/create/equipment" element={<CreateEquipment />} />
        <Route path="/create/new/company" element={<CreateNewCompany />} />
      </Routes>
    </div>
  )
}

export default App
