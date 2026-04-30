export default function Mentions() {
    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Mentions Légales</h2>
            </div>

            <div className="card" style={{maxWidth:'900px', margin:'0 auto'}}>
                <div style={{fontSize:'0.9rem', lineHeight:'1.8', color:'#4a5b6e'}}>
                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>1. Éditeur du Site</h3>
                    <p style={{marginBottom:'24px'}}>
                        Mediatech<br />
                        Centre de Ressources Numériques<br />
                        Adresse postale : 33 Rue de la paix<br />
                        Email : contact@mediatech.local
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>2. Directeur de la Publication</h3>
                    <p style={{marginBottom:'24px'}}>
                        Le directeur de la publication est l'administrateur responsable de Mediatech.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>3. Hébergement</h3>
                    <p style={{marginBottom:'24px'}}>
                        Ce site est hébergé sur les serveurs de OVH. Pour toute question technique, veuillez contacter le support.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>4. Propriété Intellectuelle</h3>
                    <p style={{marginBottom:'24px'}}>
                        L'ensemble du contenu de ce site (textes, images, logo) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>5. Responsabilité</h3>
                    <p style={{marginBottom:'24px'}}>
                        Mediatech ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site. L'utilisateur assume l'entière responsabilité de l'utilisation des données et services fournis.
                    </p>

                    <h3 style={{color:'#1a3a5c', marginBottom:'16px'}}>6. CNIL et Conformité</h3>
                    <p style={{marginBottom:'24px'}}>
                        En conformité avec la loi Informatique et Libertés du 6 janvier 1978, vous disposez d'un droit d'accès, de modification et de suppression de vos données. Pour exercer ce droit, contactez-nous.
                    </p>

                    <p style={{padding:'12px', background:'#f0f4f8', borderRadius:'6px', marginTop:'24px', fontStyle:'italic'}}>
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>
        </main>
    );
}
