// React
import { ReactNode, createContext, useState } from 'react'

// Data
import { transcript as transcript_data } from '@/data/transcript'

// Third-party Libraries
import { useImmer, Updater } from 'use-immer'


type TranscriptContextType = {
    transcript: Transcript,
    setTranscript: Updater<Transcript>,
    currentWordIndex: number,
    setCurrentWordIndex: Dispatch<SetStateAction<number>>,
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
    const [transcript, setTranscript] = useImmer<Transcript>(transcript_data);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [startTranscript, setStartTranscript] = useImmer<ClipTranscript>({
        startChar: 0,
        endChar: 0,
        text: ""
    });
    const [midTranscript, setMidTranscript] = useImmer<ClipTranscript>({
        startChar: 0,
        endChar: 0,
        text: ""
    });
    const [endTranscript, setEndTranscript] = useImmer<ClipTranscript>({
        startChar: 0,
        endChar: 0,
        text: ""
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
