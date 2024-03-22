import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailView from '../components/PokemonDetailView.vue' // Import the new view

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/pokemoncard',
      name: 'pokemon',
      component: () => import('../views/pokemonList.vue')
    },
    {
      path: '/pokemon/:id/:name/:const', // Add a dynamic segment ':id' to receive the Pokemon ID
      name: 'pokemon-detail',
      component: PokemonDetailView, // Use the new view for Pokemon detail
      props: true // Enable passing route params as props
    }
  ]
})

export default router
