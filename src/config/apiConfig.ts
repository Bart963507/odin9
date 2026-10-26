const SHEET_BASE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8VCJuDwVv_npRVDvUTVK-GFhFz9-K13lIbvH0MaMh-0AqxLiITt7nJ2T8-DEXlcCHgSek9dtHHAYn/pub'

function sheetCsvUrl(gid: number): string {
  return `${SHEET_BASE_URL}?gid=${gid}&single=true&output=csv`
}

export const apiConfig = {
  players: sheetCsvUrl(0),
  stats: sheetCsvUrl(462371454),
  events: sheetCsvUrl(437798517),
} as const
