<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPokemonDetail } from '@/requests/index';

const router = useRouter();
const height = ref(null);
const weight = ref(null);
const isDetailVisible = ref(false); // 新增用於控制詳細視圖顯示的變數

const fetchData = () => {
    const pokemon = router.currentRoute.value.params;

    getPokemonDetail(pokemon.id)
        .then(({ data }) => {
            height.value = data.height;
            weight.value = data.weight;
            isDetailVisible.value = true; // 確保當資料載入完成後顯示詳細視圖
        })
        .catch(error => {
            console.error('Error fetching Pokemon details:', error);
        });
}

onMounted(() => {
    fetchData();
});

const closeDetail = () => {
    router.go(-1); // 導航回先前的路由
};

const getPokemonImage = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
};
</script>

<template>
    <transition name="fade">
        <div class="pokemon-detail" v-if="isDetailVisible"> <!-- 使用 v-if 控制詳細視圖的顯示 -->
            <p>編號：{{ router.currentRoute.value.params.const }}</p>
            <p>名字：{{ router.currentRoute.value.params.name }}</p>
            <img :src="getPokemonImage(router.currentRoute.value.params.id)"
                :alt="router.currentRoute.value.params.id" />
            <p>身高：{{ height }}</p>
            <p>體重：{{ weight }}</p>
            <!-- 其他寶可夢資訊 -->
            <button @click="closeDetail">Close</button>
        </div>
    </transition>
</template>

<style>
/* 加入 CSS 样式 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
