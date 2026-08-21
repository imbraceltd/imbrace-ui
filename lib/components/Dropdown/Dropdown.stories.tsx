import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';
import type { MouseEvent as ReactMouseEvent } from 'react';

import { Icon } from '../Icon';
import { Dropdown, DropdownProps } from '.';

export default {
    title: 'Imbrace/Dropdown',
    component: Dropdown,

    argTypes: {
        loading: {
            type: 'boolean',
            defaultValue: false,
        },
        hideArrow: {
            type: 'boolean',
            defaultValue: false,
        },
        hideOnSelect: {
            type: 'boolean',
            defaultValue: false,
        },
        selectedIndex: {
            type: 'number',
        },
        text: {
            defaultValue: 'Actions',
        },
        options: {
            defaultValue: [
                { text: 'Action', index: 0 },
                { text: 'Action', index: 1 },
                { type: 'divider' },
                { text: 'Action', index: 2, disabled: true },
            ],
        },
        variant: {
            options: ['text', 'contained'],
            control: 'select',
        },
        onSelect: {
            table: {
                category: 'Events',
            },
            control: false,
            action: 'onSelect',
        },
        icon: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        mode: {
            type: 'string',
            control: 'select',
            options: ['single'],
        },
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=336%3A21814&t=hhW41fsNd1DwTfoG-1',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<DropdownProps<string | number>>;

const DefaultComponent: StoryFn<DropdownProps<string | number>> = (props) => {
    const [{ selectedIndex }, updateArgs] = useArgs();

    const onSelect = (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedItemIndex: string | number) => {
        (props.onSelect as (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: string | number) => void)?.(
            event,
            selectedItemIndex,
        );
        updateArgs({ selectedIndex: selectedItemIndex });
    };

    return <Dropdown {...props} mode="single" selectedIndex={selectedIndex} onSelect={onSelect} />;
};

export const Default = DefaultComponent.bind({});
Default.args = {
    text: 'Actions',
    options: [
        { text: 'Action', index: 0 },
        { text: 'Action', index: 1 },
        { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
        { type: 'divider' },
        { text: 'Action', index: 3, disabled: true },
    ],
};
const OptionWithIconComponent: StoryFn<DropdownProps<string | number>> = (props) => {
    const [{ selectedIndex }, updateArgs] = useArgs();

    const onSelect = (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedItemIndex: string | number | (string | number)[]) => {
        (props.onSelect as (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: string | number) => void)?.(
            event,
            selectedItemIndex as string | number,
        );
        updateArgs({ selectedIndex: selectedItemIndex });
    };

    return <Dropdown {...props} selectedIndex={selectedIndex} onSelect={onSelect} />;
};

export const OptionWithIcon = OptionWithIconComponent.bind({});
OptionWithIcon.args = {
    text: 'Actions',
    options: [
        { text: 'Action', index: 0 },
        { text: 'Action', index: 1 },
        { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
        { type: 'divider' },
        { text: 'Action', index: 3, disabled: true },
    ],
};

const IconDropdownComponent: StoryFn<DropdownProps<string | number>> = (props) => {
    const [{ selectedIndex }, updateArgs] = useArgs();

    const onSelect = (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedItemIndex: string | number | (string | number)[]) => {
        (props.onSelect as (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: string | number) => void)?.(
            event,
            selectedItemIndex as string | number,
        );
        updateArgs({ selectedIndex: selectedItemIndex });
    };

    return <Dropdown variant="text" icon={<Icon name="filter" />} {...props} selectedIndex={selectedIndex} onSelect={onSelect} />;
};

export const IconDropdown = IconDropdownComponent.bind({});
IconDropdown.args = {
    text: 'Actions',
    options: [
        { text: 'Action', index: 0 },
        { text: 'Action', index: 1 },
        { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
        { type: 'divider' },
        { text: 'Action', index: 3, disabled: true },
    ],
};

const CheckboxDropdownComponent: StoryFn<DropdownProps<string | number>> = (props) => {
    const [{ selectedIndex }, updateArgs] = useArgs();

    const onSelect = (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedItemIndex: (string | number) | (string | number)[]) => {
        (props.onSelect as (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: string | number) => void)?.(
            event,
            selectedItemIndex as string | number,
        );
        updateArgs({ selectedIndex: selectedItemIndex });
    };

    return (
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Dropdown variant="text" icon={<Icon name="filter" />} checkbox {...props} selectedIndex={selectedIndex} onSelect={onSelect} />
            <Dropdown {...props} selectedIndex={selectedIndex} checkbox onSelect={onSelect} />
        </div>
    );
};

export const CheckboxDropdown = CheckboxDropdownComponent.bind({});
CheckboxDropdown.args = {
    text: 'Actions',
    options: [
        { text: 'Action', index: 0 },
        { text: 'Action', index: 1 },
        { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
        { type: 'divider' },
        { text: 'Action', index: 3, disabled: true },
    ],
};

const DropdownMultipleComponent: StoryFn<DropdownProps<string | number>> = (props) => {
    const [{ selectedIndex }, updateArgs] = useArgs();

    const onSelect = (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedItemIndex: (string | number)[]) => {
        (props.onSelect as (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: (string | number)[]) => void)?.(
            event,
            selectedItemIndex,
        );
        updateArgs({ selectedIndex: selectedItemIndex });
    };

    return (
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Dropdown
                variant="text"
                icon={<Icon name="filter" />}
                {...props}
                mode={'multiple'}
                selectedIndex={selectedIndex}
                onSelect={onSelect}
            />
            <Dropdown {...props} selectedIndex={selectedIndex} mode={'multiple'} onSelect={onSelect} />
            <Dropdown {...props} selectedIndex={selectedIndex} mode={'multiple'} checkbox onSelect={onSelect} />
        </div>
    );
};

export const DropdownMultiple = DropdownMultipleComponent.bind({});
DropdownMultiple.args = {
    text: 'Actions',
    options: [
        { text: 'Action', index: 0 },
        { text: 'Action', index: 1 },
        { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
        { type: 'divider' },
        { text: 'Action', index: 3, disabled: true },
    ],
    selectedIndex: [],
};
