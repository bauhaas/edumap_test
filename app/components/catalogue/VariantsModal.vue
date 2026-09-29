<script setup lang="ts">
import { plural } from '~/utils/text'

const props = defineProps<{ result: ProgramResult | null }>()
const open = defineModel<boolean>('open', { required: true })

const generic = computed(() => props.result?.group.generic)
const shown = computed(() => props.result?.variants.length ?? 0)
const total = computed(() => props.result?.group.variants.length ?? 0)
</script>

<template>
  <BaseModal
    v-model:open="open"
    wide
    icon="lucide:layers"
    :title="generic ? `${generic.diploma} · ${generic.field}` : ''"
    :description="generic ? `${generic.schoolName} · ${generic.city}` : undefined"
  >
    <div v-if="result" class="px-3 py-2">
      <p class="mb-4 text-sm text-tertiary">
        <template v-if="shown === total">
          <span class="font-semibold text-primary tabular-nums">{{ total }}</span>
          {{ plural(total, 'variante') }} de cette formation
        </template>
        <template v-else>
          <span class="font-semibold text-primary tabular-nums">{{ shown }}</span>
          sur {{ total }} variantes correspondent à vos critères
        </template>
      </p>
      <CatalogueVariantList :variants="result.variants" />
    </div>
  </BaseModal>
</template>
