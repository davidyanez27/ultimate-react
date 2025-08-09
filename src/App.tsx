
import { BrowserRouter } from 'react-router'
import { AppRouter } from './Presentation/router/AppRouter'
import { ThemeProvider } from './Presentation/Context'

function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
