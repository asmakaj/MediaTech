import { useState } from 'react';
import axios from 'axios';

export default function RegisterModal({ onClose, onSwitchLogin }) {
    const [form, setForm] = useState({ pseudo:'', password:'', nom:'', prenom:'', email:'', age:'', genre:'Homme', date_naissance:'', type_membre:'Adulte lecteur' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/register', form);
            setSuccess('Inscription reussie ! Verifiez votre email pour activer votre compte.');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const set = (k, v) => setForm({...form, [k]: v});

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" style={{maxHeight:'90vh', overflowY:'auto'}} onClick={e => e.stopPropagation()}>
                <h3>Inscription</h3>
                {error && <div className="alert alert-error">{error}</div>}
                {success && (
                    <div className="alert alert-success">
                        {success}
                        <br />
                        <span style={{cursor:'pointer', fontWeight:600}} onClick={onSwitchLogin}>Se connecter</span>
                    </div>
                )}
                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="grid-2" style={{gap:'10px'}}>
                            <div className="form-group"><label>Pseudonyme</label><input value={form.pseudo} onChange={e=>set('pseudo',e.target.value)} required /></div>
                            <div className="form-group"><label>Mot de passe</label><input type="password" value={form.password} onChange={e=>set('password',e.target.value)} required /></div>
                            <div className="form-group"><label>Nom</label><input value={form.nom} onChange={e=>set('nom',e.target.value)} required /></div>
                            <div className="form-group"><label>Prenom</label><input value={form.prenom} onChange={e=>set('prenom',e.target.value)} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} required /></div>
                            <div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={e=>set('age',e.target.value)} required /></div>
                            <div className="form-group"><label>Genre</label>
                                <select value={form.genre} onChange={e=>set('genre',e.target.value)}>
                                    <option>Homme</option><option>Femme</option><option>Autre</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Date de naissance</label><input type="date" value={form.date_naissance} onChange={e=>set('date_naissance',e.target.value)} /></div>
                        </div>
                        <div className="form-group"><label>Type de membre</label>
                            <select value={form.type_membre} onChange={e=>set('type_membre',e.target.value)}>
                                <option>Adulte lecteur</option><option>Etudiant</option><option>Chercheur</option><option>Parent accompagnateur</option>
                            </select>
                        </div>
                        <p style={{fontSize:'0.78rem', color:'#666', marginBottom:'12px'}}>
                            L'administrateur verifiera votre appartenance avant validation.
                        </p>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Inscription...' : 'S\'inscrire'}</button>
                            <button type="button" className="btn btn-outline" onClick={onClose}>Fermer</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
