import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Конфигурация для разных доменов
const domainConfigs = {
  'f-med.pro': {
    videoUrl: 'https://videobg.ru/vidget/data/video/f-med/IMG_5160.mp4',
    position: {
      type: 'fixed',
      left: '20px',
      bottom: '70px',
      width: '200px'
    },
    playButton: {
      color: '#1CCDC8',
      size: '30px'
    },
    enabled: true
  },
  'example.com': {
    videoUrl: 'https://example.com/video.mp4',
    position: {
      type: 'inline',
      width: '250px'
    },
    playButton: {
      color: '#ffffff',
      size: '40px'
    },
    enabled: true
  }
}

// Генерация случайного ID для корневого элемента
const generateRandomId = () => `video-widget-${Math.random().toString(36).substr(2, 9)}`

// Создаем div для монтирования приложения
const widgetRoot = document.createElement('div')
widgetRoot.id = generateRandomId()
document.body.appendChild(widgetRoot)

const currentDomain = window.location.hostname
const config = domainConfigs[currentDomain]

if (!config) {
  console.warn(`Домен ${currentDomain} не настроен для виджета`)
} else {
  // Монтируем приложение только если домен настроен
  ReactDOM.createRoot(document.getElementById(widgetRoot.id)).render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>
  )
}