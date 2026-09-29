# Extrait du catalogue
_Note de l'équipe data_

- edu_program.csv : les formations (1200 lignes, export brut)
- edu_school.csv  : les écoles / campus

Le modèle "formation générique + variantes" est décrit dans **PRD-015**.

En résumé :
- une formation SANS parent_program_id = un programme GÉNÉRIQUE ("le produit").
- une formation AVEC parent_program_id = une VARIANTE rattachée à son générique
  (english track, italian track, alternance, campus, track "red team"...).
- la colonne "variants" (JSON) décrit ce qui distingue la variante (langue, apprentissage, track, campus...).
  Les clés/valeurs ne sont pas figées et n'ont pas toujours été saisies proprement.
- "long_title" est censé être abandonné (cf. PRD-015) : ne t'appuie pas dessus ! c'est un bug chez nous.

## Infos
Attention !! C'est un export brut : environ un quart des lignes sont des DOUBLONS (parfois avec des
libellés légèrement différents), et il reste des références cassées et des saisies incohérentes. Désolé :/ on te laisse le soin de nettoyer les données et de faire au mieux.
