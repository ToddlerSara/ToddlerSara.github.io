<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
import { getName } from '@/requests/index'
import { onMounted } from 'vue'
import { ref } from "vue"

// 定義一個變數
const nameList = ref([])
onMounted(() => {
  getName().then(({ data }) => {
    console.log(data);
    // 使用.value來接收data的值
    nameList.value = data; // [{} x 200]
  });
});

// 定義一個變數，使用object
const onePerson = ref([{ name: '123', email: '' }])   //  {}
onMounted(() => {
  // setTimeout可以搭配onclick使用
  setTimeout(() => {
    getName().then(({ data }) => {
      console.log(data);
      // 使用.value&.name來接收data 特定的值
      // onePerson.value = data
      onePerson.value[0].name = data[5].name;
      onePerson.value[0].email = data[5].email;
    });
  }, 500);
});

</script>

<template>
  <main>
    <!-- 單獨選出特定值 -->
    <div v-for="(k, index) in onePerson" :key="index">
      {{ k.name }}<br>
      {{ k.email }}
    </div>
    <div class="cards">
      <!-- 使用nameList.value = data來運作 -->
      <el-card v-for="(n, index) in nameList" :key="`n-${index}`" class="text item">
        <template #header>
          <div class="card-header">
            {{ 'List item ' + index }}
            <p>Name: {{ n.name }}</p>
          </div>
        </template>
        <p>Email: {{ n.email }}</p>
        <p>address: {{ n.address.street + ' ' + n.address.suite + ' ' + n.address.city + ' ' + n.address.zipcode }}</p>
        <p>phone: {{ n.phone }}</p>
        <template #footer>
          <p>company: {{ n.company.name }}</p>
          <p>{{ n.company.catchPhrase }}</p>
          <p>{{ n.company.bs }}</p>
        </template>
      </el-card>
    </div>
  </main>
</template>
<style>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 10px;
  font-size: 100%;
}

.text {
  color: #202020;
  font-family: "Indie Flower", cursive;
  text-align: left;
  font-size: 0.9rem;
}

.card-header {
  font-size: 0.9rem;
}
</style>