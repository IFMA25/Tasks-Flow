import {
  computed,
  ref,
} from 'vue';

import { useModal } from '@/shared/composables/useModal';
import { colorsList } from '@/shared/variables/colorMap';

import { ListData } from '../../types';
import { useListsRequests } from '../api/useListsRequest';
import { useListsFeature } from './useListsFeature';

export const useListForm = () => {

  const list = ref<ListData | null>(null)
  const selectedList = computed(() => list.value);
  const name = ref("");
  const color = ref(colorsList[0]);

  const { createNewList, updateList } = useListsRequests();
  const {updateLists} = useListsFeature();
  const { open: openModal, close } = useModal("listFormModal");

  const initForm = (listEdit: ListData | null) => {
    console.log("initForm", listEdit)
    list.value = listEdit;
     console.log("listValue", listEdit)
    name.value = list.value.title || "";
    console.log(name.value)
    color.value = listEdit?.hexColor || colorsList[0];
  };

  const resetForm = () => {
    list.value = null;
    name.value = "";
    color.value = colorsList[0];
  };

  const open = (list?: ListData) => {
  if (list) initForm(list);
  console.log("open", list)
  openModal();
};

const handleClose = () => {
  close();
  resetForm();
}

  const submitData = () => ({
    title: name.value,
    hexColor: color.value,
  });

  const { execute: createNewListExecute, loading: createListLoading } = createNewList({
    data: submitData,
    onSuccess: () => {
      updateLists();
    },
  });

  const { execute: updateSelectedListExecute, loading: updateListLoading } = updateList(
    () => list.value?.id, {
      data: submitData,
      onSuccess: () => {
        updateLists()
      }
    });

  const isValid = computed(() => !!name.value);

  const isDataChanged = computed(() => {
    if (!list.value) return true;

    return name.value !== list.value?.title || 
           color.value !== (list.value.hexColor || colorsList[0]);
  });

  const isSubmitDisabled = computed(() => !(isValid.value && isDataChanged.value));

  const isLoading = computed(() => createListLoading.value || updateListLoading.value);

  const handleSubmit = async () => {
    if (isSubmitDisabled.value) return;

    try {
      if (list.value?.id) {
        await updateSelectedListExecute();
      } else {
        await createNewListExecute();
      }
      handleClose()
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    selectedList,
    name,
    color,
    open,
    handleClose,
    isSubmitDisabled,
    isLoading,
    initForm,
    resetForm,
    handleSubmit,
  };
};
