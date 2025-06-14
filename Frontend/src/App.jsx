import { Provider } from "react-redux";
import store, { persistor } from "./app/store";
import AppRouter from "./router/AppRouter";
import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
          <Toaster position="top-right" />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;