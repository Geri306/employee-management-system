export default function CompanyOptions({ name, selectedCompany }) {
  return (
    <option value={name} selected={selectedCompany === name}>
      {name}
    </option>
  )
}
