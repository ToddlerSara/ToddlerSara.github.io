<script setup>
import { ref, onMounted } from 'vue';
import { getPokemonLink } from '@/requests/index';

const limit = 10;
const offset = ref(0);
const pokemons = ref([]);
let totalResults = 0;
const lastOffset = ref(0);
const displayedPokemons = ref([]);

onMounted(() => {
    fetchData(offset.value);
});

const fetchData = (offset) => {
    getPokemonLink(offset, limit)
        .then(({ data }) => {
            totalResults = data.count;
            lastOffset.value = Math.floor((totalResults - 1) / limit) * limit;

            pokemons.value = data.results.map(pokemon => ({
                name: pokemon.name,
                image: getPokemonImage(pokemon.url),
                valid: true
            }));
            console.log('Pokemons:', pokemons.value); // Add this line for debugging

            displayedPokemons.value = pokemons.value;
            console.log('Displayed Pokemons:', displayedPokemons.value);
        })
        .catch(error => {
            console.error('Error fetching Pokemon data:', error);
        });
};

const getPokemonImage = (url) => {
    const id = url.split('/').slice(-2, -1)[0];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

const prevPage = () => {
    if (offset.value >= limit) {
        offset.value -= limit;
        console.log('Prev page offset:', offset.value); // Add this line for debugging
        fetchData(offset.value);
    }
};

const nextPage = () => {
    if (lastOffset.value > offset.value) {
        offset.value += limit;
        console.log('Next page offset:', offset.value); // Add this line for debugging
        fetchData(offset.value);
    }
};
</script>

<template>
    <div>
        <h1>寶可夢圖鑑</h1>
        <div v-for="(pokemon, index) in displayedPokemons" :key="index" class="pokemon-item">
            <img v-if="pokemon.image" :src="pokemon.image" :alt="pokemon.name" />
            <div v-if="pokemon.image">{{ pokemon.name }}</div>
        </div>
        <button @click="prevPage" :disabled="offset <= 0">上一頁</button>
        <button @click="nextPage" :disabled="lastOffset <= offset">下一頁</button>
    </div>
</template>

<style>
/* 添加 CSS 样式 */
.pokemon-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.pokemon-item img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
</style>
