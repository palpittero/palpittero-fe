// import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('palpittero/theme', {
  persist: true,
  state: () => ({
    theme: 'quartz'
  }),
  actions: {
    async switchTheme(theme) {
      this.theme = theme

      const themeURL = `/themes/bootstrap.${theme}.min.css`

      const response = await fetch(themeURL)
      const content = await response.text()

      document.getElementById('palpittero-theme').innerHTML = content
    }
  }
})
