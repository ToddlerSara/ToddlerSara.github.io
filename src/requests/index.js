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
export { getName, SelectionProduct, getPokemonLink }
