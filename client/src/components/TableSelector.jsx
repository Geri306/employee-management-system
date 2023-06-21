// import { useState } from 'react'
import EquipmentTable from './equipment/EquipmentTable.jsx'
import EmployeeTable from './employees/EmployeeTable.jsx'
import { useState } from 'react'

export default function TableSelector({ selectedTables, onPopulate }) {
  const [employeeKeys, setEmployeeKeys] = useState([])
  const [equipmentKeys, setEquipmentKeys] = useState([])
  return (
    <>
      {selectedTables.includes('employees') && (
        <EmployeeTable
          onPopulate={onPopulate}
          objKeys={employeeKeys}
          setObjKeys={setEmployeeKeys}
        />
      )}
      {selectedTables.includes('equipment') && (
        <EquipmentTable
          onPopulate={onPopulate}
          objKeys={equipmentKeys}
          setObjKeys={setEquipmentKeys}
        />
      )}
    </>
  )
}
