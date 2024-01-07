// React
import { ReactNode, MouseEvent } from 'react'

// Utils
import { classNames } from '@/utils/styling'


export function ToolTipButton({
    tooltipText,
    buttonClass,
    tooltipClass,
    children,
    OnClick,
    ...buttonProps
}: {
    tooltipText: string,
    buttonClass: string,
    tooltipClass: string,
    children: ReactNode,
    OnClick: (event: MouseEvent<HTMLButtonElement>) => void,
}) {
    return (
        <div className="relative group inline-block">
            <button
                className={`${buttonClass}`}
                onClick={OnClick}
                {...buttonProps}
            >
                {children}
            </button>
            <span
                className={classNames(
                    tooltipClass,
                    "absolute left-1/2 z-30 transform -translate-x-1/2 text-white",
                    "text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100",
                    "transition-opacity pointer-events-none", 
                )}
            >
                {tooltipText}
            </span>
        </div>
    );
}