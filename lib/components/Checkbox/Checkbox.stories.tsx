import { Checkbox } from '.';
import { Meta, StoryFn } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

export default {
    title: 'Imbrace/Checkbox',
    component: Checkbox,
    argTypes: {
        label: { type: 'string' },
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        onChange: { action: 'changed' },
    },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => {
    const [{ checked }, updateArgs] = useArgs();
    return (
        <Checkbox
            {...args}
            checked={checked}
            onChange={(isChecked) => {
                updateArgs({ checked: isChecked });
                args.onChange?.(isChecked);
            }}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    checked: false,
    disabled: false,
    indeterminate: false,
};

export const Checked = Template.bind({});
Checked.args = {
    checked: true,
    disabled: false,
    indeterminate: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
    checked: false,
    disabled: true,
    indeterminate: false,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
    checked: false,
    disabled: false,
    indeterminate: true,
};
