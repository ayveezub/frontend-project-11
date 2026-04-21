const makeTitleCardElement = (title) => {
  const div = document.createElement('div')
  div.className = 'card-body'

  const h2 = document.createElement('h2')
  h2.className = 'card-title h4'
  h2.textContent = title

  div.append(h2)
  return div
}

export { makeTitleCardElement }
