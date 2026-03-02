import { ref } from "vue";

import { ListData } from "../types";

import { useModal } from "@/shared/composables/useModal";
import { colorsList } from "@/shared/config/colorMap";

export function useListModalState() {

  const selectedList = ref<ListData | null>(null);
  const editListName = ref<string>("");
  const editListColor = ref<string>(colorsList[0]);

  const {
    open: openListFormModal,
    close: closeListFormModal,
  } = useModal("listFormModal");

  const {
    open: openListDeleteModal,
    close: closeListDeleteModal,
  } = useModal("listDeleteModal");

  const resetFormData = () => {
    selectedList.value = null;
    editListName.value = "";
    editListColor.value = colorsList[0];
  };

  const handleCloseFormModal = () => {
    resetFormData();
    closeListFormModal();
  };

  const handleCloseDeleteModal = () => {
    selectedList.value = null;
    closeListDeleteModal();
  };

  const openCreateModal = () => {
    resetFormData();
    openListFormModal();
  };

  const handleAction = (list: ListData, action: string) => {
    if (action === "edit") {
      selectedList.value = list;
      editListName.value = list.title;
      editListColor.value = list.hexColor || colorsList[0];
      openListFormModal();
    }
    if (action === "delete") {
      selectedList.value = list;
      openListDeleteModal();
    }
  };

  return {
    selectedList,
    editListName,
    editListColor,
    handleCloseFormModal,
    handleCloseDeleteModal,
    openCreateModal,
    handleAction,
  };
}
