export function paginationRange(page: number, totalPages: number): (number | null)[] {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(n => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b)
  const range: (number | null)[] = []
  pages.forEach((n, i) => {
    const prev = pages[i - 1]
    if (prev !== undefined && n - prev === 2) range.push(prev + 1)
    else if (prev !== undefined && n - prev > 2) range.push(null)
    range.push(n)
  })
  return range
}
