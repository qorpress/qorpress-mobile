import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// Components For Routes
import Posts from './components/Posts.vue'
import Post from './components/Post.vue'
import Pages from './components/Pages.vue'
import User from './components/User.vue'
import Category from './components/Category.vue'
import Tag from './components/Tag.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Components for Nativescript
import { Page, ActionBar, GridLayout, Button, Img, Label } from 'nativescript-vue-web';
Vue.component('Page', Page);
Vue.component('ActionBar', ActionBar);
Vue.component('GridLayout', GridLayout);
Vue.component('Button', Button);
Vue.component('Img', Img);
Vue.component('Label', Label);

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VueRouter);

Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'hash',
    base: '/', // Routing Main Entry URL
    routes: [
        { path: '/', component: Posts },
        { path: '*', redirect: '/' },
        { path: '/posts', component: Posts },
        { path: '/post/:id', name: 'post', component: Post },
        { path: '/pages/:id', name: 'pages', component: Pages },
        { path: '/user/:id', name: 'user', component: User },
        { path: '/category/:id', name: 'category', component: Category },
        { path: '/tag/:id', name: 'tag', component: Tag }
    ]
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
