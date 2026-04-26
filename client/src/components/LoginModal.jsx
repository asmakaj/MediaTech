import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onSwitchRegister }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ pseudo: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(form.pseudo, form.password);
            onClose();
            navigate('/visualisation');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3>Connexion</h3>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Pseudonyme</label>
                        <input type="text" value={form.pseudo} onChange={e => setForm({...form, pseudo: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    </div>
                    <p style={{fontSize:'0.75rem', color:'#666', marginBottom:'12px'}}>
                        Demo: admin/password | mdupont/password | jlevier/password
                    </p>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Fermer</button>
                    </div>
                </form>
                <p style={{marginTop:'14px', fontSize:'0.82rem', textAlign:'center'}}>
                    Pas encore inscrit ?{' '}
                    <span style={{color:'#1a3a5c', cursor:'pointer', fontWeight:600}} onClick={onSwitchRegister}>S'inscrire</span>
                </p>
            </div>
        </div>
    );
}
