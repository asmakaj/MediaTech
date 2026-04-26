import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const LEVELS = {
    debutant: { label: 'Debutant', color: '#94a3b8' },
    intermediaire: { label: 'Intermediaire', color: '#38bdf8' },
    avance: { label: 'Avance', color: '#818cf8' },
    expert: { label: 'Expert', color: '#fbbf24' }
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const lvl = user ? LEVELS[user.level] : null;

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink to="/" className="logo-area">
                        <div className="logo-icon"><i className="fas fa-microchip"></i></div>
                        <div className="logo-text">
                            <h1>MediaTech</h1>
                            <span>intelligente · connectee</span>
                        </div>
                    </NavLink>

                    <div className="nav-links">
                        <NavLink to="/" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} end>
                            <i className="fas fa-home"></i> Accueil
                        </NavLink>
                        <NavLink to="/information" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
                            <i className="fas fa-search"></i> Information
                        </NavLink>
                        {user && (
                            <NavLink to="/visualisation" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
                                <i className="fas fa-user-circle"></i> Visualisation
                            </NavLink>
                        )}
                        {user && (user.role === 'complexe' || user.role === 'admin') && (
                            <NavLink to="/gestion" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
                                <i className="fas fa-sliders-h"></i> Gestion
                            </NavLink>
                        )}
                        {user && user.role === 'admin' && (
                            <NavLink to="/administration" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
                                <i className="fas fa-shield-alt"></i> Administration
                            </NavLink>
                        )}
                        <NavLink to="/regles" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
                            <i className="fas fa-info-circle"></i> Regles
                        </NavLink>
                    </div>

                    <div className="user-area">
                        {user ? (
                            <>
                                <div className="user-badge">
                                    <i className="fas fa-user"></i>{' '}
                                    <strong>{user.pseudo}</strong>{' '}
                                    <span style={{ color: lvl.color }}>({lvl.label} - {parseFloat(user.points).toFixed(2)}pts)</span>
                                </div>
                                <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/'); }}>
                                    Deconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(true)}>Connexion</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowRegister(true)}>Inscription</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
            {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSwitchLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
        </>
    );
}
