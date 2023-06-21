export default function SortBtn({ name, query, sortHandler }) {
  const formatWord = (str) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1)
    const separated = capitalized.replace(/([A-Z])/g, ' $1').trim()
    return separated
  }
  const formattedName = formatWord(name)

  return (
    <th>
      {formattedName}

      <button name={name} className="m-1 btn btn-info" onClick={sortHandler}>
        {query.sort.column === name
          ? query.sort.direction === 'asc'
            ? '▲'
            : '▼'
          : '🗆'}
      </button>
    </th>
  )
}
