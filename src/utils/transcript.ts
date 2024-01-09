/**
 * Returns the index of the word in the given array of Word
 * objects that corresponds to the specified time.
 * @param prevWordIndex - The index of the previous word in the array.
 * @param prevTime - The previous time.
 * @param time - The new time.
 * @param words - An array of Word objects.
 * @returns The index of the word in the array that corresponds to the specified time.
 */
export function getWordIndex(
    prevIndex: number,
    prevTime: number,
    time: number,
    words: Word[]
): number {
    let i = prevIndex;
    const incrementDirection = time < prevTime ? -1 : 1;

    while (i >= 0 && i < words.length) {
        const { start_time, end_time } = words[i];
        if (time >= start_time && time <= end_time) {
            return i;
        }
        i += incrementDirection;
    }

    return incrementDirection > 0 ? words.length - 1 : 0;
}
