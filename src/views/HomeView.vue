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
    nameList.value = data
  });
});

// 定義一個變數，使用object
// const nameList = ref({ name: '', email: '' })
// onMounted(() => {
//   // setTimeout可以搭配onclick使用
//   setTimeout(() => {
//     getName().then(({ data }) => {
//       console.log(data);
//       // 使用.value&.name來接收data的值
//       nameList.value.name = data[0].name;
//       nameList.value.email = data[0].email;
//     });
//   }, 5000);
// });

</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="cards">
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

        <!-- 使用nameList.value = data來運作 -->
        <!-- <div v-for="(n, index) in nameList" :key="`n-${index}`" class="text item">
        {{ 'List item ' + index }}
        <p>Name: {{ n.name }}</p>
        <p>Email: {{ n.email }}</p>
      </div> -->

        <!-- 使用自定義來接收Object→const nameList = ref({ name: '', email: '' }) -->
        <!-- <p>Name: {{ nameList.name }}</p>
        <p>Email: {{ nameList.email }}</p>
      </div>  -->
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