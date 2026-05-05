import { ToastContainer } from 'react-toastify/unstyled'
import './App.css'
import Nav from './Pages/Header/Nav'
import AppRouter from './router/Routes'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
