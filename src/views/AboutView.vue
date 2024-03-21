<script setup>
import { SelectionProduct } from '@/requests/index'
import { onMounted, computed } from 'vue'
import { ref } from "vue"
import { Search } from '@element-plus/icons-vue'
// 定義一個變數，接收API的值
const ProductList = ref(null)
onMounted(() => {
  // setTimeout可以搭配onclick使用
  setTimeout(() => {
    //API promise.then&.catch使用
    SelectionProduct().then(({ data }) => {
      // console.log(data);
      ProductList.value = data;
      console.log(ProductList.value);
      afterProcess()
    })
      .catch(fail => {
        console.log(fail);
      });
  }, 500);
})
// 盡量不使用let,改用const 需要有ref,ref(不可以沒有東西)，可以放null/{Object}/[Array]
// let userIdList = []
// let idList = []
const userIdList = ref([])
const afterProcess = () => {
  ProductList.value.forEach((e) => {
    if (userIdList.value.includes(e.userId)) {
      console.log(e.userId, "userId 重複")
    }
    else {
      userIdList.value.push(e.userId)
    }
    // if (idList.includes(e.id)) {
    //   console.log(e.id, "id 重複")
    // }
    // else {
    //   idList.push(e.id)
    // }
  });
}

// const selectItem = ref(null)
const selectItem = ref('')
const onChange = () => {
  console.log('Selected item:', selectItem.value);
}

const searchText = ref('')
const resText = ref([])
const onClick = () => {
  console.log('searchText:', searchText.value);
  // if (searchText.value) {
  //   ProductList.value.forEach((t) => {
  //     console.log('t', t)
  //     if (t.title.includes(searchText.value)) {
  //       resText.value.push(t.title)
  //       console.log('resText:', resText.value);
  //     }
  //   })
  // }
  if (searchText.value) {
    // 要清空，不然每次點擊都會累積
    resText.value = [];
    ProductList.value.forEach((t) => {
      if (t.title.includes(searchText.value)) {
        // 修正push值，應放整個function
        resText.value.push(t)
      }
    });
  }
}

// Computed 是计算属性，用于动态的根据某个值或某些值的变化，来产生对应的变化
// computed 具有缓存性，当无关值变化时，不会引起 computed 声明值的变化。
const filteredProductList = computed(() => {
  // if裡面有值就直接return&結束往下
  if (selectItem.value) {
    // filter() 方法會建立一個經指定之函式運算後，由原陣列中通過該函式檢驗之元素所構成的新陣列。
    return ProductList.value.filter(c => c.userId == selectItem.value);
  }
  // Array的length是從0開始計算，第一筆資料是在第0筆
  // 要注意，除了[]無是0之外，[Null/undefined/0/1]都會是1
  if (resText.value.length > 0) {
    return resText.value;
  }
  // 如果不使用buttom search,也可以寫在這
  // if (searchText.value) {
  //   let ret = [];
  //   ProductList.value.forEach((t) => {
  //     if (t.title.includes(searchText.value)) {
  //       ret.push(t)
  //     }
  //   });
  //   return ret;
  // }
  // 這裡不是if else，因為computed要有return回傳值
  return ProductList.value
})

</script>
<template>
  <!-- 下拉選單 -->
  <!-- v-model: 為<input>、<select>、<textarea> 或元件做值與輸入的雙向綁定 -->
  <!-- @ 是v-on 當@change 用selectItem來接值-->
  <select v-model="selectItem" @change="onChange" style="width: 180px">
    <option value="">全選</option>
    <option v-for="(n, i) in userIdList" :key="i">{{ n }}</option>
  </select>
  <!-- search bar 尋找title相關符合值 -->
  <label style="width: 180px">
    <input type="search" v-model="searchText">
    <el-button type="primary" value="Submit" size="small" :icon="Search" @click="onClick">Search</el-button>
  </label>
  <!-- 列表表單 -->
  <div>
    <!-- <el-table :data="ProductList" style="width: 100%"> -->
    <el-table :data="filteredProductList" style="width: 100%">
      <el-table-column prop="userId" label="userId" width="180" />
      <el-table-column prop="title" label="title" />
    </el-table>
  </div>
</template>

<style>
label {
  margin: 5px;
  padding: 0 15px;
}
</style>
