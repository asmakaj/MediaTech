import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const icons = { 'Borne interactive':'fa-robot','Console de jeux':'fa-gamepad','Television':'fa-tv','Imprimante':'fa-cube','Ordinateur':'fa-desktop','Capteur':'fa-microchip','Thermostat':'fa-temperature-low','Eclairage':'fa-lightbulb','VR':'fa-vr-cardboard','Camera':'fa-camera' };

export default function Gestion() {
    const [objets, setObjets] = useState([]);
    const [stats, setStats] = useState(null);
    const [categories, setCategories] = useState([]);
    const [salles, setSalles] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [newObj, setNewObj] = useState({ nom:'', marque:'', description:'', type_id:'', consommation:100, consommation_max:120, salle_id:'', connectivite:'' });
    const [deleteReason, setDeleteReason] = useState('');
    const [msg, setMsg] = useState('');

    const load = async () => {
        const [o, s, c, sa] = await Promise.all([
            axios.get('/api/objets'),
            axios.get('/api/objets/stats'),
            axios.get('/api/admin/categories'),
            axios.get('/api/admin/salles')
        ]);
        setObjets(o.data);
        setStats(s.data);
        setCategories(c.data);
        setSalles(sa.data);
    };

    useEffect(() => { load(); }, []);

    const toggle = async (id) => {
        await axios.patch(`/api/objets/${id}/toggle`);
        load();
    };

    const saveNew = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/objets', newObj);
            setAddModal(false);
            setMsg('Objet cree avec succes');
            load();
        } catch (err) {
            setMsg(err.response?.data?.message || 'Erreur');
        }
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/objets/${editModal.id}`, editModal);
            setEditModal(null);
            setMsg('Objet mis a jour');
            load();
        } catch (err) {
            setMsg(err.response?.data?.message || 'Erreur');
        }
    };

    const requestDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/objets/${deleteModal.id}/delete-request`, { reason: deleteReason });
            setDeleteModal(null);
            setDeleteReason('');
            setMsg('Demande de suppression transmise a l\'administrateur');
        } catch (err) {
            setMsg(err.response?.data?.message || 'Erreur');
        }
    };

    const chartData = stats ? {
        labels: stats.parType.map(t => t.nom),
        datasets: [{ label: 'Nombre d\'objets', data: stats.parType.map(t => t.count), backgroundColor: '#1a3a5c' }]
    } : null;

    return (
        <main className="main-container">
            {msg && <div className="alert alert-success" onClick={() => setMsg('')}>{msg}</div>}

            <div className="grid-3" style={{marginBottom:'24px'}}>
                <div className="card" style={{marginBottom:0}}>
                    <div className="card-header"><h3>Conso. Globale</h3></div>
                    <h2 style={{color:'#1a3a5c', fontSize:'2rem'}}>{stats?.total?.conso ?? 0} W</h2>
                    <p style={{fontSize:'0.82rem', color:'#4a5b6e'}}>Objets actifs uniquement</p>
                </div>
                <div className="card" style={{marginBottom:0}}>
                    <div className="card-header"><h3>Objets Inefficaces</h3></div>
                    {stats?.inefficaces?.length ? (
                        <ul style={{paddingLeft:'18px', color:'#ef4444', fontSize:'0.88rem'}}>
                            {stats.inefficaces.map(i => <li key={i.id}>{i.nom}</li>)}
                        </ul>
                    ) : <p style={{color:'#10b981', fontSize:'0.88rem'}}>Aucun probleme detecte</p>}
                </div>
                <div className="card" style={{marginBottom:0}}>
                    <div className="card-header"><h3>Actions</h3></div>
                    <button className="btn btn-primary" style={{width:'100%'}} onClick={() => setAddModal(true)}>
                        <i className="fas fa-plus"></i> Creer un objet
                    </button>
                </div>
            </div>

            {chartData && (
                <div className="card">
                    <div className="card-header"><h3>Repartition par type</h3></div>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />
                </div>
            )}

            <div className="card">
                <div className="card-header"><h3>Controle des Appareils</h3></div>
                <div style={{overflowX:'auto'}}>
                    <table>
                        <thead>
                            <tr>
                                <th>Objet</th><th>Type</th><th>Localisation</th>
                                <th>Conso</th><th>Connectivite</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objets.map(o => (
                                <tr key={o.id}>
                                    <td>
                                        <i className={`fas ${icons[o.type_nom] || 'fa-plug'}`} style={{marginRight:'8px', color:'#1a3a5c'}}></i>
                                        <strong>{o.nom}</strong><br />
                                        <span className={`status-badge ${o.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>{o.etat}</span>
                                    </td>
                                    <td>{o.type_nom}</td>
                                    <td>{o.salle_nom}</td>
                                    <td>{o.etat === 'Actif' ? `${o.consommation} W` : '—'}</td>
                                    <td style={{fontSize:'0.8rem'}}>{o.connectivite}</td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" onClick={() => toggle(o.id)}>On/Off</button>{' '}
                                        <button className="btn btn-outline btn-sm" onClick={() => setEditModal({...o, params: o.params || {}})}>Editer</button>{' '}
                                        <button className="btn btn-sm" style={{background:'#fee2e2', color:'#ef4444', border:'1px solid #fecaca'}} onClick={() => setDeleteModal(o)}>
                                            Suppr.
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {addModal && (
                <div className="modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>Ajouter un objet connecte</h3>
                        <form onSubmit={saveNew}>
                            <div className="form-group"><label>Nom</label><input value={newObj.nom} onChange={e => setNewObj({...newObj, nom: e.target.value})} required /></div>
                            <div className="form-group"><label>Marque</label><input value={newObj.marque} onChange={e => setNewObj({...newObj, marque: e.target.value})} /></div>
                            <div className="form-group"><label>Description</label><input value={newObj.description} onChange={e => setNewObj({...newObj, description: e.target.value})} /></div>
                            <div className="grid-2" style={{gap:'10px'}}>
                                <div className="form-group"><label>Categorie</label>
                                    <select value={newObj.type_id} onChange={e => setNewObj({...newObj, type_id: e.target.value})} required>
                                        <option value="">Choisir...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label>Salle</label>
                                    <select value={newObj.salle_id} onChange={e => setNewObj({...newObj, salle_id: e.target.value})} required>
                                        <option value="">Choisir...</option>
                                        {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label>Conso. (W)</label><input type="number" value={newObj.consommation} onChange={e => setNewObj({...newObj, consommation: e.target.value})} /></div>
                                <div className="form-group"><label>Conso. max (W)</label><input type="number" value={newObj.consommation_max} onChange={e => setNewObj({...newObj, consommation_max: e.target.value})} /></div>
                            </div>
                            <div className="form-group"><label>Connectivite</label><input value={newObj.connectivite} onChange={e => setNewObj({...newObj, connectivite: e.target.value})} placeholder="Wi-Fi, Bluetooth..." /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Ajouter</button>
                                <button type="button" className="btn btn-outline" onClick={() => setAddModal(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editModal && (
                <div className="modal-overlay" onClick={() => setEditModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>Modifier : {editModal.nom}</h3>
                        <form onSubmit={saveEdit}>
                            <div className="form-group"><label>Nom</label><input value={editModal.nom} onChange={e => setEditModal({...editModal, nom: e.target.value})} required /></div>
                            <div className="form-group"><label>Marque</label><input value={editModal.marque || ''} onChange={e => setEditModal({...editModal, marque: e.target.value})} /></div>
                            <div className="form-group"><label>Description</label><input value={editModal.description || ''} onChange={e => setEditModal({...editModal, description: e.target.value})} /></div>
                            <div className="grid-2" style={{gap:'10px'}}>
                                <div className="form-group"><label>Etat</label>
                                    <select value={editModal.etat} onChange={e => setEditModal({...editModal, etat: e.target.value})}>
                                        <option>Actif</option><option>Inactif</option>
                                    </select>
                                </div>
                                <div className="form-group"><label>Salle</label>
                                    <select value={editModal.salle_id} onChange={e => setEditModal({...editModal, salle_id: e.target.value})}>
                                        {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                                    </select>
                                </div>
                                <div className="form-group"><label>Conso. (W)</label><input type="number" value={editModal.consommation} onChange={e => setEditModal({...editModal, consommation: e.target.value})} /></div>
                            </div>
                            <div className="form-group"><label>Connectivite</label><input value={editModal.connectivite || ''} onChange={e => setEditModal({...editModal, connectivite: e.target.value})} /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Mettre a jour</button>
                                <button type="button" className="btn btn-outline" onClick={() => setEditModal(null)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>Demander la suppression</h3>
                        <p style={{marginBottom:'14px', fontSize:'0.88rem', color:'#4a5b6e'}}>
                            Objet : <strong>{deleteModal.nom}</strong><br />
                            La suppression sera soumise a l'administrateur pour validation.
                        </p>
                        <form onSubmit={requestDelete}>
                            <div className="form-group">
                                <label>Motif de suppression</label>
                                <textarea rows={3} value={deleteReason} onChange={e => setDeleteReason(e.target.value)} required style={{borderRadius:'12px', border:'1px solid #e2e8f0', width:'100%', padding:'10px', fontFamily:'inherit'}} />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-danger">Envoyer la demande</button>
                                <button type="button" className="btn btn-outline" onClick={() => setDeleteModal(null)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
