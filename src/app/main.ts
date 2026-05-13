import { createApi, createApiClient, tokenManager } from "@ametie/vue-muza-use";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { createPinia } from "pinia";
import { createApp } from "vue";
import VChart from "vue-echarts";
import VueFeather from "vue-feather";
import { toast } from "vue-sonner";

import App from "./App.vue";
import router from "./router";

import i18n from "@/shared/i18n";
import { RouteNames } from "@/shared/types/routeNames";

import "vue-multiselect/dist/vue-multiselect.min.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "./main.scss";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

const app = createApp(App);

app.use(createPinia());
app.use(i18n);

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  withAuth: true,
  authOptions: {
    refreshUrl: "/auth/refresh",
    refreshPayload: () => ({
      refreshToken: tokenManager.getRefreshToken(),
    }),
    onTokenRefreshFailed: () => {
      tokenManager.clearTokens();
      router.push({ name: RouteNames.auth, query: { mode: "signin" } });
    },
  },
});

app.use(createApi({
  axios: api,
  onError: (error) => toast.error(error.message),
}));

app.use(router);

app.component("VueFeather", VueFeather);
app.component("VueDatePicker", VueDatePicker);
app.component("VChart", VChart);

router.isReady().then(() => {
  app.mount("#app");
});
