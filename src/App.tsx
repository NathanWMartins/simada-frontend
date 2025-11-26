import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { I18nProvider } from './i18n/I18nProvider';


function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
