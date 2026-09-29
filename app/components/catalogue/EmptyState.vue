<script setup lang="ts">
defineProps<{ filtered: boolean, favoritesOnly: boolean }>()
const emit = defineEmits<{ reset: [] }>()
</script>

<template>
  <CatalogueStateMessage
    v-if="!filtered"
    icon="lucide:inbox"
    title="Aucune formation disponible"
    description="Le catalogue est vide pour le moment. Revenez un peu plus tard."
  />
  <CatalogueStateMessage
    v-else-if="favoritesOnly"
    :icon="FAVORITE_ICONS.inactive"
    title="Aucun favori ici"
    description="Ajoutez des formations à vos favoris avec l’étoile, ou élargissez vos critères."
  >
    <BaseButton variant="primary" icon="lucide:rotate-ccw" @click="emit('reset')">Réinitialiser les critères</BaseButton>
  </CatalogueStateMessage>
  <CatalogueStateMessage
    v-else
    icon="lucide:search-x"
    title="Aucune formation trouvée"
    description="Essayez d’autres mots-clés ou retirez quelques filtres pour élargir la recherche."
  >
    <BaseButton variant="primary" icon="lucide:rotate-ccw" @click="emit('reset')">Réinitialiser les critères</BaseButton>
  </CatalogueStateMessage>
</template>
