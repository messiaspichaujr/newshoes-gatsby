import './src/css/global.css'
import './src/css/BubbleMenu.css'

export const onClientEntry = () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

export const onRouteUpdate = ({ location }) => {
  if (location.hash) {
    // Scroll to anchor — retry a few times in case the element isn't painted yet
    const scrollToHash = (attempts = 0) => {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (attempts < 5) {
        setTimeout(() => scrollToHash(attempts + 1), 100)
      }
    }
    requestAnimationFrame(() => scrollToHash())
  } else {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
  }
}

export const shouldUpdateScroll = () => false
