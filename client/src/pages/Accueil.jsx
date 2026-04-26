import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Accueil() {
    const [stats, setStats] = useState({ objets: 0, users: 0 });

    useEffect(() => {
        axios.get('/api/objets').then(r => setStats(s => ({ ...s, objets: r.data.length })));
    }, []);

    return (
        <main className="main-container">
            <div className="hero">
                <h2>MediaTech<br />Votre plateforme numerique intelligente</h2>
                <p>Gestion d'acces, consommation optimisee, objets connectes en temps reel et reservation de salles.</p>
            </div>

            <div className="grid-4" style={{marginBottom:'32px'}}>
                {[
                    { val: stats.objets, label: 'Objets connectes' },
                    { val: '24/7', label: 'Supervision' },
                    { val: '9', label: 'Salles gerees' },
                    { val: '4', label: 'Modules actifs' },
                ].map((s, i) => (
                    <div key={i} className="card" style={{textAlign:'center', marginBottom:0}}>
                        <div style={{fontSize:'2.2rem', fontWeight:800, color:'#1a3a5c'}}>{s.val}</div>
                        <div style={{color:'#4a5b6e', fontSize:'0.9rem'}}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header"><h3>Les avantages de la plateforme</h3></div>
                <div className="grid-3">
                    {[
                        { icon: 'fa-search', title: 'Information libre', desc: 'Module ouvert au public pour decouvrir l\'etablissement et ses services.' },
                        { icon: 'fa-layer-group', title: 'Evolution des acces', desc: 'Cumulez des points en consultant des objets et debloquee les modules Gestion et Administration.' },
                        { icon: 'fa-bolt', title: 'Optimisation energetique', desc: 'Les membres avances controlent les appareils pour reduire l\'empreinte environnementale.' },
                    ].map((s, i) => (
                        <div key={i} style={{background:'#fafcff', borderRadius:'18px', padding:'20px', border:'1px solid #eef2f8'}}>
                            <i className={`fas ${s.icon}`} style={{fontSize:'1.8rem', color:'#1a3a5c', marginBottom:'10px', display:'block'}}></i>
                            <h4 style={{marginBottom:'6px'}}>{s.title}</h4>
                            <p style={{fontSize:'0.88rem', color:'#4a5b6e'}}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
