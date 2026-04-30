export default function Contact() {
    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Nous Contacter</h2>
            </div>

            <div className="grid-2" style={{maxWidth:'1000px', margin:'0 auto', gap:'24px'}}>
                <div className="card">
                    <div className="card-header"><h3>Coordonnées</h3></div>
                    <div style={{fontSize:'0.9rem', lineHeight:'2'}}>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>📧 Email</p>
                            <p><a href="mailto:support@mediatech.local" style={{color:'#2c5a7a', textDecoration:'none'}}>support@mediatech.local</a></p>
                        </div>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>📞 Téléphone</p>
                            <p>+33 (0) XXX XX XX XX</p>
                        </div>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>📍 Adresse</p>
                            <p>Mediatech<br />Centre de Ressources<br />Ville, Code Postal</p>
                        </div>
                        <div>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>🕐 Horaires</p>
                            <p>Lundi - Vendredi : 09h00 - 17h00<br />Samedi - Dimanche : Fermé</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3>Formulaire de Contact</h3></div>
                    <form style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                        <div className="form-group">
                            <label>Nom</label>
                            <input type="text" placeholder="Votre nom" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="votre.email@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Sujet</label>
                            <input type="text" placeholder="Objet du message" />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea placeholder="Votre message..." style={{height:'120px', resize:'vertical', padding:'10px', borderRadius:'6px', border:'1px solid #e2e8f0'}}></textarea>
                        </div>
                        <button className="btn btn-primary" type="submit">Envoyer le message</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
