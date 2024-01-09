// Context
import { TranscriptContext } from '@/context/transcript'

// React
import { useContext } from 'react'

// Utils
import { getWordIndex } from '@/utils/transcript'


export function useTranscript() {
    const {
        transcript, setTranscript,
        currentWordIndex, setCurrentWordIndex,
        startTranscript, setStartTranscript,
        midTranscript, setMidTranscript,
        endTranscript, setEndTranscript
    } = useContext(TranscriptContext);

    const updateTranscript = (
        clip: Clip,
        startTime: number,
        endTime: number,
        trimStartTime: number,
        trimEndTime: number
    ) => {
        if (!transcript.words.length) return;

        let index = getWordIndex(
            currentWordIndex,
            clip.start_time,
            startTime,
            transcript.words
        );
        const startWord = transcript.words[index];

        index = getWordIndex(
            currentWordIndex,
            clip.end_time,
            endTime,
            transcript.words
        );
        const endWord = transcript.words[index];

        index = getWordIndex(
            currentWordIndex,
            startTime,
            trimStartTime,
            transcript.words
        );
        const midStartWord = transcript.words[index];

        index = getWordIndex(
            currentWordIndex,
            endTime,
            trimEndTime,
            transcript.words
        );
        const midEndWord = transcript.words[index];

        setTranscriptState(
            startWord.start_char,
            midStartWord.start_char,
            midEndWord.end_char,
            endWord.end_char
        );
    }

    const setTranscriptState = (
        start: number,
        midStart: number,
        midEnd: number,
        end: number
    ) => {
        const transcription = transcript.transcription;
        setStartTranscript((draft: ClipTranscript) => {
            draft.startChar = start;
            draft.endChar = midStart;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
        setMidTranscript((draft: ClipTranscript) => {
            draft.startChar = midStart;
            draft.endChar = midEnd;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
        setEndTranscript((draft: ClipTranscript) => {
            draft.startChar = midEnd;
            draft.endChar = end;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
    }

    const updateCurrentWord = (startTime: number, currentTime: number) => {
        const wordIndex = getWordIndex(
            currentWordIndex,
            startTime,
            currentTime,
            transcript.words
        );
        setCurrentWordIndex(wordIndex);
    }

    return {
        transcript, setTranscript,
        currentWordIndex, setCurrentWordIndex,
        startTranscript, setStartTranscript,
        midTranscript, setMidTranscript,
        endTranscript, setEndTranscript,
        updateTranscript,
        setTranscriptState,
        updateCurrentWord
    }
}
