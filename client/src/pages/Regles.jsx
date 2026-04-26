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
                    <ul style={{marginLeft:'20px', fontSize:'0.88rem', lineHeight:'2'}}>
                        <li>L'acces au <strong>Module Gestion</strong> requiert 30 points (niveau Avance).</li>
                        <li>L'acces au <strong>Module Administration</strong> requiert 60 points (niveau Expert).</li>
                        <li>Chaque connexion rapporte <strong>+0.25 pt</strong>.</li>
                        <li>Chaque consultation d'objet rapporte <strong>+0.50 pt</strong>.</li>
                        <li>Toute modification d'objet est journalisee et auditable.</li>
                        <li>Les demandes de suppression doivent etre motivees.</li>
                        <li>L'abus des controles peut entrainer une reduction de points.</li>
                    </ul>
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
