export const parseUTCDate = (utcString: string): string => {
  const date = new Date(utcString)

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo', // GMT-3
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]))

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`
}
