import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

export default function EditEquipment() {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: '',
  })
  const params = useParams()
  const navigate = useNavigate()

  async function fetchData() {
    const response = await fetch(`/equipment/record/${params.id}`)

    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`
      window.alert(message)
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
  }, [])

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()

    await fetch(`/equipment/update/${params.id}`, {
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
            <label htmlFor="equipment-name">Name: </label>
            <input
              type="text"
              className="form-control"
              id="equipment-name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="amount">Amount: </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={form.amount}
              onChange={(e) => updateForm({ amount: e.target.value })}
            />
          </div>
          <div className="mx-sm-3 mb-2 w-25">
            <label htmlFor="type">Type: </label>
          </div>
          <div className="form-check form-check-inline mx-sm-3 mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionHardware"
              value="hardware"
              checked={form.type.toLowerCase() === 'hardware'}
              onChange={(e) => updateForm({ type: e.target.value })}
            />
            <label htmlFor="positionHardware" className="form-check-label">
              hardware
            </label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="positionOptions"
                id="positionSoftware"
                value="software"
                checked={form.type.toLowerCase() === 'software'}
                onChange={(e) => updateForm({ type: e.target.value })}
              />
              <label htmlFor="positionSoftware" className="form-check-label">
                software
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
