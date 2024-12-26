// icsParser parses standard .ics to { [key: string]: string }
export const toJson = (ics) => {
    return ical2json.convert(ics)
}