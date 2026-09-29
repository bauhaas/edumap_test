<script setup lang="ts">
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <CatalogueStateMessage
    tone="error"
    icon="lucide:cloud-off"
    title="Impossible de charger les formations"
    description="Une erreur est survenue lors du chargement du catalogue. Vérifiez votre connexion puis réessayez."
  >
    <BaseButton variant="primary" icon="lucide:refresh-cw" @click="emit('retry')">Réessayer</BaseButton>
  </CatalogueStateMessage>
</template>
