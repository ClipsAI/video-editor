/**
 * Returns the index of the word in the array that contains the specified character.
 * If no word contains the character, it returns the
 * index of the word with the closest distance to the character.
 *
 * @param char - The character to search for.
 * @param words - An array of Word objects.
 * @returns The index of the word that contains the character
 *          or the index of the word with the closest distance.
 */
export function getWordIndexByChar(char: number, words: Word[]): number {
    if (words.length === 0) {
        return -1;
    }

    let low = 0;
    let high = words.length - 1;
    let closestIndex = 0;
    let closestDistance = Infinity;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const word = words[mid];
        const distance = Math.min(
            Math.abs(char - word.start_char),
            Math.abs(char - word.end_char)
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = mid;
        }

        if (char >= word.start_char && char <= word.end_char) {
            return mid;
        } else if (char < word.start_char) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return closestIndex;
}

/**
 * Returns the index of the word in the array that is closest to the specified time.
 * If the array is empty, -1 is returned.
 *
 * @param time - The time value to search for.
 * @param words - An array of Word objects.
 * @returns The index of the closest word or -1 if the array is empty.
 */
export function getWordIndexByTime(time: number, words: Word[]): number {
    if (words.length === 0) {
        return -1;
    }

    let low = 0;
    let high = words.length - 1;
    let closestIndex = 0;
    let closestDistance = Infinity;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const word = words[mid];
        const distance = Math.min(
            Math.abs(time - word.start_time),
            Math.abs(time - word.end_time)
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = mid;
        }

        if (time >= word.start_time && time <= word.end_time) {
            return mid;
        } else if (time < word.start_time) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return closestIndex;
}
