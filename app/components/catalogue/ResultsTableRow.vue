<script setup lang="ts">
const props = defineProps<{ result: ProgramResult }>()
const { show: showVariants } = useVariantsModal()
const generic = computed(() => props.result.group.generic)
</script>

<template>
    <tr class="border-b border-border-light-default transition last:border-b-0 hover:bg-surface-light-accented/60">
      <td class="px-5 py-4 align-top">
        <CatalogueDiplomaBadge :diploma="generic.diploma" />
      </td>
      <td class="px-5 py-4">
        <span class="font-semibold">{{ generic.field }}</span>
        <CatalogueProgramTags v-if="generic.tags.length" :tags="generic.tags" class="mt-2" />
      </td>
      <td class="px-5 py-4 text-secondary">{{ generic.schoolName }}</td>
      <td class="px-5 py-4 text-secondary">{{ generic.city }}</td>
      <td class="px-5 py-4">
        <CatalogueVariantToggle
          v-if="result.group.variants.length"
          :shown="result.variants.length"
          :total="result.group.variants.length"
          @open="showVariants(result)"
        />
        <span v-else class="text-xs text-tertiary">—</span>
      </td>
      <td class="px-3 py-4">
        <CatalogueFavoriteButton :program-id="generic.id" size="sm" />
      </td>
    </tr>
</template>
