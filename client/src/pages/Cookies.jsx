export default function Cookies() {
    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Politique de Cookies</h2>
            </div>

            <div className="card" style={{maxWidth:'900px', margin:'0 auto'}}>
                <div style={{fontSize:'0.9rem', lineHeight:'1.8', color:'#4a5b6e'}}>
                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>1. Qu'est-ce qu'un Cookie ?</h3>
                    <p style={{marginBottom:'24px'}}>
                        Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile. Il contient des données nous permettant de vous reconnaître et de personnaliser votre expérience.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>2. Types de Cookies Utilisés</h3>
                    <div style={{marginBottom:'24px'}}>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>Cookies d'Authentification</p>
                            <p>Utilisés pour mémoriser votre connexion et maintenir votre session sécurisée.</p>
                        </div>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>Cookies de Préférences</p>
                            <p>Sauvegardent vos préférences de langue, thème et autres paramètres.</p>
                        </div>
                        <div style={{marginBottom:'16px'}}>
                            <p style={{fontWeight:'600', color:'#1a3a5c'}}>Cookies d'Analytique</p>
                            <p>Nous aident à comprendre comment vous utilisez le site pour l'améliorer.</p>
                        </div>
                    </div>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>3. Gestion des Cookies</h3>
                    <p style={{marginBottom:'8px'}}>Vous pouvez :</p>
                    <ul style={{marginLeft:'20px', marginBottom:'24px'}}>
                        <li>Accepter ou refuser les cookies lors de votre première visite</li>
                        <li>Modifier vos paramètres de cookies dans les paramètres de votre navigateur</li>
                        <li>Supprimer les cookies existants de votre appareil</li>
                    </ul>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>4. Cookies Tiers</h3>
                    <p style={{marginBottom:'24px'}}>
                        Mediatech n'utilise actuellement que des cookies nécessaires au fonctionnement du service. Nous ne partageons pas d'informations avec des services tiers.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>5. Consentement</h3>
                    <p style={{marginBottom:'24px'}}>
                        En continuant à utiliser Mediatech après cette notification, vous consentez à l'utilisation de cookies tel que décrit dans cette politique.
                    </p>

                    <div style={{padding:'16px', background:'#e8f5e9', borderRadius:'6px', borderLeft:'4px solid #10b981', marginTop:'24px'}}>
                        <p style={{color:'#1b5e20', fontWeight:'600', marginBottom:'8px'}}>💡 Conseil Utilisateur</p>
                        <p style={{color:'#2e7d32', fontSize:'0.85rem'}}>
                            Les cookies sont essentiels pour mémoriser votre connexion et garantir la sécurité de votre compte. Nous vous recommandons de les conserver activés.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
