import {
  computed,
  Ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useListsFilters } from "./useListsFilters";
import { FormDataList, ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";

import { colorsList } from "@/shared/variables/colorMap";

export const useListForm = (
  formDataList: FormDataList,
  selectedList: Ref<ListData | null>,
  refetchLists: () => void,
) => {

  const { createNewList, updateList } = useListsRequests();
  const { resetFilters } = useListsFilters();
  const { t } = useI18n();

  const initForm = (listEdit: ListData | null) => {
    selectedList.value = listEdit;
    formDataList.title = listEdit?.title || "";
    formDataList.hexColor = listEdit?.hexColor || colorsList[0];
  };

  const submitData = () => ({
    title: formDataList.title,
    hexColor: formDataList.hexColor,
  });

  const { execute: createNewListExecute, loading: createListLoading } = createNewList({
    data: submitData,
    onSuccess: () => {
      resetFilters();
      refetchLists();
      toast.success(t("lists.msgCreateSuccess"));
    },
  });

  const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
    () => selectedList.value?.id, {
      data: submitData,
      onSuccess: () => {
        refetchLists();
        toast.success(t("lists.msgUpdateSuccess"));
      },
    });

  const isDataChanged = computed(() => {
    if (!selectedList.value) return true;

    return formDataList.title !== selectedList.value.title ||
           formDataList.hexColor !== (selectedList.value.hexColor || colorsList[0]);
  });

  const isSubmitDisabled = computed(() => !formDataList.title || !isDataChanged.value);

  const isLoading = computed(() => createListLoading.value || updateListLoading.value);

  const handleSubmit = async (close: () => void) => {
    if (selectedList.value?.id) {
      await updateSelectedListExecute();
    } else {
      await createNewListExecute();
    }
    close(); //???? если ошибка закрывать тоже?
  };

  return {
    isSubmitDisabled,
    isLoading,
    initForm,
    handleSubmit,
  };
};
