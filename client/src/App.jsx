import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Accueil from './pages/Accueil';
import Information from './pages/Information';
import Visualisation from './pages/Visualisation';
import Gestion from './pages/Gestion';
import Administration from './pages/Administration';
import Regles from './pages/Regles';
import ValidateEmail from './pages/ValidateEmail';

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
                <Route path="/valider-email" element={<ValidateEmail />} />
                <Route path="/regles" element={<Regles />} />
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
