export function useVariantsModal() {
  const open = useState('variants-modal-open', () => false)
  const result = useState<ProgramResult | null>('variants-modal-result', () => null)

  function show(nextResult: ProgramResult) {
    result.value = nextResult
    open.value = true
  }

  return { open, result, show }
}
