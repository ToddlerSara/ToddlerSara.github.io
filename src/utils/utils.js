import { getChineseName, getPokemonImage } from '@/requests/index'

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

const getChineseNames = async (ids) => {
  const species = await Promise.all(ids.map((id) => getChineseName(id)))
  return species.map((response) => {
    const name = response.data.name
    const names = response.data.names
    const nameObj = names.find((name) => name.language.name === 'zh-Hant')
    const evolutionChainUrl = response.data.evolution_chain.url
    const varieties = response.data.varieties
    const pokemonData = varieties.map((variety) => {
      return {
        name: variety.pokemon.name,
        url: getPokemonImage(getPokemonIdFromUrl(variety.pokemon.url)),
        id: getPokemonIdFromUrl(variety.pokemon.url)
      }
    })
    if (nameObj) {
      return { name: nameObj.name, chainUrl: evolutionChainUrl, varieties: pokemonData }
    } else {
      // 如果找不到对应语言的名称，返回空字符串或其他默认值
      return { name: name, chainUrl: evolutionChainUrl, varieties: pokemonData }
    }
  })
}

const getPokemonEvolutionUrls = (chainData) => {
  const evolutions = []

  const getEvolution = (chainData) => {
    console.log('chainData:', chainData)

    // 检查是否存在物种和物种
    if (chainData.species && chainData.species.url) {
      const chainDataSpeciesId = getPokemonIdFromUrl(chainData.species.url)
      const chainDataSpeciesImg = getPokemonImage(chainDataSpeciesId)
      evolutions.push({
        evolutionUrls: chainDataSpeciesImg,
        speciesId: chainDataSpeciesId,
        name: chainData.species.name // 添加物种的名称
      })
    } else {
      console.error('Species URL is undefined:', chainData)
    }

    if (chainData.evolves_to && chainData.evolves_to.length > 0) {
      // 检查是否存在 evolves_to 属性和下一个进化节点
      console.log('Next evolution:', chainData.evolves_to[0])
      chainData.evolves_to.forEach((evolution) => {
        getEvolution(evolution)
      })
    }
  }

  // 开始递归获取进化链
  getEvolution(chainData)
  console.log('evolutions:', evolutions)
  return evolutions
}

export {
  getPokemonId,
  formatPokemonId,
  getPokemonIdFromUrl,
  getChineseNames,
  getPokemonEvolutionUrls
}
