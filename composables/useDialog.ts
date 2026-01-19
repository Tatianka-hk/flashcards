import { ref } from 'vue'

export const useDialog = () => {
    const isOpen = ref(false)
    const openDialog = () => {
        isOpen.value = true
    }
    const closeDialog = () => {
        console.log('closeDialog')
        isOpen.value = false
    }
    return { isOpen, openDialog, closeDialog }
}
