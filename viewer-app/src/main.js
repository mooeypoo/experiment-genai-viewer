import { createApp } from 'vue'
import App from './app/AppShell.vue'
import router from './router.js'
import vuetify from './plugins/vuetify'
import './styles/base.css'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
