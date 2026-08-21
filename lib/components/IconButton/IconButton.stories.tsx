import type { Meta, StoryFn } from '@storybook/react';

import { Icon } from '../Icon';
import { IconButton } from '.';

export default {
    title: 'Imbrace/IconButton',
    component: IconButton,

    argTypes: {
        type: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'success', 'warning'],
        },
        size: {
            control: 'select',
            options: ['default', 's', 'xs'],
        },
        fontSize: {
            type: 'number',
            defaultValue: 24,
        },
        variant: {
            control: 'select',
            options: ['outlined', 'contained', 'text'],
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
        },
        loading: {
            type: 'boolean',
            defaultValue: false,
        },
        onClick: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        children: {
            table: {
                category: 'Element',
            },
            control: false,
        },
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=336%3A21814&t=hhW41fsNd1DwTfoG-1',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof IconButton>;

const Template: StoryFn<typeof IconButton> = (args) => (
    <IconButton {...args}>
        <Icon name="qrCode" />
    </IconButton>
);

export const Default = Template.bind({});
Default.args = {};
