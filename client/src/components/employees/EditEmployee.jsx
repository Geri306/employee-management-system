import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import CompanyOptions from '../companies/CompanyOptions'

export default function EditEmployee() {
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

  const [companyOptions, setCompanyOptions] = useState([])

  async function fetchCompanies() {
    const response = await fetch(`/company/sendOptions`)

    if (!response.ok) {
      window.alert(`res not ok: ${response.statusText}`)
      return
    }

    const record = await response.json()

    if (!record) {
      window.alert(`Record with id ${params.id} not found`)
      navigate('/')
      return
    }

    setCompanyOptions(record)
  }

  const params = useParams()
  const navigate = useNavigate()

  async function fetchData() {
    const response = await fetch(`/employees/record/${params.id}`)

    if (!response.ok) {
      window.alert(`res not ok: ${response.statusText}`)
      return
    }

    const record = await response.json()

    if (!record) {
      window.alert(`Record with id ${params.id} not found`)
      navigate('/')
      return
    }

    setForm(record)
  }

  useEffect(() => {
    fetchData()
    fetchCompanies()
  }, [])

  function updateForm(value, key, itemId, isEquipmentUpdate) {
    setForm((prev) => {
      if (isEquipmentUpdate) {
        const oldEquipment = [...prev.equipment]

        const itemToBeUpdated = oldEquipment.find(
          ({ _id: { name } }) => name === key
        )
        const indexOfItemToBeUpdated = oldEquipment.indexOf(itemToBeUpdated)

        itemToBeUpdated.amount = value

        const newEquipment = [...oldEquipment]
        newEquipment[indexOfItemToBeUpdated] = itemToBeUpdated
        // (newEquipment)
        return { ...prev, equipment: newEquipment }
      }
      return { ...prev, ...value }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()

    await fetch(`/employees/update/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })

    await fetch('/equipment/sync/inventory', {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })

    navigate('/')
  }

  return (
    <div>
      <h3 className="m-3">Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group m-3">
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="first-name">First name: </label>
            <input
              type="text"
              className="form-control"
              id="first-name"
              value={form.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="last-name">Last name: </label>
            <input
              type="text"
              className="form-control"
              id="last-name"
              value={form.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="age">Age: </label>
            <input
              type="number"
              className="form-control"
              id="age"
              min="0"
              value={form.age}
              onChange={(e) => updateForm({ age: e.target.value })}
            />
          </div>

          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="position">Position: </label>
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

            {Object.keys(form.equipment).length > 0
              ? form.equipment.map((item) => {
                  return (
                    <label key={uuidv4()} className="m-1">
                      {item._id.name}
                      <input
                        type="number"
                        name={item._id.name}
                        min="0"
                        max={item._id.amount}
                        value={item.amount}
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
                })
              : null}
          </div>

          <div className="form-check-inline">
            <label htmlFor="">Assign company: </label>
            <select
              style={{ height: 1.85 + 'rem' }}
              className="m-1"
              onChange={(e) => updateForm({ company: e.target.value })}
            >
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

          <br />

          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary m-3"
          />
        </div>
      </form>
    </div>
  )
}
