import { defineStore } from "pinia";
import { ref } from "vue";

import { ListData } from "../../types";


export const useListsStore = defineStore("lists", () => {
  const listsData = ref<ListData[]>([]);

  const setLists = (data: ListData[]) => {
    listsData.value = data;
  };

  return { listsData, setLists };
});
