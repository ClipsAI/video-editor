// React
import { ReactNode, createContext, useState } from 'react'

// Data
import { transcript as transcript_data } from '@/data/transcript'

// Hooks
import { useVideoContext } from '@/hooks/video'

// Utils
import { getWordIndexByChar } from '@/utils/transcript'

// Third-party Libraries
import { useImmer, Updater } from 'use-immer'


type TranscriptContextType = {
    transcript: Transcript,
    setTranscript: Updater<Transcript>,
    currentWordIndex: number,
    setCurrentWordIndex: SetState<number>,
    startTranscript: ClipTranscript,
    setStartTranscript: Updater<ClipTranscript>,
    midTranscript: ClipTranscript,
    setMidTranscript: Updater<ClipTranscript>,
    endTranscript: ClipTranscript,
    setEndTranscript: Updater<ClipTranscript>,
}

export const TranscriptContext = createContext<TranscriptContextType>({
    transcript: transcript_data,
    setTranscript: async () => undefined,
    currentWordIndex: 0,
    setCurrentWordIndex: () => { },
    startTranscript: { startChar: 0, endChar: 0, text: "" },
    setStartTranscript: () => { },
    midTranscript: { startChar: 0, endChar: 0, text: "" },
    setMidTranscript: () => { },
    endTranscript: { startChar: 0, endChar: 0, text: "" },
    setEndTranscript: () => { },
});

export function TranscriptProvider({ children }: { children: ReactNode }) {
    const { clip } = useVideoContext();

    const [transcript, setTranscript] = useImmer<Transcript>(transcript_data);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(
        getWordIndexByChar(clip.start_char, transcript.words)
    );
    const [startTranscript, setStartTranscript] = useImmer<ClipTranscript>({
        startChar: clip.start_char,
        endChar: clip.start_char,
        text: transcript_data.transcription.substring(clip.start_char, clip.start_char)
    });
    const [midTranscript, setMidTranscript] = useImmer<ClipTranscript>({
        startChar: clip.start_char,
        endChar: clip.end_char,
        text: transcript_data.transcription.substring(clip.start_char, clip.end_char)
    });
    const [endTranscript, setEndTranscript] = useImmer<ClipTranscript>({
        startChar: clip.end_char,
        endChar: clip.end_char,
        text: transcript_data.transcription.substring(clip.end_char, clip.end_char)
    });

    const transcriptContext = {
        transcript, setTranscript,
        currentWordIndex, setCurrentWordIndex,
        startTranscript, setStartTranscript,
        midTranscript, setMidTranscript,
        endTranscript, setEndTranscript,
    };

    return (
        <TranscriptContext.Provider value={transcriptContext}>
            {children}
        </TranscriptContext.Provider>
    )
}
