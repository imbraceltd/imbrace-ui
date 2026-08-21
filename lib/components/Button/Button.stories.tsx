import type { Meta, StoryFn } from '@storybook/react';

import { Icon } from '../Icon';
import { Button } from '.';

export default {
    title: 'Imbrace/Button',
    component: Button,

    argTypes: {
        size: {
            control: 'select',
            defaultValue: 'default',
            options: ['l', 'default', 's', 'xs'],
        },
        type: {
            control: 'select',
            defaultValue: 'primary',
            options: ['primary', 'secondary', 'danger', 'success', 'warning'],
        },
        variant: {
            control: 'select',
            defaultValue: 'contained',
            options: ['outlined', 'contained', 'text', 'link'],
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
        startIcon: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        endIcon: {
            table: {
                category: 'Element',
            },
            control: false,
        },
    },
    args: {
        text: 'Button',
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=336%3A21814&t=hhW41fsNd1DwTfoG-1',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {};

const TypeComponent: StoryFn<typeof Button> = ({ size, text, ...restArgs }) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Button {...restArgs} type="primary" text="Primary" />
            <Button {...restArgs} type="secondary" text="Secondary" />
            <Button {...restArgs} type="danger" text="Danger" />
            <Button {...restArgs} type="success" text="Success" />
            <Button {...restArgs} type="warning" text="Warning" />
        </div>
    );
};
export const AllTypes = TypeComponent.bind({});

const SizeComponent: StoryFn<typeof Button> = ({ size, text, ...restArgs }) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Button {...restArgs} size="l" text="Large" />
            <Button {...restArgs} size="default" text="Default" />
            <Button {...restArgs} size="s" text="Small" />
            <Button {...restArgs} size="xs" text="Extra Small" />
        </div>
    );
};
export const AllSizes = SizeComponent.bind({});

const VariantComponent: StoryFn<typeof Button> = ({ variant, text, ...restArgs }) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Button {...restArgs} variant="contained" text="Contained" />
            <Button {...restArgs} variant="outlined" text="Outlined" />
            <Button {...restArgs} variant="text" text="Text" />
            <Button {...restArgs} variant="link" text="Link" />
        </div>
    );
};
export const AllVariants = VariantComponent.bind({});

const IconWithTextComponent: StoryFn<typeof Button> = ({ text, ...resetArgs }) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Button startIcon={<Icon name="upload" />} text={text} {...resetArgs} />
            <Button endIcon={<Icon name="upload" />} text={text} {...resetArgs} />
            <Button endIcon={<Icon name="upload" />} {...resetArgs} />
        </div>
    );
};
export const IconWithText = IconWithTextComponent.bind({});

export const Loading = Template.bind({});

Loading.args = {
    loading: true,
    text: 'Button',
};
