// Contexts
import { ResizerProvider } from '@/context/resizer'
import { TranscriptProvider } from '@/context/transcript'
import { TrimmerProvider } from '@/context/trimmer'
import { VideoProvider } from '@/context/video'

// React
import { ReactNode, Suspense } from 'react'


export function VideoEditorProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<></>}>
            <VideoProvider>
                <TranscriptProvider>
                    <ResizerProvider>
                        <TrimmerProvider>
                            {children}
                        </TrimmerProvider>
                    </ResizerProvider>
                </TranscriptProvider>
            </VideoProvider>
        </Suspense >
    )
}