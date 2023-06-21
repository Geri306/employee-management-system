export default function ColumnSelector({
  selectedColumns,
  setSelectedColumns,
}) {
  const onCheck = (e) => {
    const boxName = e.target.name
    if (['firstName', 'name'].includes(boxName)) {
      alert('name column cannot be unset')
      return
    }
    setSelectedColumns((prev) => {
      // if checked
      if (e.target.checked === false) {
        const newObj = { ...prev }
        newObj[boxName] = !newObj[boxName]
        return newObj
      } // if not checked
      else if (e.target.checked === true) {
        const newObj = { ...prev }
        newObj[boxName] = !newObj[boxName]
        return newObj
      }
    })
  }

  return (
    <span style={{ fontSize: 20 + 'px' }} className="m-2">
      Show columns:{' '}
      {Object.keys(selectedColumns).map((keyName) => {
        return (
          <div key={keyName} className="form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              value={keyName}
              name={keyName}
              checked={selectedColumns[keyName]}
              onChange={onCheck}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              {keyName}
            </label>
          </div>
        )
      })}
    </span>
  )
}
