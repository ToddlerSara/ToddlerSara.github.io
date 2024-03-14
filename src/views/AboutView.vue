<script setup>
import { SelectionProduct } from '@/requests/index'
import { onMounted } from 'vue'
import { ref } from "vue"

// 定義一個變數，使用object
const ProductList = ref([{ userId: '', id: '', title: '' }])
onMounted(() => {
  // setTimeout可以搭配onclick使用
  setTimeout(() => {
    SelectionProduct().then(({ data }) => {
      // console.log(data);
      // 使用.value&.name來接收data的值 ProductList的ref要使用()，不然會TypeError
      ProductList.value = data;
      console.log(ProductList.value);
      // 因為使用Arrary接值 ProductList的ref要使用[{}]
      ProductList.value.userId = data[0].userId;
      ProductList.value.id = data[0].id;
      ProductList.value.title = data[0].title;
    });
  }, 3000);
});
</script>
<template>
  <div>
    <el-table :data="ProductList" style="width: 100%">
      <el-table-column prop="userId" label="userId" width="180" />
      <el-table-column prop="id" label="id" width="180" />
      <el-table-column prop="title" label="title" />
    </el-table>
    <!-- <div v-for="(n, index) in ProductList" :key="`n-${index}`">
      <p>userId: {{ n.userId }}</p>
      <p>id: {{ n.id }}</p>
      <p>title: {{ n.title }}</p>
    </div> -->
  </div>
</template>

<style></style>
