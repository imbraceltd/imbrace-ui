import { fn } from '@storybook/test';
import { ColorPicker, useColorPicker } from '.';
import { Meta, StoryFn } from '@storybook/react';
import { Button } from '../Button';

export default {
    title: 'Imbrace/ColorPicker',
    component: ColorPicker,
    argTypes: {
        onChange: {
            table: {
                category: 'Events',
            },
            control: false,
        },
    },
    args: {
        placeholder: 'Placeholder',
        onChange: fn(),
    },
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof ColorPicker>;

const Template: StoryFn<typeof ColorPicker> = (args) => <ColorPicker {...args} />;

export const Default = Template.bind({});
Default.args = {};

const HooksTemplate: StoryFn<typeof ColorPicker> = (args) => {
    const [{ colorPicker }, colorPickerHolder] = useColorPicker();
    return (
        <div>
            {colorPickerHolder}
            <Button
                text="Open color picker"
                onClick={(e) => {
                    colorPicker({
                        anchorEl: e.currentTarget,
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                        },
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                    });
                }}
            />
        </div>
    );
};

export const Hooks = HooksTemplate.bind({});
Hooks.args = {};
