import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ValidateEmail() {
    const [params] = useSearchParams();
    const [status, setStatus] = useState('Validation en cours...');
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const token = params.get('token');
        if (!token) { setStatus('Token manquant.'); return; }
        axios.get(`/api/auth/validate?token=${token}`)
            .then(r => { setStatus(r.data.message); setOk(true); })
            .catch(err => setStatus(err.response?.data?.message || 'Erreur de validation.'));
    }, []);

    return (
        <main className="main-container" style={{textAlign:'center', paddingTop:'80px'}}>
            <div className="card" style={{maxWidth:'400px', margin:'0 auto'}}>
                <i className={`fas ${ok ? 'fa-check-circle' : 'fa-times-circle'}`} style={{fontSize:'3rem', color: ok ? '#10b981' : '#ef4444', marginBottom:'16px'}}></i>
                <h3 style={{marginBottom:'12px'}}>{status}</h3>
                {ok && <Link to="/" className="btn btn-primary" style={{textDecoration:'none'}}>Retour a l'accueil</Link>}
            </div>
        </main>
    );
}
