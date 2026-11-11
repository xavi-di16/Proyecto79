// src/utils/normalizer.ts
export function normalizeOutput(raw: string | null | undefined): string {
    if (!raw) return '';
    return String(raw)
        .replace(/\r\n/g, '\n')
        .trim()
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*,\s*/g, ',')
        .replace(/\[\s+/g, '[')
        .replace(/\s+\]/g, ']');
}

export function compareByApproximation(
    actualRaw: string | null | undefined,
    expectedRaw: string | null | undefined,
    tolerance = 0.01
): boolean {
    const actual = normalizeOutput(actualRaw);
    const expected = normalizeOutput(expectedRaw);

    if (actual === expected) {
        return true;
    }

    const numRegex = /^[+-]?\d+(\.\d+)?$/;
    if (numRegex.test(actual) && numRegex.test(expected)) {
        const actualNum = Number(actual);
        const expectedNum = Number(expected);
        return Math.abs(actualNum - expectedNum) <= tolerance;
    }

    return false;
}