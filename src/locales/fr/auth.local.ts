export default {
    login: {
        title: "Connexion",
        description: "Connectez-vous à votre compte.",
        button: "Se connecter",
        success: {
            title: "Connexion réussie",
            message: "Vous êtes maintenant connecté."
        },
        error: {
            invalid_credentials: "Email ou mot de passe incorrect.",
            server_error: "Une erreur est survenue. Veuillez réessayer plus tard."
        },
        no_account: "Vous n'avez pas de compte ?",
        register_link: "Inscrivez-vous",
        terms_prefix: "En vous connectant, vous acceptez nos",
        terms: "Conditions d'utilisation",
        and: "et notre",
        privacy: "Politique de confidentialité"
    },
    register: {
        title: "Inscription",
        description: "Créez un nouveau compte.",
        button: "S'inscrire",
        success: {
            title: "Inscription réussie",
            message: "Votre compte a été créé avec succès."
        },
        error: {
            email_taken: "Cet email est déjà utilisé.",
            password_mismatch: "Les mots de passe ne correspondent pas."
        }
    },
    logout: {
        button: "Se déconnecter",
        success: {
            title: "Déconnexion réussie",
            message: "Vous êtes maintenant déconnecté."
        }
    },
}
