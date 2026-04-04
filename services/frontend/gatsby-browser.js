import './src/css/global.css'
import './src/css/BubbleMenu.css'

export const onClientEntry = () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

export const onRouteUpdate = () => {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  })
}

export const shouldUpdateScroll = () => false
