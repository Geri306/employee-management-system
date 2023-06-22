import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { errorHandler } from '../../helpers/helpers.js'
import { v4 as uuidv4 } from 'uuid'
import CompanyOptions from '../companies/CompanyOptions'
import axios from 'axios'

export default function CreateEmployee() {
  const emptyForm = {
    firstName: '',
    lastName: '',
    age: '',
    position: '',
    level: '',
    equipment: [],
    company: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [inventory, setInventory] = useState()
  const [equipmentToBeAssigned, setEquipmentToBeAssigned] = useState()

  const [companyOptions, setCompanyOptions] = useState([])

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(`/company/sendOptions`)
      setCompanyOptions(data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const navigate = useNavigate()

  const fetchInventory = async () => {
    const res = await fetch('/equipment/get/inventory')
    const data = await res.json()
    setInventory(data)

    setForm((prev) => {
      const newEquipment = data.map((item) => {
        const newObj = { _id: item._id, name: item.name, amount: 0 }
        return newObj
      })
      return { ...prev, equipment: newEquipment }
    })
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  function updateForm(value, key, itemId, isEquipmentUpdate) {
    setForm((prev) => {
      if (isEquipmentUpdate) {
        const oldEquipment = [...prev.equipment]

        const itemToBeUpdated = oldEquipment.find(({ name }) => key === name)
        const indexOfItemToBeUpdated = oldEquipment.indexOf(itemToBeUpdated)

        itemToBeUpdated.amount = value

        const newEquipment = [...oldEquipment]
        newEquipment[indexOfItemToBeUpdated] = itemToBeUpdated

        return { ...prev, equipment: newEquipment }
      }
      return { ...prev, ...value }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch('/employees/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        errorHandler(data)
        return
      }

      const equipRes = await fetch('/equipment/update/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.equipment),
      })

      if (!equipRes.ok) {
        const data = await equipRes.json()
        errorHandler(data)
        return
      }

      setForm(emptyForm)
      navigate('/')
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <div>
      <h3 className="m-3">Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group m-3">
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              className="form-control"
              id="first-name"
              value={form.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="last-name"
              value={form.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              className="form-control"
              id="age"
              min="1"
              value={form.age}
              onChange={(e) => updateForm({ age: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              className="form-control"
              id="position"
              value={form.position}
              onChange={(e) => updateForm({ position: e.target.value })}
            />
          </div>

          <div className="form-check-inline">
            <label className="m-3">Assign Equipment:</label>

            {inventory &&
              inventory.map((item) => {
                return (
                  <label key={uuidv4()} className="m-1">
                    {item.name}
                    <input
                      type="number"
                      name={item.name}
                      min="0"
                      max={item.amount}
                      value={
                        form.equipment.find(({ name }) => name === item.name)
                          .amount
                      }
                      className="m-1"
                      onChange={(e) =>
                        updateForm(
                          e.target.value,
                          e.target.name,
                          item._id,
                          true
                        )
                      }
                    />
                  </label>
                )
              })}
          </div>

          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="">Assign company: </label>
            <select
              style={{ height: 1.85 + 'rem' }}
              className="m-1"
              onChange={(e) => updateForm({ company: e.target.value })}
            >
              <option defaultValue="DEFAULT" disabled>
                Choose a company
              </option>
              {companyOptions &&
                companyOptions.map((company, i) => {
                  return (
                    <CompanyOptions
                      key={i}
                      name={company.name}
                      selectedCompany={form.company}
                    />
                  )
                })}
            </select>
          </div>

          <div className="form-group mx-sm-3 mb-3">
            <label style={{ paddingRight: 1 + 'em' }}>Level:</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="positionOptions"
                id="positionIntern"
                value="intern"
                checked={form.level.toLowerCase() === 'intern'}
                onChange={(e) => updateForm({ level: e.target.value })}
              />
              <label htmlFor="positionIntern" className="form-check-label">
                intern
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="positionOptions"
                id="positionJunior"
                value="junior"
                checked={form.level.toLowerCase() === 'junior'}
                onChange={(e) => updateForm({ level: e.target.value })}
              />
              <label htmlFor="positionJunior" className="form-check-label">
                junior
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="positionOptions"
                id="positionSenior"
                value="senior"
                checked={form.level.toLowerCase() === 'senior'}
                onChange={(e) => updateForm({ level: e.target.value })}
              />
              <label htmlFor="positionSenior" className="form-check-label">
                senior
              </label>
            </div>
          </div>
          <div className="form-group mx-sm-3 mb-3">
            <input
              type="submit"
              value="Create person"
              className="btn btn-primary"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
