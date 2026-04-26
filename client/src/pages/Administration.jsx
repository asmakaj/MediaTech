import { useEffect, useState } from 'react';
import axios from 'axios';

const LEVELS = { debutant:'Debutant', intermediaire:'Intermediaire', avance:'Avance', expert:'Expert' };

export default function Administration() {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [deletionRequests, setDeletionRequests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [msg, setMsg] = useState('');

    const load = async () => {
        const [u, l, dr, c, r] = await Promise.all([
            axios.get('/api/admin/users'),
            axios.get('/api/admin/logs'),
            axios.get('/api/admin/deletion-requests'),
            axios.get('/api/admin/categories'),
            axios.get('/api/admin/reservations')
        ]);
        setUsers(u.data);
        setLogs(l.data);
        setDeletionRequests(dr.data);
        setCategories(c.data);
        setReservations(r.data);
    };

    useEffect(() => { load(); }, []);

    const adjustPoints = async (id, delta) => {
        await axios.patch(`/api/admin/users/${id}/points`, { delta });
        load();
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        await axios.delete(`/api/admin/users/${id}`);
        setMsg('Utilisateur supprime');
        load();
    };

    const approveDeletion = async (id) => {
        await axios.post(`/api/admin/deletion-requests/${id}/approve`);
        setMsg('Objet supprime');
        load();
    };

    const rejectDeletion = async (id) => {
        await axios.post(`/api/admin/deletion-requests/${id}/reject`);
        setMsg('Demande rejetee');
        load();
    };

    const addCategory = async (e) => {
        e.preventDefault();
        if (!newCat.trim()) return;
        await axios.post('/api/admin/categories', { nom: newCat });
        setNewCat('');
        load();
    };

    const deleteCategory = async (id) => {
        await axios.delete(`/api/admin/categories/${id}`);
        load();
    };

    const exportData = async () => {
        const r = await axios.get('/api/admin/export');
        const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mediatech_backup_${Date.now()}.json`;
        a.click();
    };

    return (
        <main className="main-container">
            {msg && <div className="alert alert-success" onClick={() => setMsg('')}>{msg}</div>}

            <div className="card">
                <div className="card-header"><h3>Gestion des Utilisateurs</h3></div>
                <div style={{overflowX:'auto'}}>
                    <table>
                        <thead>
                            <tr><th>Pseudo</th><th>Email</th><th>Type</th><th>Niveau (Points)</th><th>Actif</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td><strong>{u.pseudo}</strong></td>
                                    <td style={{fontSize:'0.8rem'}}>{u.email}</td>
                                    <td>{u.type_membre}</td>
                                    <td>{LEVELS[u.level]} ({parseFloat(u.points).toFixed(2)} pts)</td>
                                    <td>
                                        <span className={`status-badge ${u.actif ? 'status-active' : 'status-inactive'}`}>
                                            {u.actif ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" onClick={() => adjustPoints(u.id, 15)}>+15pts</button>{' '}
                                        <button className="btn btn-outline btn-sm" onClick={() => adjustPoints(u.id, -15)}>-15pts</button>{' '}
                                        <button className="btn btn-sm" style={{background:'#fee2e2', color:'#ef4444', border:'1px solid #fecaca'}} onClick={() => deleteUser(u.id)}>
                                            Suppr.
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-header"><h3>Demandes de Suppression</h3></div>
                    {deletionRequests.length === 0 ? (
                        <p style={{color:'#4a5b6e', fontSize:'0.88rem'}}>Aucune demande en attente.</p>
                    ) : deletionRequests.map(r => (
                        <div key={r.id} style={{background:'#fff1f2', border:'1px solid #fecdd3', padding:'12px', borderRadius:'12px', marginBottom:'10px'}}>
                            <strong>{r.objet_nom}</strong> (par {r.pseudo})<br />
                            <span style={{fontSize:'0.82rem'}}>Motif : {r.reason}</span><br />
                            <div style={{marginTop:'8px', display:'flex', gap:'8px'}}>
                                <button className="btn btn-danger btn-sm" onClick={() => approveDeletion(r.id)}>Accepter</button>
                                <button className="btn btn-outline btn-sm" onClick={() => rejectDeletion(r.id)}>Refuser</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-header"><h3>Categories d'objets</h3></div>
                    <form onSubmit={addCategory} style={{display:'flex', gap:'8px', marginBottom:'14px'}}>
                        <input className="filter-input" placeholder="Nouvelle categorie..." value={newCat} onChange={e => setNewCat(e.target.value)} style={{flex:1}} />
                        <button type="submit" className="btn btn-primary btn-sm">Ajouter</button>
                    </form>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                        {categories.map(c => (
                            <div key={c.id} style={{background:'#f1f4f9', padding:'4px 12px', borderRadius:'40px', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'6px'}}>
                                {c.nom}
                                <span style={{cursor:'pointer', color:'#ef4444', fontWeight:700}} onClick={() => deleteCategory(c.id)}>x</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3>Reservations de Salles</h3></div>
                    {reservations.length === 0 ? <p style={{fontSize:'0.88rem', color:'#4a5b6e'}}>Aucune reservation.</p> :
                        reservations.slice(0, 10).map(r => (
                            <div key={r.id} style={{fontSize:'0.83rem', padding:'6px 0', borderBottom:'1px solid #e2e8f0'}}>
                                <strong>{r.salle_nom}</strong> — {r.date_reservation} a {r.heure} (par {r.pseudo})
                            </div>
                        ))
                    }
                </div>

                <div className="card">
                    <div className="card-header"><h3>Securite & Maintenance</h3></div>
                    <p style={{fontSize:'0.85rem', color:'#4a5b6e', marginBottom:'14px'}}>
                        Exporter une image JSON de toute la base de donnees.
                    </p>
                    <button className="btn btn-primary" onClick={exportData}>
                        <i className="fas fa-download"></i> Sauvegarder la BDD (JSON)
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header"><h3>Journal Global du Systeme</h3></div>
                <div className="history-list" style={{maxHeight:'400px'}}>
                    {logs.map(l => (
                        <div key={l.id} className="history-item">
                            <span style={{fontFamily:'monospace', color:'#64748b', marginRight:'12px', whiteSpace:'nowrap'}}>
                                [{new Date(l.created_at).toLocaleTimeString()}]
                            </span>
                            <span style={{width:'100px', display:'inline-block', fontWeight:600}}>{l.pseudo}</span>
                            <span><strong>{l.type}</strong> — {l.detail}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
