interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        ready: () => void
      }
    }
  }
  