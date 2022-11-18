import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AlertProvider } from './context/Alert/AlertContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { CookiesProvider } from 'react-cookie';
import InputPage from './pages/InputPage'
import About from './pages/About'
import MatchReport from './components/screens/MatchReport'

function App() {
  return (
    <CookiesProvider>
      <AlertProvider>
        <Router>
          <div className='flex flex-col h-screen'>
            <Navbar />
            <main className='container mx-auto px-3 pb-12'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/inputpage' element={<InputPage />} />
                <Route path='/matchreport' element={<MatchReport />} />
                <Route path='/about' element={<About />} />
                <Route path='/*' element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AlertProvider>
    </CookiesProvider>
  );
}

export default App;
