import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { errorHandler } from '../../helpers/helpers.js'

export default function CreateEquipment() {
  const emptyForm = {
    name: '',
    type: '',
    amount: '',
  }

  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch('/equipment/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
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
            <label htmlFor="equipment-name">Name</label>
            <input
              type="text"
              className="form-control"
              id="equipment-name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={form.amount}
              onChange={(e) => updateForm({ amount: e.target.value })}
            />
          </div>

          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="type">Type</label>
          </div>
        </div>
        <div className="form-group mx-sm-3 mb-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="typeOptions"
              id="typeHardware"
              value="hardware"
              checked={form.type.toLowerCase() === 'hardware'}
              onChange={(e) => updateForm({ type: e.target.value })}
            />
            <label htmlFor="typeHardware" className="form-check-label">
              hardware
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="typeOptions"
              id="typeSoftware"
              value="software"
              checked={form.type.toLowerCase() === 'software'}
              onChange={(e) => updateForm({ type: e.target.value })}
            />
            <label htmlFor="typeSoftware" className="form-check-label">
              software
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
      </form>
    </div>
  )
}
