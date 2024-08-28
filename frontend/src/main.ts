import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Tres from '@tresjs/core'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router);
app.use(Tres)
app.use(createPinia());

app.mount('#app')


