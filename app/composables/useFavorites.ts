export function useFavorites() {
  const ids = useState<string[]>('favorites', () => [])
  const initialized = useState('favorites-initialized', () => false)

  function initialize() {
    if (initialized.value || !import.meta.client) return
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')
      if (Array.isArray(stored)) ids.value = stored.filter((id): id is string => typeof id === 'string')
    }
    catch {
      localStorage.removeItem(FAVORITES_STORAGE_KEY)
    }
    window.addEventListener('storage', onStorage)
    initialized.value = true
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== FAVORITES_STORAGE_KEY) return
    try {
      const stored = JSON.parse(event.newValue ?? '[]')
      ids.value = Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []
    }
    catch {
      ids.value = []
    }
  }

  const favorites = computed(() => new Set(ids.value))

  function persist() {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids.value))
    }
    catch {
      // Storage full or disabled: favourites stay in memory for this session.
    }
  }

  function toggle(id: string) {
    ids.value = favorites.value.has(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]
    persist()
  }

  const isFavorite = (id: string) => favorites.value.has(id)

  return { favorites, count: computed(() => ids.value.length), toggle, isFavorite, initialize }
}
