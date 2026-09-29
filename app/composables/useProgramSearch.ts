import type { Ref } from 'vue'
import { countResults, emptyFilters, facetOptions, filterGroups } from '~/utils/match'
import { sortResults } from '~/utils/sort'
import { tokenize } from '~/utils/text'

export function useProgramSearch(groups: Ref<ProgramGroup[]>, favorites: Ref<Set<string>>) {
  const query = ref('')
  const debouncedQuery = ref('')
  const filters = ref<FilterState>(emptyFilters())
  const favoritesOnly = ref(false)
  const page = ref(1)
  const sort = ref<SortState>({ ...DEFAULT_SORT })

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(query, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => (debouncedQuery.value = value), SEARCH_DEBOUNCE_MS)
  })
  onBeforeUnmount(() => clearTimeout(timer))

  const context = (overrides: Partial<FilterState> = {}): MatchContext => ({
    tokens: tokenize(debouncedQuery.value),
    filters: { ...filters.value, ...overrides },
    favorites: favoritesOnly.value ? favorites.value : null,
  })

  const results = computed(() => sortResults(filterGroups(groups.value, context()), sort.value))
  const totalPages = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)))
  const pageItems = computed(() => results.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

  const activeFilterCount = computed(() => FILTER_KEYS.reduce((n, key) => n + filters.value[key].length, 0))
  const hasActiveCriteria = computed(() => activeFilterCount.value > 0 || favoritesOnly.value || !!debouncedQuery.value.trim())

  watch([debouncedQuery, filters, favoritesOnly, sort], () => (page.value = 1))
  watch(totalPages, (total) => {
    if (page.value > total) page.value = total
  })

  const optionsFor = (key: FilterKey) => facetOptions(groups.value, context(), key)
  const countWith = (key: FilterKey, draft: string[]) => countResults(groups.value, context({ [key]: draft }))

  function setFilter(key: FilterKey, values: string[]) {
    filters.value = { ...filters.value, [key]: values }
  }

  function resetAll() {
    filters.value = emptyFilters()
    favoritesOnly.value = false
    query.value = ''
    debouncedQuery.value = ''
  }

  return {
    query,
    filters,
    favoritesOnly,
    page,
    sort,
    results,
    pageItems,
    totalPages,
    activeFilterCount,
    hasActiveCriteria,
    optionsFor,
    countWith,
    setFilter,
    resetAll,
  }
}
