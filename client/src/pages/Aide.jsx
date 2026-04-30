export default function Aide() {
    return (
        <main className="main-container">
            <div className="hero" style={{padding:'24px 40px', marginBottom:'24px'}}>
                <h2>Aide & Support</h2>
            </div>

            <div className="card" style={{maxWidth:'900px', margin:'0 auto'}}>
                <div className="card-header"><h3>Questions Fréquemment Posées</h3></div>
                
                <div style={{fontSize:'0.9rem', lineHeight:'1.8'}}>
                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{color:'#1a3a5c', marginBottom:'8px'}}>Comment créer un compte ?</h4>
                        <p style={{color:'#4a5b6e'}}>Cliquez sur "Inscription" en haut à droite, remplissez le formulaire avec vos informations, puis validez. Vous aurez accès au compte immédiatement avec les droits de Débutant.</p>
                    </div>

                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{color:'#1a3a5c', marginBottom:'8px'}}>Comment augmenter mon niveau d'accès ?</h4>
                        <p style={{color:'#4a5b6e'}}>Gagnez des points en vous connectant régulièrement (+0.25 pts par connexion) et en consultant des objets (+0.50 pts par consultation). À partir de 30 points, vous accédez au niveau Avancé avec le Module Gestion. À partir de 60 points, vous devenez Expert avec accès à l'Administration.</p>
                    </div>

                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{color:'#1a3a5c', marginBottom:'8px'}}>Que puis-je faire avec le Module Gestion ?</h4>
                        <p style={{color:'#4a5b6e'}}>Le Module Gestion vous permet de créer, modifier et supprimer des objets. Vous pouvez également gérer les réservations de salles et accéder à l'historique détaillé de vos actions.</p>
                    </div>

                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{color:'#1a3a5c', marginBottom:'8px'}}>Qu'est-ce que le Module Administration ?</h4>
                        <p style={{color:'#4a5b6e'}}>Réservé aux Experts, ce module permet de gérer les utilisateurs, d'approuver ou refuser les modifications, de gérer les catégories et salles, et d'accéder à un audit complet du système.</p>
                    </div>

                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{color:'#1a3a5c', marginBottom:'8px'}}>Comment supprimer un objet ?</h4>
                        <p style={{color:'#4a5b6e'}}>En tant qu'Avancé ou Expert, vous pouvez demander la suppression d'un objet avec une justification. Les Experts doivent approuver les demandes. Les Experts peuvent également supprimer directement.</p>
                    </div>

                    <div style={{padding:'16px', background:'#f0f4f8', borderRadius:'8px', borderLeft:'4px solid #2c5a7a'}}>
                        <p style={{color:'#1a3a5c', fontWeight:'600', marginBottom:'8px'}}>🔒 Confidentialité</p>
                        <p style={{color:'#4a5b6e', fontSize:'0.85rem'}}>Vos données personnelles sont protégées et ne sont jamais partagées avec des tiers. Consultez notre Politique de confidentialité pour plus d'informations.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
