// React
import { useContext } from 'react'

// Context
import { TranscriptContext } from '@/context/transcript'

// Utils
import { getNewCharIndex, getWordIndex } from '@/utils/transcript'


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
        if (!transcript.word_infos.length) return;

        const startChar = getNewCharIndex(
            clip.start_char,
            clip.start_time,
            startTime,
            transcript.charInfo,
            "start"
        );
        const endChar = getNewCharIndex(
            clip.end_char,
            clip.end_time,
            endTime,
            transcript.charInfo,
            "end"
        );

        const midStartChar = getNewCharIndex(
            startChar,
            startTime,
            trimStartTime,
            transcript.charInfo,
            "start"
        );
        const midEndChar = getNewCharIndex(
            endChar,
            endTime,
            trimEndTime,
            transcript.charInfo, 
            "end"
        );

        setTranscriptState(startChar, midStartChar, midEndChar, endChar);
    }

    const setTranscriptState = (
        startChar: number,
        midStartChar: number,
        midEndChar: number,
        endChar: number
    ) => {
        if (!transcript.word_infos.length) return;

        const transcription = transcript.transcription;

        setStartTranscript((draft: ClipTranscript) => {
            draft.startChar = startChar;
            draft.endChar = midStartChar;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
        setMidTranscript((draft: ClipTranscript) => {
            draft.startChar = midStartChar;
            draft.endChar = midEndChar;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
        setEndTranscript((draft: ClipTranscript) => {
            draft.startChar = midEndChar;
            draft.endChar = endChar;
            draft.text = transcription.substring(draft.startChar, draft.endChar);
        });
    }

    const initTranscript = (startChar: number, endChar: number) => {
        if (transcript.charInfo.length !== 0) {
            const wordIndex = transcript.charInfo[startChar].wordIdx;
            setCurrentWordIndex(wordIndex);
            setTranscriptState(startChar, startChar, endChar, endChar);
        }
    };

    const updateCurrentWord = (
        startChar: number,
        startTime: number,
        currentTime: number
    ) => {
        const wordIndex = getWordIndex(
            startChar,
            startTime,
            currentTime,
            transcript.word_infos
        );
        setCurrentWordIndex(wordIndex);
    }

    return {
        transcript, setTranscript,
        currentWordIndex, setCurrentWordIndex,
        startTranscript, setStartTranscript,
        midTranscript, setMidTranscript,
        endTranscript, setEndTranscript,
        initTranscript,
        updateTranscript,
        setTranscriptState,
        updateCurrentWord
    }
}