'use client'

// React
import { useState } from 'react'

// Components
import { Header } from '@/components/Header'
import { ClipEditor } from '@/components/Clips'
import { Transcription } from '@/components/Transcription'

// Data
import { intervals } from '@/data/clips'

// Providers
import { Providers } from '@/app/providers'

export default function Demo() {
    const [interval, setInterval] = useState<Interval>(intervals[0]);

    return (
        <div className="rounded-lg border border-gray-300 dark:border-white/20">
            <Header setInterval={setInterval} />
            <ClipEditor interval={interval} />
            <Transcription />
        </div>
    )
}
