import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LEVELS = {
    debutant: { label: 'Debutant', color: '#94a3b8', next: 10 },
    intermediaire: { label: 'Intermediaire', color: '#38bdf8', next: 30 },
    avance: { label: 'Avance', color: '#818cf8', next: 60 },
    expert: { label: 'Expert', color: '#fbbf24', next: null }
};

const icons = { 'Borne interactive':'fa-robot','Console de jeux':'fa-gamepad','Television':'fa-tv','Imprimante':'fa-cube','Ordinateur':'fa-desktop','Capteur':'fa-microchip','Thermostat':'fa-temperature-low','Eclairage':'fa-lightbulb','VR':'fa-vr-cardboard','Camera':'fa-camera' };

export default function Visualisation() {
    const { user, refreshUser } = useAuth();
    const [members, setMembers] = useState([]);
    const [history, setHistory] = useState([]);
    const [objets, setObjets] = useState([]);
    const [q, setQ] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ nom: '', prenom: '', password: '' });
    const [detailModal, setDetailModal] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('/api/users').then(r => setMembers(r.data));
        axios.get('/api/users/history').then(r => setHistory(r.data));
        axios.get('/api/objets').then(r => setObjets(r.data));
    }, []);

    const filtered = objets.filter(o => o.nom.toLowerCase().includes(q.toLowerCase()) || (o.type_nom||'').toLowerCase().includes(q.toLowerCase()));

    const consultObject = async (id) => {
        try {
            const r = await axios.get(`/api/objets/${id}`);
            setDetailModal(r.data.objet);
            await refreshUser();
            const h = await axios.get('/api/users/history');
            setHistory(h.data);
        } catch (err) {
            console.error(err);
        }
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/auth/profile', editForm);
            setMsg('Profil mis a jour');
            setEditModal(false);
            refreshUser();
        } catch (err) {
            setMsg(err.response?.data?.message || 'Erreur');
        }
    };

    const lvl = LEVELS[user.level];

    return (
        <main className="main-container">
            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>Mon Profil</h3>
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditForm({ nom: user.nom, prenom: user.prenom, password: '' }); setEditModal(true); }}>
                            Editer
                        </button>
                    </div>
                    <div style={{background:'#f8fafd', padding:'14px', borderRadius:'12px', marginBottom:'14px'}}>
                        <p><strong>Public :</strong> {user.pseudo} ({user.age} ans, {user.genre})</p>
                        <p>Statut : {user.type_membre}</p>
                        <hr style={{margin:'8px 0', border:'none', borderTop:'1px solid #e2e8f0'}} />
                        <p><strong>Prive :</strong> {user.nom} {user.prenom}</p>
                        <p>Email : {user.email}</p>
                    </div>
                    <div style={{background:'linear-gradient(90deg, #1a3a5c, #2c5a7a)', color:'white', padding:'16px', borderRadius:'12px'}}>
                        <h4 style={{marginBottom:'6px'}}>Experience</h4>
                        <p style={{fontSize:'1.8rem', fontWeight:800, margin:0}}>
                            {parseFloat(user.points).toFixed(2)} pts
                            <span style={{fontSize:'1rem', fontWeight:400, opacity:0.85}}> / {lvl.label}</span>
                        </p>
                        {lvl.next && <p style={{fontSize:'0.75rem', marginTop:'6px', opacity:0.8}}>Prochain niveau : {lvl.next} pts</p>}
                        <p style={{fontSize:'0.75rem', marginTop:'4px', opacity:0.75}}>+0.25pt connexion · +0.50pt consultation</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3>Mon Historique</h3></div>
                    <div className="history-list">
                        {history.map(l => (
                            <div key={l.id} className="history-item">
                                <span><strong>{l.type}</strong> : {l.detail}</span>
                                <span style={{color:'#10b981', whiteSpace:'nowrap'}}>{l.pts_gagnes > 0 ? `+${l.pts_gagnes}pt` : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h3>Annuaire des Membres</h3></div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                    {members.map(m => (
                        <div key={m.id} style={{background:'#f1f4f9', padding:'6px 14px', borderRadius:'40px', fontSize:'0.83rem'}}>
                            <i className="fas fa-user-circle" style={{color:'#94a3b8', marginRight:'6px'}}></i>
                            <strong>{m.pseudo}</strong> ({LEVELS[m.level]?.label}) — {m.type_membre}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h3>Consultation des Objets</h3></div>
                <div className="filter-bar">
                    <input className="filter-input" placeholder="Recherche par nom ou type..." value={q} onChange={e => setQ(e.target.value)} />
                </div>
                <div className="grid-4">
                    {filtered.map(o => (
                        <div key={o.id} className="object-card">
                            <i className={`fas ${icons[o.type_nom] || 'fa-plug'}`}></i>
                            <strong style={{display:'block', marginBottom:'8px'}}>{o.nom}</strong>
                            <span className={`status-badge ${o.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>{o.etat}</span>
                            <br />
                            <button className="btn btn-primary btn-sm" style={{marginTop:'10px'}} onClick={() => consultObject(o.id)}>
                                Consulter
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {editModal && (
                <div className="modal-overlay" onClick={() => setEditModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>Editer le profil prive</h3>
                        <form onSubmit={saveProfile}>
                            <div className="form-group"><label>Nom</label><input value={editForm.nom} onChange={e => setEditForm({...editForm, nom: e.target.value})} /></div>
                            <div className="form-group"><label>Prenom</label><input value={editForm.prenom} onChange={e => setEditForm({...editForm, prenom: e.target.value})} /></div>
                            <div className="form-group"><label>Nouveau mot de passe (optionnel)</label><input type="password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                                <button type="button" className="btn btn-outline" onClick={() => setEditModal(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {detailModal && (
                <div className="modal-overlay" onClick={() => setDetailModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>{detailModal.nom}</h3>
                        <table style={{marginTop:'10px'}}>
                            <tbody>
                                {[
                                    ['Type', detailModal.type_nom],
                                    ['Marque', detailModal.marque],
                                    ['Etat', detailModal.etat],
                                    ['Localisation', detailModal.salle_nom],
                                    ['Consommation', `${detailModal.consommation} W`],
                                    ['Connectivite', detailModal.connectivite],
                                    ['Batterie', detailModal.batterie ? `${detailModal.batterie}%` : 'N/A'],
                                    ['Description', detailModal.description],
                                ].map(([k, v]) => v ? (
                                    <tr key={k}><td style={{fontWeight:600, width:'140px'}}>{k}</td><td>{v}</td></tr>
                                ) : null)}
                            </tbody>
                        </table>
                        <div style={{marginTop:'16px', padding:'10px', background:'#d1fae5', borderRadius:'10px', fontSize:'0.82rem', color:'#065f46'}}>
                            +0.50 points gagnes pour cette consultation !
                        </div>
                        <button className="btn btn-outline" style={{width:'100%', marginTop:'14px'}} onClick={() => setDetailModal(null)}>Fermer</button>
                    </div>
                </div>
            )}
        </main>
    );
}
