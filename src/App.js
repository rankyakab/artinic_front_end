// routes
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import SnackbarProvider from './components/snackbar';
import { ThemeSettings } from './components/settings';
import { MotionLazyContainer } from './components/animate';

// ----------------------------------------------------------------------
// <Provider store={store}> is for the redux store
// <MotionLazyContainer>is for the animation on the theme
// <ThemeProvider> is for the animation on the theme
// <ThemeLocalization> is for the animation on the theme
// <SnackbarProvider> is for the animation on the theme
// <Vatical NavBar was used> is for the animation on the theme
const store = configureStore();



export default function App() {
  return (
    <Provider store={store}>
     
      <MotionLazyContainer>
        <ThemeProvider>
          <ThemeSettings>
            <ThemeLocalization>
            
              <SnackbarProvider>
                <Router />
              </SnackbarProvider>
            </ThemeLocalization>
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
    </Provider>
  );
}
