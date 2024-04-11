const getPokemonId = (url) => {
  return url.split('/').slice(-2, -1)[0]
}

const formatPokemonId = (id) => {
  // Ensure the ID is always four digits
  return id.toString().padStart(4, '0')
}

const getPokemonIdFromUrl = (url) => {
  const segments = url.split('/')
  return segments[segments.length - 2]
}

export { getPokemonId, formatPokemonId, getPokemonIdFromUrl }
