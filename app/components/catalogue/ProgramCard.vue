<script setup lang="ts">
const props = defineProps<{ result: ProgramResult }>()
const { show: showVariants } = useVariantsModal()
const generic = computed(() => props.result.group.generic)
</script>

<template>
  <article class="flex flex-col rounded-md border border-border-light-default bg-surface-light p-5 shadow-xs transition duration-200 ease-in-quad hover:shadow-s">
    <div class="flex items-start gap-3">
      <div class="min-w-0 flex-1">
        <CatalogueDiplomaBadge :diploma="generic.diploma" />
        <h3 class="mt-3 text-lg leading-snug font-semibold">{{ generic.field }}</h3>
      </div>
      <CatalogueFavoriteButton :program-id="generic.id" />
    </div>

    <dl class="mt-4 space-y-1.5 text-sm text-secondary">
      <div class="flex items-center gap-2">
        <dt class="sr-only">École</dt>
        <Icon name="lucide:school" class="size-4 text-icon-subtle-default" />
        <dd class="truncate">{{ generic.schoolName }}</dd>
      </div>
      <div class="flex items-center gap-2">
        <dt class="sr-only">Ville</dt>
        <Icon name="lucide:map-pin" class="size-4 text-icon-subtle-default" />
        <dd>{{ generic.city }}</dd>
      </div>
    </dl>

    <CatalogueProgramTags v-if="generic.tags.length" :tags="generic.tags" class="mt-3" />

    <div class="mt-auto pt-5">
      <CatalogueVariantToggle
        v-if="result.group.variants.length"
        :shown="result.variants.length"
        :total="result.group.variants.length"
        @open="showVariants(result)"
      />
      <p v-else class="text-xs text-tertiary">Aucune variante</p>
    </div>
  </article>
</template>
