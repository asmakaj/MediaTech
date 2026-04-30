export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>À Propos</h4>
                    <p>Mediatech est une plateforme collaborative de gestion d'objets et de réservations de salles.</p>
                </div>

                <div className="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/information">Informations</a></li>
                        <li><a href="/regles">Règles d'utilisation</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Ressources</h4>
                    <ul>
                        <li><a href="/aide">Aide & Support</a></li>
                        <li><a href="/contact">Nous contacter</a></li>
                        <li><a href="/confidentialite">Politique de confidentialité</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Niveaux d'accès</h4>
                    <ul style={{fontSize:'0.85rem'}}>
                        <li>Débutant : Consultation</li>
                        <li>Avancé : Gestion</li>
                        <li>Expert : Administration</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px'}}>
                    <p>&copy; {currentYear} Mediatech. Tous droits réservés.</p>
                    <div style={{display:'flex', gap:'20px', fontSize:'0.85rem'}}>
                        <a href="/mentions" style={{color:'#64748b', textDecoration:'none', transition:'color 0.3s'}}>Mentions légales</a>
                        <a href="/cgu" style={{color:'#64748b', textDecoration:'none', transition:'color 0.3s'}}>Conditions d'utilisation</a>
                        <a href="/cookies" style={{color:'#64748b', textDecoration:'none', transition:'color 0.3s'}}>Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
