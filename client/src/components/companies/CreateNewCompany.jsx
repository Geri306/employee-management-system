import { useEffect, useState } from 'react'

export default function CreateNewCompany() {
  const [text, setText] = useState('')
  const [companies, setCompanies] = useState([])

  function handleChange(e) {
    setText(e.target.value)
  }

  useEffect(() => {
    fetch('/company/sendOptions')
      .then((res) => res.json())
      .then((data) => setCompanies(data.map((c) => c.name)))
      .catch((e) => console.error(e))
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const match = text.match(/([A-Za-z])/g)
    if (!match || match.length < 3) {
      alert('invalid company name')
      return
    }
    fetch('/company/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: text }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw res
        }
      })
      .then((data) => {
        setCompanies(data.map((c) => c.name))
      })
      .catch((e) =>
        e.text().then((errMsg) => {
          console.error(errMsg)
          alert(errMsg)
        })
      )
    setText('')
  }

  return (
    <>
      <div>
        <form>
          <label>Company name</label>
          <input type="text" value={text} onChange={handleChange} />
          <button type="submit" onClick={handleSubmit}>
            Create new company
          </button>
        </form>
      </div>
      <ul>{companies && companies.map((c, i) => <li key={i}>{c}</li>)}</ul>
    </>
  )
}
