import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('historyStore', () => {
    const historyOption = ref<string>('Default')

    const setHistoryOption = (item: string) => {
        historyOption.value = item
    }

    return { historyOption, setHistoryOption }
})

