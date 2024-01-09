/**
 * Checks if the text matches the search query (case-insensitive).
 *
 * @param text - The text to check for a match.
 * @param query - The search query to match against.
 * @returns - True if the text matches the search query, false otherwise.
 */
function isMatchingQuery(text: string, query: string): boolean {
    return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Checks if the clip duration is within the specified time bucket.
 *
 * @param clip - The clip to check for duration.
 * @param interval - The time range for filtering the clips by duration.
 * @returns - True if the clip duration is within the time bucket, false otherwise.
 */
function isClipDurationInRange(clip: Clip, interval: Interval): boolean {
    const clipDuration: number = clip.end_time - clip.start_time;
    return clipDuration <= interval.max && clipDuration > interval.min;
}

/**
 * Filters clips based on the specified time bucket, search query, and transcript.
 *
 * @param clips - The list of clips to filter.
 * @param interval - The time range for filtering the clips by duration.
 * @param query - The search query to filter clips by title or transcript.
 * @param transcript - The transcript information to extract clip transcripts.
 * @returns - The filtered list of clips.
 */
export function getFilteredClips(
    clips: Clip[],
    interval: Interval,
    query: string,
    transcript: Transcript
): Clip[] {
    const filteredClips: Clip[] = clips.filter((clip) => {
        if (clip.deleted || !isClipDurationInRange(clip, interval)) {
            return false;
        }

        const clipTranscript = transcript.transcription.substring(
            clip.start_char,
            clip.end_char
        );
        
        return (
            isMatchingQuery(clipTranscript, query.toLowerCase()) ||
            isMatchingQuery(clip.title, query.toLowerCase())
        );
    });

    filteredClips.sort((a, b) => {
        if (a.favorited === b.favorited) return 0;
        return a.favorited ? -1 : 1;
    });

    return filteredClips;
}
