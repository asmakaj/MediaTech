export default function Confidentialite() {
    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Politique de Confidentialité</h2>
            </div>

            <div className="card" style={{maxWidth:'900px', margin:'0 auto'}}>
                <div style={{fontSize:'0.9rem', lineHeight:'1.8', color:'#4a5b6e'}}>
                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>1. Introduction</h3>
                    <p style={{marginBottom:'24px'}}>
                        Mediatech s'engage à respecter et à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>2. Données Collectées</h3>
                    <p style={{marginBottom:'8px'}}>Lors de votre inscription, nous collectons :</p>
                    <ul style={{marginLeft:'20px', marginBottom:'24px'}}>
                        <li>Informations d'identification (pseudo, nom, prénom)</li>
                        <li>Coordonnées (email, date de naissance)</li>
                        <li>Données démographiques (âge, genre)</li>
                        <li>Informations de profil (type de membre, photo)</li>
                    </ul>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>3. Utilisation des Données</h3>
                    <p style={{marginBottom:'8px'}}>Vos données sont utilisées pour :</p>
                    <ul style={{marginLeft:'20px', marginBottom:'24px'}}>
                        <li>Gérer votre compte et vos accès</li>
                        <li>Personnaliser votre expérience</li>
                        <li>Améliorer nos services</li>
                        <li>Respecter nos obligations légales</li>
                    </ul>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>4. Partage de Données</h3>
                    <p style={{marginBottom:'24px'}}>
                        Vos données personnelles ne sont jamais vendues ou partagées avec des tiers. Elles sont accessibles uniquement aux administrateurs de Mediatech pour les besoins de gestion de la plateforme.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>5. Sécurité</h3>
                    <p style={{marginBottom:'24px'}}>
                        Nous utilisons des mesures de sécurité standards (chiffrement, hashage) pour protéger vos données contre l'accès non autorisé.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>6. Vos Droits</h3>
                    <p style={{marginBottom:'8px'}}>Vous avez le droit de :</p>
                    <ul style={{marginLeft:'20px', marginBottom:'24px'}}>
                        <li>Accéder à vos données personnelles</li>
                        <li>Corriger vos informations</li>
                        <li>Demander la suppression de votre compte</li>
                        <li>Exercer votre droit à l'oubli</li>
                    </ul>

                    <p style={{padding:'12px', background:'#f0f4f8', borderRadius:'6px', marginTop:'24px', fontStyle:'italic'}}>
                        Pour toute question concernant votre vie privée, contactez-nous à support@mediatech.local
                    </p>
                </div>
            </div>
        </main>
    );
}
