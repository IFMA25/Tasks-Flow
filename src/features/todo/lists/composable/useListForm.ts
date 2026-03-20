import {
  computed,
  Ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useListsFeature } from "./useListsFeature";
import { FormDataList, ListData } from "../../types";
import { useListsRequests } from "../api/useListsRequest";

import { colorsList } from "@/shared/variables/colorMap";

export const useListForm = (formDataList: FormDataList, selectedList: Ref<ListData | null>) => {

  const { createNewList, updateList } = useListsRequests();
  const { updateLists } = useListsFeature();
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
      updateLists();
      toast.success(t("lists.msgCreateSuccess"));
    },
  });

  const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
    () => selectedList.value?.id, {
      data: submitData,
      onSuccess: () => {
        updateLists();
        toast.success(t("lists.msgUpdateSuccess"));
      },
    });
  // стоит ли мне тут делать валидацию через вьювалидате и выводи ошибку при смене блура? кнопка у меня остаеться заблокированой пока не введут текст или не измениться содержимое
  const isValid = computed(() => !!formDataList.title);

  const isDataChanged = computed(() => {
    if (!selectedList.value) return true;

    return formDataList.title !== selectedList.value.title ||
           formDataList.hexColor !== (selectedList.value.hexColor || colorsList[0]);
  });

  const isSubmitDisabled = computed(() => !(isValid.value && isDataChanged.value));

  const isLoading = computed(() => createListLoading.value || updateListLoading.value);

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (selectedList.value?.id) {
        await updateSelectedListExecute();
      } else {
        await createNewListExecute();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    isSubmitDisabled,
    isLoading,
    initForm,
    handleSubmit,
  };
};
