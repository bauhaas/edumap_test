export interface ProgramVariants {
  language?: string
  apprenticeship?: boolean
  track?: string
  school_id?: string
}

export interface RawProgram {
  program_id: string
  parent_program_id: string | null
  short_title: string
  title: string
  variants: ProgramVariants | null
  school_id: string
  diploma: string
  field: string
  city: string
  school_ref_valid: boolean
  merged_from: string[]
}

export interface RawSchool {
  school_id: string
  parent_school_id: string | null
  short_title: string
  title: string
  city: string
  merged_from: string[]
}

export interface CatalogueFile {
  stats: Record<string, number>
  schools: RawSchool[]
  programs: RawProgram[]
}

export type VariantAxis = 'language' | 'apprenticeship' | 'track' | 'campus'

export type Modality = 'apprenticeship' | 'initial'

export interface ProgramTag {
  axis: VariantAxis
  label: string
}

export interface Program {
  id: string
  parentId: string | null
  title: string
  shortTitle: string
  diploma: string
  field: string
  city: string
  schoolId: string
  schoolName: string
  brandId: string | null
  brandName: string
  schoolRefValid: boolean
  language: string
  languageLabel: string
  modality: Modality
  track: string | null
  trackLabel: string | null
  tags: ProgramTag[]
  searchText: string
}

export interface ProgramGroup {
  generic: Program
  variants: Program[]
}

export interface ProgramResult {
  group: ProgramGroup
  variants: Program[]
}

export interface Catalogue {
  groups: ProgramGroup[]
  programCount: number
}

export type FilterKey = 'diploma' | 'field' | 'city' | 'school' | 'language' | 'apprenticeship' | 'track'

export type FilterState = Record<FilterKey, string[]>

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface FilterDefinition {
  label: string
  icon: string
  getValue: (program: Program) => string | null
  getLabel: (program: Program) => string
  sortOptions: boolean
}

export interface MatchContext {
  tokens: string[]
  filters: FilterState
  favorites: Set<string> | null
}

export type ViewMode = 'cards' | 'table'

export type SortKey = 'field' | 'city' | 'variants' | 'diploma'

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: SortKey
  direction: SortDirection
}

export const CATALOGUE_URL = '/data/programs-cleaned.json'
export const PAGE_SIZE = 12
export const FAVORITES_STORAGE_KEY = 'edumapper:favorites'
export const SEARCH_DEBOUNCE_MS = 200
export const FILTER_SEARCH_THRESHOLD = 8

export const DEFAULT_LANGUAGE = 'fr'

export const LANGUAGE_LABELS: Record<string, string> = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  it: 'Italien',
}

export const APPRENTICESHIP_LABELS: Record<'apprenticeship' | 'initial', string> = {
  apprenticeship: 'Alternance',
  initial: 'Formation initiale',
}

export const AXIS_ICONS: Record<VariantAxis, string> = {
  language: 'lucide:languages',
  apprenticeship: 'lucide:briefcase',
  track: 'lucide:route',
  campus: 'lucide:map-pin',
}

export const FILTER_KEYS: FilterKey[] = ['diploma', 'field', 'city', 'school', 'language', 'apprenticeship', 'track']

export const FILTER_DEFINITIONS: Record<FilterKey, FilterDefinition> = {
  diploma: {
    label: 'Diplôme',
    icon: 'lucide:graduation-cap',
    getValue: p => p.diploma,
    getLabel: p => p.diploma,
    sortOptions: true,
  },
  field: {
    label: 'Domaine',
    icon: 'lucide:book-open',
    getValue: p => p.field,
    getLabel: p => p.field,
    sortOptions: true,
  },
  city: {
    label: 'Ville',
    icon: 'lucide:map-pin',
    getValue: p => p.city,
    getLabel: p => p.city,
    sortOptions: true,
  },
  school: {
    label: 'École',
    icon: 'lucide:school',
    getValue: p => p.brandId,
    getLabel: p => p.brandName,
    sortOptions: true,
  },
  language: {
    label: 'Langue',
    icon: 'lucide:languages',
    getValue: p => p.language,
    getLabel: p => p.languageLabel,
    sortOptions: true,
  },
  apprenticeship: {
    label: 'Modalité',
    icon: 'lucide:briefcase',
    getValue: p => p.modality,
    getLabel: p => APPRENTICESHIP_LABELS[p.modality],
    sortOptions: false,
  },
  track: {
    label: 'Parcours',
    icon: 'lucide:route',
    getValue: p => p.track,
    getLabel: p => p.trackLabel ?? '',
    sortOptions: true,
  },
}

export const VIEW_MODES: Record<ViewMode, { label: string, icon: string }> = {
  cards: { label: 'Cartes', icon: 'lucide:layout-grid' },
  table: { label: 'Tableau', icon: 'lucide:table-2' },
}

export const DEFAULT_SORT: SortState = { key: 'field', direction: 'asc' }

export const SORT_KEYS: SortKey[] = ['field', 'city', 'variants', 'diploma']

export const SORT_LABELS: Record<SortKey, string> = {
  field: 'Formation',
  city: 'Ville',
  variants: 'Nombre de variantes',
  diploma: 'Diplôme',
}

export const SORT_DIRECTIONS: Record<SortDirection, { label: string, icon: string }> = {
  asc: { label: 'Croissant', icon: 'lucide:arrow-up-narrow-wide' },
  desc: { label: 'Décroissant', icon: 'lucide:arrow-down-wide-narrow' },
}

export const FAVORITE_ICONS = { active: 'ph:star-fill', inactive: 'ph:star' } as const
