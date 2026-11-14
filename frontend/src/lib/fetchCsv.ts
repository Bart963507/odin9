import Papa from 'papaparse'

export async function fetchCsv<T>(
  url: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<T[]> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSV: ${response.status} ${response.statusText}`,
    )
  }

  const csv = await response.text()

  return Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  }).data
}
