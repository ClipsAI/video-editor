// Hooks
import { useTranscript } from '@/hooks/transcript'


export function Transcription() {
    const {
        transcript,
        startTranscript,
        midTranscript,
        endTranscript,
        currentWordIndex
    } = useTranscript();


    let currentWordStartChar = transcript.words[currentWordIndex].start_char;
    if (midTranscript.startChar > currentWordStartChar) {
        currentWordStartChar = midTranscript.startChar;
    }

    let currentWordEndChar = transcript.words[currentWordIndex].end_char;
    if (currentWordEndChar > midTranscript.endChar) {
        currentWordEndChar = midTranscript.endChar;
    }

    const preHighlighted = transcript.transcription.substring(
        midTranscript.startChar,
        currentWordStartChar
    );
    const highlightedWord = transcript.transcription.substring(
        currentWordStartChar,
        currentWordEndChar
    );
    const postHighlighted = transcript.transcription.substring(
        currentWordEndChar,
        midTranscript.endChar
    );


    return (
        <div className="p-4 sm:py-3 sm:px-6">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mr-1">
                    Transcription
                </h1>
                <p className="pt-2">
                    <span className="font-light text-gray-400 dark:text-gray-300">
                        {startTranscript.text}
                    </span>
                    <span className="font-medium">
                        {preHighlighted}
                    </span>
                    <span className="font-medium bg-blue-300 dark:bg-blue-600">
                        {highlightedWord}
                    </span>
                    <span className="font-medium">
                        {postHighlighted}
                    </span>
                    <span className="font-light text-gray-400 dark:text-gray-300">
                        {endTranscript.text}
                    </span>
                </p>
            </div>
        </div>
    );
}
