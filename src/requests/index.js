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

const getPokemonImage = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
}

const getPokemonEvolution = async (id) => {
  try {
    const Pokemonspecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
    let evolutionChainUrl = Pokemonspecies.data.evolution_chain.url
    console.log('Evolution Chain URL:', evolutionChainUrl)

    const chainResponse = await axios.get(evolutionChainUrl)
    const chainData = chainResponse.data.chain
    const evolutionUrls = []

    const getEvolution = (chainData) => {
      console.log('chainData:', chainData)

      // 检查是否存在物种和物种
      if (chainData.species && chainData.species.url) {
        evolutionUrls.push(getPokemonImage(getPokemonIdFromUrl(chainData.species.url)))
      } else {
        console.error('Species URL is undefined:', chainData)
      }

      if (chainData.evolves_to && chainData.evolves_to.length > 0) {
        // 检查是否存在 evolves_to 属性和下一个进化节点
        getEvolution(chainData.evolves_to[0])
      }
    }

    // 开始递归获取进化链
    await getEvolution(chainData)
    console.log('evolutionUrls:', evolutionUrls)
    return evolutionUrls
  } catch (error) {
    console.error('Error fetching Pokemon evolution:', error)
    return []
  }
}

const getPokemonIdFromUrl = (url) => {
  const segments = url.split('/')
  return segments[segments.length - 2]
}

export {
  getName,
  SelectionProduct,
  getPokemonLink,
  getChineseName,
  getPokemonDetail,
  getPokemonImage,
  getPokemonEvolution
}
