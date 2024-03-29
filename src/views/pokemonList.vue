<script setup>
import { ref, onMounted } from 'vue';
import { getPokemonLink, getChineseName, getPokemonDetail } from '@/requests/index';

const limit = 20;
const offset = ref(0);
const pokemons = ref([]);
let totalResults = 0;
const lastOffset = ref(0);
const displayedPokemons = ref([]);
const isModalVisible = ref(false);
const selectedPokemon = ref(null);

onMounted(() => {
    fetchData(offset.value);
    preloadNextPage();
});

const fetchData = (offset) => {
    getPokemonLink(offset, limit)
        .then(async ({ data }) => {
            totalResults = data.count;
            lastOffset.value = Math.floor((totalResults - 1) / limit) * limit;

            // Get Chinese names for each Pokemon
            const pokemonNames = data.results.map(pokemon => pokemon.name);
            const chineseNames = await getChineseNames(pokemonNames);

            pokemons.value = data.results.map((pokemon, index) => ({
                name: chineseNames[index], // Use Chinese name
                constid: formatPokemonId(getPokemonId(pokemon.url)),
                id: getPokemonId(pokemon.url),
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
    const id = getPokemonId(url);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
};

const getPokemonId = (url) => {
    return url.split('/').slice(-2, -1)[0];
};

const formatPokemonId = (id) => {
    // Ensure the ID is always four digits
    return id.toString().padStart(4, '0');
};

const getChineseNames = async (names) => {
    const chineseNames = await Promise.all(names.map(name => getChineseName(name)));
    return chineseNames;
};

const preloadNextPage = () => {
    const nextOffset = offset.value + limit * 10;
    if (nextOffset <= lastOffset.value) {
        getPokemonLink(nextOffset, limit)
            .then(({ data }) => {
                // Preload images for the next page
                data.results.forEach(pokemon => {
                    const imageUrl = getPokemonImage(pokemon.url);
                    const image = new Image();
                    image.src = imageUrl;
                });
            })
            .catch(error => {
                console.error('Error preloading next page:', error);
            });
    }
};

const prevPage = () => {
    if (offset.value >= limit) {
        offset.value -= limit;
        console.log('Prev page offset:', offset.value); // Add this line for debugging
        fetchData(offset.value);
        preloadNextPage();
    }
};

const nextPage = () => {
    if (lastOffset.value > offset.value) {
        offset.value += limit;
        console.log('Next page offset:', offset.value); // Add this line for debugging
        fetchData(offset.value);
        preloadNextPage();
    }
};

const openDetailModal = (pokemon) => {
    console.log('Selected Pokemon:', pokemon);
    selectedPokemon.value = pokemon;
    isModalVisible.value = true;

    // Fetch Pokemon detail
    getPokemonDetail(pokemon.id)
        .then(({ data }) => {
            selectedPokemon.value = {
                ...selectedPokemon.value,
                height: data.height,
                weight: data.weight
            };
        })
        .catch(error => {
            console.error('Error fetching Pokemon details:', error);
        });
};

const closeDetailModal = () => {
    isModalVisible.value = false;
};

</script>

<template>
    <div>
        <h1>寶可夢圖鑑</h1>
        <div>
            <button @click="prevPage" :disabled="offset <= 0">上一頁</button>
            <button @click="nextPage" :disabled="lastOffset <= offset">下一頁</button>
        </div>
        <div class="pokemon-container" v-if="displayedPokemons.length > 0">
            <div v-for="(pokemon, index) in displayedPokemons" :key="index" class="pokemon-item">
                <div class="pokemon-image" @click="openDetailModal(pokemon)">
                    <img v-if="pokemon.image" :src="pokemon.image" :alt="pokemon.name" />
                    <div v-if="pokemon.image" class="pokemon-info">
                        <div class="pokemon-id">{{ pokemon.constid }}</div>
                        <div class="pokemon-name">{{ pokemon.name }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <el-dialog v-model="isModalVisible" :show-close="false" width="500">
            <div class="dialog-header">
                <h1>Pokemon Detail</h1>
                <el-button @click="closeDetailModal">Close</el-button>
            </div>
            <div v-if="selectedPokemon" class="dialog-container">
                <p>編號：{{ selectedPokemon.constid }}</p>
                <p>名字：{{ selectedPokemon.name }}</p>
                <img class="dialog-container-img" :src="selectedPokemon.image" :alt="selectedPokemon.id" />
                <p>身高：{{ selectedPokemon.height }}</p>
                <p>體重：{{ selectedPokemon.weight }}</p>
                <!-- 其他寶可夢資訊 -->
            </div>
        </el-dialog>
    </div>
</template>

<style>
@media screen and (max-width: 1024px) {
    .pokemon-container {
        min-width: 1024px;
    }
}

/* 修改 CSS 样式 */
.pokemon-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-image: url('https://tw.portal-pokemon.com/play/resources/pokedex/img/list_bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* 自動調整高度 */
}

.pokemon-item {
    width: calc(25% - 10px);
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: 5px;
    /* 調整每個格子之間的間距 */
    height: auto;
    /* 設置長方形的高度 */
}

.pokemon-image {
    width: 100%;
    /* 讓每個圖片填滿父容器的寬度 */
    height: auto;
    /* 設置圖片高度自動調整 */
    min-width: 228px;
    /* 設置圖片最小寬度為 228px */
    max-width: 230px;
    /* 設置圖片最大寬度為 287px */
    min-height: 350px;
    /* 設置圖片最小高度為 341px */
    max-height: 350px;
    /* 設置圖片最大高度為 438px */
    position: relative;
    background-image: url('https://tw.portal-pokemon.com/play/resources/pokedex/img/list_pokemon_bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    /* 使用 cover 讓背景圖填滿整個區域 */
}

img {
    position: absolute;
    width: 60%;
    left: 20%;
    top: 8%;
}

.pokemon-info {
    margin-top: 5px;
    text-align: center;
}

.pokemon-id {
    font-size: 20px;
    margin: 5px 0;
    position: absolute;
    left: 10%;
    top: 57%;
    color: #7bf2f0;
}

.pokemon-name {
    font-size: 20px;
    margin: 5px 0;
    padding: 5px 0;
    position: absolute;
    left: 10%;
    top: 62%;
    color: #fff;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
}

.dialog-container,
.dialog-container-img {
    position: relative;
}
</style>
