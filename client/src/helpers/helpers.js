export function errorHandler(error) {
  console.error(error)
  window.alert('res not ok: ' + error.message)
  return
}
