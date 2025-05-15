import type { User } from "~/types/user"

export const useSession = () => {
    const user = useState<User | null>('user', () => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const token = useState<string>('token', () => {
        return localStorage.getItem('token') || ''
    })

    const isAuthenticated = computed(() => !!token.value)

    const removeUser = () => {
        user.value = null
        token.value = ''
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    watch(token, (newToken) => {
        if (newToken) localStorage.setItem('token', newToken)
    })

    watch(user, (newUser) => {
        if (newUser) localStorage.setItem('user', JSON.stringify(newUser))
    })

    return { user, token, isAuthenticated, logout: removeUser }
}