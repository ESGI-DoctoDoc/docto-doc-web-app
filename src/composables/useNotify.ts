import {useTranslate} from "~/composables/useTranslate";

type NotifyOptions = {
    title: string
    description?: string
    color?: 'success' | 'error' | 'info' | 'warning'
    icon?: string
    duration?: number
}

export const useNotify = () => {
    const toast = useToast()
    const {translate} = useTranslate()

    const show = (options: NotifyOptions) => {
        toast.add({
            title: options.title,
            description: options.description,
            icon: options.icon,
            color: options.color,
            duration: options.duration ?? 5000,
        })
    }

    const showSuccess = (title: string, description?: string) => {
        show({
            title,
            description,
            color: 'success',
            icon: 'i-heroicons-check-circle'
        })
    }

    const showError = (title: string, description?: string) => {
        show({
            title,
            description: description ? translate(description) : undefined,
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
    }

    const handleError = (message: string, error: unknown) => {
        if (error instanceof Error) {
            showError(message, error.message);
        } else {
            showError(message);
        }
    }

    return {
        show,
        showSuccess,
        showError,
        handleError
    }
}