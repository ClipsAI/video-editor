// Lib
import { getClipTranscript } from '@/utils/transcript'


/**
 * Checks if the text matches the search query (case-insensitive).
 *
 * @param {string} text - The text to check for a match.
 * @param {string} searchQuery - The search query to match against.
 * @returns {boolean} - True if the text matches the search query, false otherwise.
 */
function isMatchingQuery(text: string, searchQuery: string): boolean {
    return text.toLowerCase().includes(searchQuery.toLowerCase());
}

/**
 * Checks if the clip duration is within the specified time bucket.
 *
 * @param {Clip} clip - The clip to check for duration.
 * @param {TimeBucket} timeBucket - The time range for filtering the clips by duration.
 * @returns {boolean} - True if the clip duration is within the time bucket, false otherwise.
 */
function isClipDurationInRange(clip: Clip, timeBucket: TimeBucket): boolean {
    const clipDuration: number = clip.end_time - clip.start_time;
    return clipDuration <= timeBucket.max && clipDuration > timeBucket.min;
}

/**
 * Filters clips based on the specified time bucket, search query, and transcript.
 *
 * @param {Clip[]} clips - The list of clips to filter.
 * @param {TimeBucket} timeBucket - The time range for filtering the clips by duration.
 * @param {string} searchQuery - The search query to filter clips by title or transcript.
 * @param {TranscriptInfo} transcript - The transcript information to extract clip transcripts.
 * @returns {Clip[]} - The filtered list of clips.
 */
export function getFilteredClips(
    clips: Clip[],
    timeBucket: TimeBucket,
    searchQuery: string = "",
    transcript: TranscriptInfo
): Clip[] {
    const searchQueryLowerCase: string = searchQuery.toLowerCase();

    const filteredClips: Clip[] = clips.filter((clip) => {
        if (clip.deleted || !isClipDurationInRange(clip, timeBucket)) return false;

        const clipTranscript: string = getClipTranscript(clip, transcript);
        return (
            isMatchingQuery(clipTranscript, searchQueryLowerCase) ||
            isMatchingQuery(clip.title, searchQueryLowerCase)
        );
    });

    // Sort favorited clips to the top
    filteredClips.sort((a, b) => {
        if (a.favorited === b.favorited) return 0;
        return a.favorited ? -1 : 1;
    });

    return filteredClips;
}


export function getStartCharIndexFromWordIndex(
    wordIndex: number,
    wordInfo: WordInfo[]
): number {
    return wordInfo[wordIndex].start_char;
}

export function getEndCharIndexFromWordIndex(
    wordIndex: number,
    wordInfo: WordInfo[]
): number {
    return wordInfo[wordIndex].start_char;
}

export function getWordIndexFromTime(
    prevWordIndex: number,
    prevTime: number,
    newTime: number,
    wordInfo: WordInfo[]
): number {
    if (newTime < prevTime) {
        for (let i = prevWordIndex; i > 0; i--) {
            if (wordInfo[i].end_time <= newTime) return i;
        }
        return 0;
    } else if (newTime > prevTime) {
        for (let i = prevWordIndex; i < wordInfo.length; i++) {
            if (wordInfo[i].start_time >= newTime) return i;
        }
        return wordInfo.length - 1;
    } else {
        return prevWordIndex;
    }
}