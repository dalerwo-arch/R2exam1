import { createRoot } from 'react-dom/client'
import './index.css'
import { redaxStore } from '@/stores/redaxStore'
import { Provider } from 'react-redux'
import App from '@/App'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={redaxStore}>
      <App />
    </Provider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}