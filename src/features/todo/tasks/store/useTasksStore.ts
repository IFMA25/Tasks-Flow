import { ref } from 'vue';

import { defineStore } from 'pinia';

import { TasksResponse } from '../../types';
import { useTasksRequest } from '../api/useTasksRequest';

export const useTasksStore = defineStore("tasks", () => {

    const tasksData = ref<TasksResponse | null>(null);
    const currentListId = ref<string | null>(null);
    
    const { getAllTasks } = useTasksRequest();
    
    const { execute, data, loading } = getAllTasks(() => currentListId.value, {
        onSuccess: () => {
            tasksData.value = data.value || null;
            console.log("tasks", data.value);
        },
    });

    const fetchTasksForList = async (listId: string) => {
        currentListId.value = listId;
        await execute();
    };

    return { tasksData, loading, fetchTasksForList };
    
})