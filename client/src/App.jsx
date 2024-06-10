import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '../src/Context/AppContext';
import { CarritoProvider } from './Context/CartContext';
// Admin
import AdminPanel from './Panel/Admin/AdminPanel';
import TicketDetails from './Panel/Admin/TicketDetails'
// Views
import Navbar from './Views/Nav/NavBar';
import SubNavbar from './Views/Nav/SubNavbar/SubNavbar';
import Icononav from './Views/Nav/Iconosnav/Iconosnav';
import CardCarousel from './components/cards/CardCarousel/CardCarousel';
import Blockgif from './components/Blockgif/Blockgif';
import Footer from './Views/Footer/Footer';
import Carousel from './Views/Nav/Carousel/Carousel';
import Catalogo from './Views/Catalogo/Catalogo';
import Compra from './Views/Compra/Compra'

function App() {
  return (
    <AppProvider>
      <CarritoProvider>
      <section className='section-app'>

        <Routes>

          <Route path="/" element={
            <>
              <nav>
                <Navbar />
                <SubNavbar />
                <Carousel />
                <Icononav />
              </nav>
              <CardCarousel />
              <Blockgif />
            </>
          } />

          <Route path="/catalogo" element={
            <>
              <nav>
                <Navbar />
                <SubNavbar />
              </nav>
              <Catalogo />
              <Footer />
            </>
          } />

          <Route path="/admin" element={ <AdminPanel />  } />
          
          <Route path="/compra" element={
            <>
              <nav>
                <Navbar />
                <SubNavbar />
              </nav>
              <Compra />
              <Footer />
            </>
          } />
        </Routes>
      </section>

      <Routes>
        <Route path="/" element={<Footer />} />
      </Routes>
      <Routes>
      <Route path="/ticket/:ticketId" element={<TicketDetails />} />
      </Routes>
      </CarritoProvider>
    </AppProvider>
  );
}

export default App;