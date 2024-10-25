import {createApp} from "vue"
import App from "./App.vue"
import { createPinia } from 'pinia'
import router from "./router/Index"
import ContractArticles from './components/ContractArticles.vue'

const app = createApp(App)
app.use(createPinia())
app.component('contract-articles', ContractArticles)
app.use(router)
app.mount('#app')
