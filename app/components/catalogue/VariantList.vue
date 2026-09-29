<script setup lang="ts">
defineProps<{ variants: Program[] }>()
</script>

<template>
  <ul class="divide-y divide-border-light-default">
    <li v-for="variant in variants" :key="variant.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div class="min-w-0 flex-1 space-y-1.5">
        <CatalogueProgramTags :tags="variant.tags" />
        <p class="flex items-center gap-1 text-xs text-tertiary">
          <Icon name="lucide:map-pin" class="size-3" />
          {{ variant.schoolName }} · {{ variant.city }}
          <span v-if="!variant.schoolRefValid" class="ml-1 rounded-full bg-warning-surface px-2 py-0.5 font-medium text-warning-subtle">
            École non vérifiée
          </span>
        </p>
      </div>
      <CatalogueFavoriteButton :program-id="variant.id" size="sm" />
    </li>
  </ul>
</template>
