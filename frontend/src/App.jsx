import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Home from './pages/Home.jsx';
import HistoryPage from './pages/History.jsx';
import RedirectPage from './pages/RedirectPage.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';

function App() {
    const theme = useTheme();

    return (
        <Router>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: `radial-gradient(at 0% 0%, ${theme.palette.primary.main}1a 0px, transparent 50%), 
                     radial-gradient(at 100% 100%, ${theme.palette.secondary.main}1a 0px, transparent 50%)`,
            }}>
                <Navbar />

                <Box sx={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/r/:code" element={<RedirectPage />} />
                    </Routes>
                </Box>

                <Footer />
            </Box>
        </Router>
    );
}

export default App;
