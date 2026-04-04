import './src/css/global.css'
import './src/css/BubbleMenu.css'

export const onClientEntry = () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

export const shouldUpdateScroll = () => {
  window.scrollTo(0, 0)
  return false
}
