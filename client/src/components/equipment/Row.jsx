import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

export default function Row({ record, deleteRecord, selectedColumns }) {
  return (
    <tr className="text-center">
      {Object.keys(selectedColumns)
        .filter((k) => selectedColumns[k])
        .map((column) => (
          <td key={uuidv4()}>{record[column]}</td>
        ))}

      <td>
        <Link className="btn btn-link" to={`/edit/equipment/${record._id}`}>
          Edit
        </Link>{' '}
        |
        <button
          className="btn btn-link"
          onClick={() => {
            deleteRecord(record._id)
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
