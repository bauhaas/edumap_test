<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'
import { plural } from '~/utils/text'

useHead({ title: 'Trouver une formation · Edumapper' })

const { groups, status, refresh } = useCatalogue()
const { favorites, count: favoritesCount } = useFavorites()
const search = useProgramSearch(groups, favorites)
const { query, filters, favoritesOnly, page, sort, results, pageItems, totalPages, hasActiveCriteria } = search
const view = ref<ViewMode>('cards')

const route = useRoute()
const router = useRouter()
let lastSyncedQuery = ''

function queryValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  return first ?? undefined
}

function applyRouteState() {
  query.value = queryValue(route.query.q) ?? ''
  favoritesOnly.value = queryValue(route.query.fav) === '1'

  const rawFilters = queryValue(route.query.filters)
  if (rawFilters) {
    try {
      const parsed = JSON.parse(rawFilters) as Partial<FilterState>
      filters.value = { ...emptyFilters(), ...parsed }
    } catch {
      filters.value = emptyFilters()
    }
  } else {
    filters.value = emptyFilters()
  }

  const routeSort = queryValue(route.query.sort) as SortKey | undefined
  const sortKey = routeSort && SORT_KEYS.includes(routeSort) ? routeSort : DEFAULT_SORT.key
  const direction = queryValue(route.query.dir) === 'desc' ? 'desc' : 'asc'
  sort.value = { key: sortKey, direction }
  view.value = queryValue(route.query.view) === 'table' ? 'table' : 'cards'
  const routePage = Number(queryValue(route.query.page))
  page.value = Number.isInteger(routePage) && routePage > 0 ? routePage : 1
}

function routeState() {
  const activeFilters = Object.fromEntries(
    FILTER_KEYS.filter(key => filters.value[key].length).map(key => [key, filters.value[key]]),
  )
  return {
    ...(query.value ? { q: query.value } : {}),
    ...(Object.keys(activeFilters).length ? { filters: JSON.stringify(activeFilters) } : {}),
    ...(favoritesOnly.value ? { fav: '1' } : {}),
    ...(sort.value.key !== DEFAULT_SORT.key ? { sort: sort.value.key } : {}),
    ...(sort.value.direction !== DEFAULT_SORT.direction ? { dir: sort.value.direction } : {}),
    ...(view.value !== 'cards' ? { view: view.value } : {}),
    ...(page.value > 1 ? { page: String(page.value) } : {}),
  }
}

applyRouteState()
function syncRoute() {
  const nextQuery = routeState()
  const signature = JSON.stringify(nextQuery)
  if (signature === lastSyncedQuery) return
  lastSyncedQuery = signature
  const location = router.resolve({ path: route.path, query: nextQuery })
  void router.replace(location)
  window.history.replaceState(window.history.state, '', location.href)
}

onMounted(() => {
  watchEffect(syncRoute)
  watch(() => route.fullPath, () => {
    if (JSON.stringify(routeState()) !== lastSyncedQuery) applyRouteState()
  })
})

const modalKey = ref<FilterKey>('diploma')
const modalOpen = ref(false)
const modalOptions = computed(() => search.optionsFor(modalKey.value))
const modalDraft = ref<string[]>([])
const modalResultCount = computed(() => search.countWith(modalKey.value, modalDraft.value))

function openFilter(key: FilterKey) {
  modalKey.value = key
  modalOpen.value = true
}

const { open: variantsOpen, result: variantsResult } = useVariantsModal()

const variantsCount = computed(() => results.value.reduce((n, r) => n + r.variants.length, 0))

const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
    <header>
      <img src="/logo-edumapper-dark.svg" alt="Edumapper" width="528" height="110" class="h-7 w-auto">
      <h1 class="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Trouver une formation</h1>
      <p class="mt-2 text-tertiary">
        Recherchez parmi les formations du catalogue par intitulé, ville, école ou parcours.
      </p>
    </header>

    <section class="mt-8 space-y-4" aria-label="Recherche">
      <CatalogueSearchBar v-model="query" />
      <CatalogueFilterBar
        v-model:favorites-only="favoritesOnly"
        :filters="filters"
        :favorites-count="favoritesCount"
        :has-active-criteria="hasActiveCriteria"
        @open="openFilter"
        @reset="search.resetAll"
      />
    </section>

    <section class="mt-8" aria-live="polite" aria-label="Résultats">
      <CatalogueLoadingState v-if="isLoading" :view="view" />
      <CatalogueErrorState v-else-if="status === 'error'" @retry="refresh()" />
      <CatalogueEmptyState
        v-else-if="results.length === 0"
        :filtered="hasActiveCriteria"
        :favorites-only="favoritesOnly"
        @reset="search.resetAll"
      />
      <div v-else class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="flex items-baseline gap-2 text-sm text-tertiary">
            <span>
              <span class="font-semibold text-primary">{{ plural(results.length, 'formation') }}</span>
            </span>
            <span class="text-xs">
              · <span class="tabular-nums">{{ plural(variantsCount, 'variante') }}</span>
            </span>
          </p>
          <div class="flex items-center gap-2">
            <CatalogueSortPicker v-model="sort" />
            <CatalogueViewToggle v-model="view" />
          </div>
        </div>
        <CatalogueResultsCards v-if="view === 'cards'" :results="pageItems" />
        <CatalogueResultsTable v-else :results="pageItems" />
        <CataloguePagination v-model="page" :total-pages="totalPages" />
      </div>
    </section>

    <CatalogueFilterModal
      v-model:open="modalOpen"
      v-model:draft="modalDraft"
      :filter-key="modalKey"
      :selected="filters[modalKey]"
      :options="modalOptions"
      :result-count="modalResultCount"
      @apply="search.setFilter(modalKey, $event)"
    />

    <CatalogueVariantsModal v-model:open="variantsOpen" :result="variantsResult" />
  </main>
</template>
