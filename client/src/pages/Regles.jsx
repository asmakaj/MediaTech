import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Regles() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [salles, setSalles] = useState([]);
    const [form, setForm] = useState({ salle_id: '', date_reservation: '', heure: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            axios.get('/api/admin/reservations').then(r => setReservations(r.data)).catch(() => {});
            axios.get('/api/admin/salles').then(r => setSalles(r.data)).catch(() => {});
        }
    }, [user]);

    const handleReservation = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/reservations', form);
            setMsg('Reservation enregistree !');
            setForm({ salle_id: '', date_reservation: '', heure: '' });
            const r = await axios.get('/api/admin/reservations');
            setReservations(r.data);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Erreur');
        }
    };

    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Informations et Regles</h2>
            </div>

            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="grid-2">
                <div className="card">
                    <div className="card-header"><h3>Regles d'utilisation</h3></div>
                    <div style={{fontSize:'0.88rem', lineHeight:'1.8'}}>
                        <div style={{marginBottom:'16px'}}>
                            <strong style={{color:'#4a5b6e', fontSize:'0.95rem'}}>Niveau Debutant (0-29 points)</strong>
                            <ul style={{marginLeft:'20px', marginTop:'8px', marginBottom:'0'}}>
                                <li>Consultation des objets (lecture seule)</li>
                                <li>Accès à la page Visualisation</li>
                                <li>Accès à la page Informations et Règles</li>
                                <li>Gestion de son profil personnel</li>
                            </ul>
                        </div>
                        <div style={{marginBottom:'16px'}}>
                            <strong style={{color:'#2d6a4f', fontSize:'0.95rem'}}>Niveau Avance (30-59 points)</strong>
                            <ul style={{marginLeft:'20px', marginTop:'8px', marginBottom:'0'}}>
                                <li>Tous les droits du niveau Débutant</li>
                                <li><strong>Accès complet au Module Gestion</strong></li>
                                <li>Modification des objets (création, édition)</li>
                                <li>Demande de suppression d'objets (avec justification)</li>
                                <li>Gestion des réservations de salle</li>
                                <li>Historique détaillé de ses actions</li>
                            </ul>
                        </div>
                        <div>
                            <strong style={{color:'#1d3557', fontSize:'0.95rem'}}>Niveau Expert (60+ points)</strong>
                            <ul style={{marginLeft:'20px', marginTop:'8px', marginBottom:'0'}}>
                                <li>Tous les droits du niveau Avancé</li>
                                <li><strong>Accès complet au Module Administration</strong></li>
                                <li>Gestion des utilisateurs (rôles et permissions)</li>
                                <li>Approbation des modifications et suppressions</li>
                                <li>Suppression directe d'objets</li>
                                <li>Audit complet (historique de tous les utilisateurs)</li>
                                <li>Gestion des salles et réservations globales</li>
                                <li>Rapports d'activité et statistiques</li>
                            </ul>
                        </div>
                        <div style={{marginTop:'16px', paddingTop:'12px', borderTop:'1px solid #eee', fontSize:'0.82rem', color:'#666'}}>
                            <strong>Accumulation de points :</strong> +0.25 pt par connexion | +0.50 pt par consultation d'objet
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3>Reservation de Salle</h3></div>
                    {!user ? (
                        <p style={{fontSize:'0.88rem', color:'#4a5b6e'}}>Connectez-vous pour faire une reservation.</p>
                    ) : (
                        <form onSubmit={handleReservation}>
                            <div className="form-group">
                                <label>Salle</label>
                                <select value={form.salle_id} onChange={e => setForm({...form, salle_id: e.target.value})} required>
                                    <option value="">Choisir une salle...</option>
                                    {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                                </select>
                            </div>
                            <div className="grid-2" style={{gap:'10px'}}>
                                <div className="form-group"><label>Date</label><input type="date" value={form.date_reservation} onChange={e => setForm({...form, date_reservation: e.target.value})} required /></div>
                                <div className="form-group"><label>Heure</label><input type="time" value={form.heure} onChange={e => setForm({...form, heure: e.target.value})} required /></div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Reserver</button>
                        </form>
                    )}

                    {reservations.length > 0 && (
                        <div style={{marginTop:'16px'}}>
                            <strong style={{fontSize:'0.85rem'}}>Reservations recentes :</strong>
                            {reservations.slice(0, 5).map(r => (
                                <div key={r.id} style={{fontSize:'0.82rem', padding:'5px 0', borderBottom:'1px solid #eee'}}>
                                    <strong>{r.salle_nom}</strong> — {r.date_reservation} a {r.heure} (par {r.pseudo})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
