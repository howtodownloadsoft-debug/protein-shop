interface TelegramWebApp {
    expand: () => void
    close: () => void
    openLink: (url: string) => void
    openTelegramLink: (url: string) => void
    setHeaderColor: (color: string) => void
    setBackgroundColor: (color: string) => void
    sendData: (data: string) => void
    ready: () => void
    [key: string]: any
  }
  
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
  