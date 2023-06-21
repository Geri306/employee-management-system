import { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function Stats({ records }) {
  const [query, setQuery] = useState({ position: 'developer', level: 'intern' })
  const [data, setData] = useState({})

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `/employees/stats/count/?position=${query.position}&level=${query.level}`
      )

      if (!res.ok) {
        throw new Error('res not ok')
      }

      const data = await res.json()
      setData(data)
    } catch (error) {
      console.error(error)
      window.alert(error.message)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [records, query])

  const onSelect = (e) => {
    const category = e.target.closest('select').name
    setQuery((prev) => {
      return { ...prev, [category]: e.target.value }
    })
  }

  return (
    <span style={{ fontSize: 20 + 'px' }} className="m-2">
      <b>Stats:</b>{' '}
      <div className="form-check-inline">
        total employee count: <b>{data.totalCount}</b>
        {'  '} | average age:{' '}
        {data.avgAge &&
          data.avgAge.map((position) => {
            return (
              <span key={uuidv4()}>
                <em>{`${position._id}s: `}</em>
                <b>{`${position.avgAge}`}</b>,{' '}
              </span>
            )
          })}{' '}
        {' |'} number of{' '}
        <select name="level" onChange={onSelect}>
          <option value="intern">intern</option>
          <option value="junior">junior</option>
          <option value="senior">senior</option>
        </select>{' '}
        <select name="position" onChange={onSelect}>
          <option value="developer">developers</option>
          <option value="tester">testers</option>
          <option value="translator">translators</option>
        </select>
        {': '}
        <b>{data.levelCount}</b>
      </div>
    </span>
  )
}
