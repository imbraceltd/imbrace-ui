import type { Meta, StoryFn } from '@storybook/react';

import { Breadcrumb } from '.';
import { Icon } from '../Icon';
import { useState } from 'react';

export default {
    title: 'Imbrace/Breadcrumb',
    component: Breadcrumb,

    argTypes: {
        items: {
            control: 'object',
        },
        isActive: {
            table: {
                category: 'Events',
            },
            control: false,
        },
    },
    args: {
        items: [],
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=2931-202536&t=T7AKIU40s0CodIKy-4',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Breadcrumb>;

const Template: StoryFn<typeof Breadcrumb> = (args) => {
    const [currentPath, setCurrentPath] = useState('/a/b/c/d');
    return (
        <Breadcrumb
            {...args}
            items={args.items.map((item) => ({
                ...item,
                onClick: (e, path) => {
                    setCurrentPath(path);
                    e.currentTarget.blur();
                },
            }))}
            isActive={(path) => path === currentPath}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    items: [
        {
            title: 'a',
            path: '/a',
        },
        {
            title: 'b',
            path: '/a/b',
        },
        {
            title: 'c',
            path: '/a/b/c',
            disabled: true,
        },
        {
            title: 'd',
            path: '/a/b/c/d',
        },
        {
            title: 'e',
            path: '/a/b/c/d/e',
        },
    ],
    isActive: (path) => path === '/a/b/c/d',
};

const SeparatorTemplate: StoryFn<typeof Breadcrumb> = (args) => <Breadcrumb {...args} />;

export const Separator = SeparatorTemplate.bind({});
Separator.args = {
    items: [
        {
            title: 'Form A',
            path: '/a',
        },
        {
            title: 'Form B',
            path: '/a/b',
        },
        {
            title: 'Form C',
            path: '/a/b/c',
            disabled: true,
        },
        {
            title: 'Form D',
            path: '/a/b/c/d',
        },
    ],
    separator: <Icon name="forwardIos" />,
    isActive: (path) => path === '/a/b/c/d',
};
