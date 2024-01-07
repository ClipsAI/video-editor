'use client'

// Components
import { Header } from '@/components/Header'
import { ClipEditor } from '@/components/Clips'
import { Transcription } from '@/components/Transcription'

// Contexts
import { VideoEditorProvider } from '@/context/editor'

// Data
import { intervals } from '@/data/clips'

// React
import { useState } from 'react'


export default function Editor() {
    const [interval, setInterval] = useState<Interval>(intervals[0]);

    return (
        <VideoEditorProvider>
            <div className="rounded-lg border border-gray-300 bg-white">
                <Header setInterval={setInterval}/>
                <ClipEditor interval={interval}/>
                <Transcription />
            </div>
        </VideoEditorProvider>
    )
}
