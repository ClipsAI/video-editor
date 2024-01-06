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

    // if (!transcript.word_infos.length) return <EmptyTranscription />;

    let currentWordStartChar = transcript.word_infos[currentWordIndex].start_char;
    if (midTranscript.startChar > currentWordStartChar) currentWordStartChar = midTranscript.startChar;

    let currentWordEndChar = transcript.word_infos[currentWordIndex].end_char;
    if (currentWordEndChar > midTranscript.endChar) currentWordEndChar = midTranscript.endChar;

    const preHighlighted = transcript.transcription.substring(midTranscript.startChar, currentWordStartChar);
    const highlightedWord = transcript.transcription.substring(currentWordStartChar, currentWordEndChar);
    const postHighlighted = transcript.transcription.substring(currentWordEndChar, midTranscript.endChar);


    return (
        <div className="p-4 sm:py-3 sm:px-6">
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <h1 className="text-xl font-bold mr-1">Transcription</h1>
                </div>
                <p className="pt-2">
                    <span className="text-gray-500">
                        {startTranscript.text}
                    </span>
                    <span className="font-semibold text-black">
                        {preHighlighted}
                    </span>
                    <span className="font-semibold text-black bg-blue-300">
                        {highlightedWord}
                    </span>
                    <span className="font-semibold text-black">
                        {postHighlighted}
                    </span>
                    <span className="text-gray-500">
                        {endTranscript.text}
                    </span>
                </p>
            </div>
        </div>
    );
}

function EmptyTranscription() {
    return (
        <div className="p-4 sm:py-3 sm:px-6">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">Transcription: </h1>
            </div>
        </div>
    );
}
