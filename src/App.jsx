import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/ToastContainer/ToastContainer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
