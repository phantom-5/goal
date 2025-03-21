import { Container } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Header } from './components/Header/Header';
import { TabContainer } from './components/TabContainer/TabContainer';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';
import { UserManager } from './components/UserManager/UserManager';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App">
          <Header />
          <Container maxWidth="lg" sx={{ 
            py: { xs: 2, md: 4 },
            px: { xs: 1, sm: 2, md: 3 }
          }}>
            <UserManager />
            <TabContainer />
          </Container>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
