import { createApp } from "vue";
import App from "./App.vue";
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(ElementPlus).mount("#app");
