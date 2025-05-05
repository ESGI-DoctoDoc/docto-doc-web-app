import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)

    function increment() {
        count.value++
        console.log("Incremented count:", count.value)
    }

    return { count, increment }
})