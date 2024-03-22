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

function getPokemonDetail(pokemonId) {
  // 构建完整的 URL，替换 ':id' 为实际的 Pokemon ID
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

  // 发起 GET 请求以获取 Pokemon 详细信息
  return axios.get(apiUrl)
}

const getChineseName = async (pokemonName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    const names = response.data.names
    const chineseNameObj = names.find((name) => name.language.name === 'zh-Hant')
    if (chineseNameObj) {
      return chineseNameObj.name
    } else {
      return pokemonName // 如果找不到中文名稱，返回英文名稱
    }
  } catch (error) {
    console.error('Error fetching Chinese name:', error)
    return pokemonName // 如果發生錯誤，返回英文名稱
  }
}

export { getName, SelectionProduct, getPokemonLink, getChineseName, getPokemonDetail }
