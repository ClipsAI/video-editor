import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'

import { classNames } from '@/utils/styling'

export type Options = {
    id: number,
    name: string,
    icon: JSX.Element,
    handleClick: (event?: any) => void,
}

type OptionsProps = {
    options: Options[],
    buttonIcon: JSX.Element,
}

export function OptionsMenu({ options, buttonIcon }: OptionsProps) {

    return (
        <Menu as="div" className="relative inline-block text-left" >
            <div>
                <Menu.Button
                    className="flex items-center justify-center"
                    onClick={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                >
                    <span className="sr-only">Open options</span>
                    {buttonIcon}
                </Menu.Button>
            </div>

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
                    rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
                    focus:outline-none"
                >
                    <div className="py-1">
                        <ul 
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {options.map((option) => (
                                <li key={option.id}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={option.handleClick}
                                                className={classNames(
                                                    active 
                                                    ? 'bg-gray-100 text-gray-900' : 
                                                    'text-gray-700',
                                                    "flex px-4 py-2 text-sm w-full"
                                                )}
                                            >
                                                {option.icon}
                                                {option.name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                </li>
                            ))}

                        </ul>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}