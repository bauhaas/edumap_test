<script setup lang="ts">
import { normalizeText, plural } from '~/utils/text'

const props = defineProps<{
  filterKey: FilterKey
  selected: string[]
  options: FilterOption[]
  resultCount: number
}>()
const open = defineModel<boolean>('open', { required: true })
const draft = defineModel<string[]>('draft', { required: true })
const emit = defineEmits<{ apply: [values: string[]] }>()

const search = ref('')

watch(open, (isOpen) => {
  if (!isOpen) return
  draft.value = [...props.selected]
  search.value = ''
}, { immediate: true })

const definition = computed(() => FILTER_DEFINITIONS[props.filterKey])
const visibleOptions = computed(() => {
  const tokens = tokenize(search.value)
  return props.options.filter(o => tokens.every(t => normalizeText(o.label).includes(t)))
})
function toggle(value: string, checked: boolean) {
  draft.value = checked ? [...draft.value, value] : draft.value.filter(v => v !== value)
}

function apply() {
  emit('apply', draft.value)
  open.value = false
}
</script>

<template>
  <BaseModal v-model:open="open" :title="definition.label" :icon="definition.icon">
    <div v-if="options.length > FILTER_SEARCH_THRESHOLD" class="relative mb-2 px-3 pt-1">
      <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-6 mt-0.5 size-4 -translate-y-1/2 text-icon-subtle-default" />
      <input
        v-model="search"
        type="search"
        placeholder="Rechercher…"
        class="h-10 w-full rounded-full bg-surface-light-accented pr-4 pl-9 text-sm outline-none focus:ring-1 focus:ring-border-light-active"
      >
    </div>

    <ul v-if="visibleOptions.length">
      <li v-for="option in visibleOptions" :key="option.value">
        <BaseCheckbox
          :model-value="draft.includes(option.value)"
          :label="option.label"
          :count="option.count"
          :disabled="option.count === 0"
          @update:model-value="toggle(option.value, $event)"
        />
      </li>
    </ul>
    <p v-else class="px-3 py-8 text-center text-sm text-tertiary">Aucune option ne correspond.</p>

    <template #footer>
      <BaseButton variant="ghost" :disabled="!draft.length" @click="draft = []">Réinitialiser</BaseButton>
      <BaseButton variant="primary" class="flex-1" :disabled="props.resultCount === 0" @click="apply">
        {{ props.resultCount === 0 ? 'Aucune formation' : `Afficher ${plural(props.resultCount, 'formation')}` }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
