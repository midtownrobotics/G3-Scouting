/**
 * Turns a string into a string that can be used for SQL column and table names.
 * @param str The string to convert.
 * @returns The converted string.
 */
export function toSqlAcceptableString(str: string) {
    return str
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .replace(/^(\d)/, '_$1')
}

export function removeDuplicatesByKey<T>(array: T[], key: keyof T) {
    const seen = new Set();
    return array.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}