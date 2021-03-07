import Vue from "vue";
import App from "./App.vue";
import UUID from "vue-uuid";
import store from "./store/index.js";

Vue.use(UUID);
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
