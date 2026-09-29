<script setup lang="ts">
const props = defineProps<{ programId: string, size?: 'sm' | 'md' }>()
const { isFavorite, toggle } = useFavorites()
const active = computed(() => isFavorite(props.programId))
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    :aria-label="active ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    class="flex shrink-0 items-center justify-center rounded-full transition duration-200 ease-in-quad active:scale-90"
    :class="[
      size === 'sm' ? 'size-8' : 'size-10',
      active ? 'text-warning-bold hover:bg-warning-surface' : 'text-icon-subtle-default hover:bg-actions-secondary',
    ]"
    @click.stop="toggle(programId)"
  >
    <Icon
      :name="active ? FAVORITE_ICONS.active : FAVORITE_ICONS.inactive"
      :class="size === 'sm' ? 'size-4' : 'size-5'"
    />
  </button>
</template>
