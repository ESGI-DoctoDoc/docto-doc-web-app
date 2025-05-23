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
    },
    reset_password: {
        request: {
            title: "Mot de passe oublié",
            description: "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.",
            button: "Envoyer le lien de réinitialisation",
            success: {
                title: "Email envoyé",
                message: "L'email contenant le lien de réinitialisation a été envoyé avec succès."
            },
            error: {
                email_not_found: "Aucun compte trouvé avec cette adresse e-mail.",
                server_error: "Une erreur est survenue. Veuillez réessayer plus tard."
            },
            account_exist: "Vous avez un compte ?",
            login_link: "Connectez-vous",
        },
        update: {
            title: "Réinitialiser le mot de passe",
            description: "Choisissez un nouveau mot de passe pour votre compte.",
            button: "Mettre à jour le mot de passe",
            new_password: "Nouveau mot de passe",
            confirm_password: "Confirmer le mot de passe",
            login_link: "Retour à la connexion",
            success: {
                title: "Mot de passe changé",
                message: "Votre mot de passe a été mis à jour avec succès."
            },
            error: {
                title: "Erreur",
                message: "Une erreur est survenue lors de la réinitialisation du mot de passe.",
                server_error: "Impossible de mettre à jour le mot de passe.",
                invalid_token: "Le lien est invalide ou expiré."
            }
        }
    },
}
