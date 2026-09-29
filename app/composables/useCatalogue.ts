export function useCatalogue() {
  const { data, status, error, refresh } = useFetch<CatalogueFile, unknown, string, 'get', CatalogueFile, Catalogue>(CATALOGUE_URL, {
    key: 'catalogue',
    transform: buildCatalogue,
    server: false,
    lazy: true,
  })

  const groups = computed(() => data.value?.groups ?? [])

  return { groups, status, error, refresh }
}
