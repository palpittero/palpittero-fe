import { defineStore } from 'pinia'
import { ref } from 'vue'

export type iToastLevel = 'info' | 'success' | 'error'

export const useToastStore = defineStore('toast', () => {
  const message = ref<string>('')
  const type = ref<iToastLevel>('info')
  const visible = ref<boolean>(false)

  function show(msg: string, t: iToastLevel = 'info', duration = 5000) {
    message.value = msg
    type.value = t
    visible.value = true

    setTimeout(() => (visible.value = false), duration)
  }

  function info(msg: string) {
    show(msg, 'info')
  }

  function success(msg: string) {
    show(msg, 'success')
  }

  function error(msg: string) {
    show(msg, 'error')
  }

  return { message, type, visible, info, success, error }
})
