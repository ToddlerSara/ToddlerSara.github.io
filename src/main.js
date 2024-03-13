import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//整包引入，效能差，運用少
//cmd指令部分安裝 npm install -D unplugin-vue-components unplugin-auto-import
//修正vite.config.js一樣可以使用
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.use(ElementPlus)
app.use(router).mount('#app')
