import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/custom.scss'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(App)

app.use(BootstrapVue3)
app.use(createPinia())
app.use(router)

app.mount('#app')
