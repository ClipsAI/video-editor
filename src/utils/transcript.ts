
export function getWordIndexFromTime(
    prevWordIndex: number,
    prevTime: number,
    newTime: number,
    wordInfo: WordInfo[]
): number {
    if (newTime < prevTime) {
        for (let i = prevWordIndex; i > 0; i--) {
            const startTime = wordInfo[i].start_time;
            const endTime = wordInfo[i].end_time;
            const withinWord = newTime >= startTime && newTime <= endTime;
            if (withinWord) return i;
        }
        return 0;
    } else if (newTime > prevTime) {
        for (let i = prevWordIndex; i < wordInfo.length; i++) {
            const startTime = wordInfo[i].start_time;
            const endTime = wordInfo[i].end_time;
            const withinWord = newTime >= startTime && newTime <= endTime;
            if (withinWord) return i;
        }
        return wordInfo.length - 1;
    } else {
        return prevWordIndex;
    }
}

export function getWordIndex(
    prevWordIndex: number,
    prevTime: number,
    newTime: number,
    wordInfos: WordInfo[]
): number {
    let i = prevWordIndex;
    const incrementDirection = newTime < prevTime ? -1 : 1;

    while (i >= 0 && i < wordInfos.length) {
        const { start_time, end_time } = wordInfos[i];
        if (newTime >= start_time && newTime <= end_time) {
            return i;
        }
        i += incrementDirection;
    }

    return incrementDirection > 0 ? wordInfos.length - 1 : 0;
}



export function getClipTranscript(clip: Clip, transcript: Transcript): string {
    return transcript.transcription.substring(clip.start_char, clip.end_char);
}

/**
 * Get a new character index based on the new time provided.
 *
 * @param {number} prevCharIndex - The previous character index.
 * @param {number} prevTime - The previous time.
 * @param {number} newTime - The new time.
 * @param {CharInfo[]} charInfo - An array of CharInfo objects containing character information.
 * @param {"start" | "end"} mode - Specifies whether to find the start or end character index.
 * @return {number} The new character index.
 */
export function getNewCharIndex(
    prevCharIndex: number,
    prevTime: number,
    newTime: number,
    charInfo: CharInfo[],
    mode: "start" | "end"
): number {
    if (newTime === prevTime) return prevCharIndex;

    const direction = newTime < prevTime ? -1 : 1;
    let currentIndex = prevCharIndex;

    while (currentIndex >= 0 && currentIndex < charInfo.length) {
        if (mode === "start") {
            if (direction === -1 && charInfo[currentIndex].endTime && newTime >= charInfo[currentIndex].endTime) {
                return currentIndex;
            } else if (direction === 1 && charInfo[currentIndex].startTime && newTime <= charInfo[currentIndex].startTime) {
                return currentIndex;
            }
        } else if (mode === "end") {
            if (direction === -1 && charInfo[currentIndex].endTime && newTime > charInfo[currentIndex].startTime) {
                return currentIndex;
            } else if (direction === 1 && charInfo[currentIndex].startTime && newTime < charInfo[currentIndex].endTime) {
                return currentIndex;
            }
        }

        currentIndex += direction;
    }

    return direction === -1 ? 0 : charInfo.length - 1;
}


export function isCharInfoValid(transcript: TranscriptInfo, clip: Clip): boolean {
    if (!transcript.charInfo ||
        !clip.start_char ||
        clip.start_char >= transcript.charInfo.length ||
        !transcript.charInfo[clip.start_char].wordIdx) {
        return false;
    }
    return true;
}
