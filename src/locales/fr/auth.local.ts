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
            password_mismatch: "Les mots de passe ne correspondent pas.",
            server_error: "Une erreur est survenue. Veuillez réessayer plus tard."
        },
        account_exist: "Vous avez déjà un compte ?",
        login_link: "Se connecter",
        terms_prefix: "En vous inscrivant, vous acceptez nos",
    },
    logout: {
        button: "Se déconnecter",
        success: {
            title: "Déconnexion réussie",
            message: "Vous êtes maintenant déconnecté."
        }
    },
    otp: {
        title: "Vérification du numéro de téléphone",
        description: "Nous vous avons envoyé un SMS avec un code de vérification.",
        button: "Vérifier le code",
        success: {
            title: "Vérification du numéro de téléphone réussie",
            message: "Votre numéro de téléphone à été vérifié avec succès."
        },
    }
}
