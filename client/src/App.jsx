import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Information from './pages/Information';
import Visualisation from './pages/Visualisation';
import Gestion from './pages/Gestion';
import Administration from './pages/Administration';
import Regles from './pages/Regles';
import Aide from './pages/Aide';
import Contact from './pages/Contact';
import Confidentialite from './pages/Confidentialite';
import Mentions from './pages/Mentions';
import CGU from './pages/CGU';
import Cookies from './pages/Cookies';

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="main-container">Chargement...</div>;
    if (!user) return <Navigate to="/" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/information" element={<Information />} />
                <Route path="/regles" element={<Regles />} />
                <Route path="/aide" element={<Aide />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/mentions" element={<Mentions />} />
                <Route path="/cgu" element={<CGU />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/visualisation" element={
                    <ProtectedRoute><Visualisation /></ProtectedRoute>
                } />
                <Route path="/gestion" element={
                    <ProtectedRoute roles={['complexe', 'admin']}><Gestion /></ProtectedRoute>
                } />
                <Route path="/administration" element={
                    <ProtectedRoute roles={['admin']}><Administration /></ProtectedRoute>
                } />
            </Routes>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
