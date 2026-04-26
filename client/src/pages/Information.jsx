import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Information() {
    const [objets, setObjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [q, setQ] = useState('');
    const [typeId, setTypeId] = useState('');
    const [etat, setEtat] = useState('');

    useEffect(() => {
        axios.get('/api/admin/categories').then(r => setCategories(r.data)).catch(() => {});
        search();
    }, []);

    const search = async () => {
        const params = {};
        if (q) params.q = q;
        if (typeId) params.type_id = typeId;
        if (etat) params.etat = etat;
        const r = await axios.get('/api/objets', { params });
        setObjets(r.data);
    };

    useEffect(() => { search(); }, [q, typeId, etat]);

    const icons = { 'Borne interactive':'fa-robot','Console de jeux':'fa-gamepad','Television':'fa-tv','Imprimante':'fa-cube','Ordinateur':'fa-desktop','Capteur':'fa-microchip','Thermostat':'fa-temperature-low','Eclairage':'fa-lightbulb','VR':'fa-vr-cardboard','Camera':'fa-camera' };

    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Module Information</h2>
                <p>Recherchez librement parmi les objets de notre batiment intelligent.</p>
            </div>

            <div className="card">
                <div className="filter-bar">
                    <input className="filter-input" placeholder="Mot-cle (nom, marque, description)..." value={q} onChange={e => setQ(e.target.value)} />
                    <select className="filter-input" value={typeId} onChange={e => setTypeId(e.target.value)}>
                        <option value="">Tous les types</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <select className="filter-input" value={etat} onChange={e => setEtat(e.target.value)}>
                        <option value="">Tous les etats</option>
                        <option>Actif</option>
                        <option>Inactif</option>
                    </select>
                </div>

                {objets.length === 0 ? (
                    <p style={{color:'#4a5b6e', textAlign:'center', padding:'40px'}}>Aucun objet trouve.</p>
                ) : (
                    <div className="grid-3">
                        {objets.map(o => (
                            <div key={o.id} className="object-card">
                                <i className={`fas ${icons[o.type_nom] || 'fa-plug'}`}></i>
                                <h4 style={{marginBottom:'4px'}}>{o.nom}</h4>
                                <p style={{fontSize:'0.82rem', color:'#4a5b6e', marginBottom:'8px'}}>{o.type_nom} — {o.marque}</p>
                                <span className={`status-badge ${o.etat === 'Actif' ? 'status-active' : 'status-inactive'}`}>{o.etat}</span>
                                <p style={{fontSize:'0.78rem', marginTop:'8px', color:'#4a5b6e'}}>
                                    <i className="fas fa-map-marker-alt"></i> {o.salle_nom}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
