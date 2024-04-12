import axios from 'axios'

axios.defaults.timeout = 50000

axios.interceptors.request.use(
  (config) => {
    // ...
    return config
  },
  (error) => {
    return Promise.error(error)
  }
)

function getName() {
  return axios.get(`https://jsonplaceholder.typicode.com/users`)
}

function SelectionProduct() {
  return axios.get(`https://jsonplaceholder.typicode.com/albums`)
}

function getPokemonLink(offset, limit) {
  return axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
}

function getPokemonDetail(id) {
  // 构建完整的 URL，替换 ':id' 为实际的 Pokemon ID
  // 发起 GET 请求以获取 Pokemon 详细信息
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
}

const getPokemonImage = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
}

const getChineseName = async (id) => {
  try {
    return await axios.get((await getPokemonDetail(id)).data.species.url)
  } catch (error) {
    console.error('Error fetching PokemonName :', error)
    return null
  }
}

const getPokemonEvolution = async (evolutionChainUrl) => {
  try {
    // const Pokemonspecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
    // let evolutionChainUrl = Pokemonspecies.data.evolution_chain.url
    console.log('Evolution Chain URL:', evolutionChainUrl)

    return await axios.get(evolutionChainUrl)
  } catch (error) {
    console.error('Error fetching Pokemon evolution:', error)
    return []
  }
}

export {
  getName,
  SelectionProduct,
  getPokemonLink,
  getPokemonDetail,
  getPokemonImage,
  getPokemonEvolution,
  getChineseName
}
