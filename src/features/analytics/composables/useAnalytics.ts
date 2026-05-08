import { ref } from "vue";

import { PeriodAnalytics } from "../types";
import { periodAnalitics, tagsAnalitics } from "../variable";

const period = ref<PeriodAnalytics>(periodAnalitics[0]);

const topTag = ref<number>(Number(Object.keys(tagsAnalitics)[0]));

export const useAnalytics = () => ({ period, topTag });
