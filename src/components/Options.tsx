import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'

import { classNames } from '@/utils/styling'

export type Option = {
    id: number,
    name: string,
    icon: JSX.Element,
    handleClick: (event?: any) => void,
}

export function OptionsMenu({
    options,
    buttonIcon
}: {
    options: Option[],
    buttonIcon: JSX.Element
}) {

    return (
        <Menu as="div" className="relative inline-block text-left" >
            <Menu.Button
                className="flex items-center justify-center"
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
            >
                <span className="sr-only">Open options</span>
                {buttonIcon}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 z-20 mt-1 w-36 origin-top-right
                    rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1
                    ring-black ring-opacity-5 focus:outline-none"
                >
                    <div className="py-1">
                        <ul
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {options.map((option) => (
                                <MenuItem key={option.id} option={option} />
                            ))}
                        </ul>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

function MenuItem({ option }: { option: Option }) {
    return (
        <li key={option.id}>
            <Menu.Item>
                {({ active }) => (
                    <button
                        onClick={option.handleClick}
                        className={classNames(
                            active
                                ? 'bg-gray-100 dark:bg-zinc-800'
                                : 'bg-white dark:bg-zinc-900',
                            "flex px-4 py-2 text-sm w-full",
                            "text-gray-800 dark:text-white/90"
                        )}
                    >
                        {option.icon}
                        {option.name}
                    </button>
                )}
            </Menu.Item>
        </li>
    )
}
