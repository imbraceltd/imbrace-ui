import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';
import { Controller } from 'react-hook-form';

import { Button } from '../Button';
import { FieldSwitch } from '../Field/switch';
import { FieldText } from '../Field/text';
import { Space } from '../Space';
import Dialog from '.';
import DialogFormComponent from './form';
import DialogStepFormComponent from './stepForm';

export default {
    title: 'Imbrace/Dialog',
    component: Dialog,

    argTypes: {
        open: {
            type: 'boolean',
            defaultValue: false,
        },
        title: {
            type: 'string',
        },
        content: {
            type: 'string',
        },
        confirmText: {
            type: 'string',
        },
        cancelText: {
            type: 'string',
        },
        showDontAskedAgain: {
            type: 'boolean',
            defaultValue: false,
        },
        showCloseButton: {
            type: 'boolean',
            defaultValue: false,
        },
        hideCancelButton: {
            type: 'boolean',
            defaultValue: false,
        },
        confirmButtonProps: {
            type: 'symbol',
        },
        cancelButtonProps: {
            type: 'symbol',
        },
        onConfirm: {
            table: {
                category: 'Events',
            },
            type: 'function',
            control: false,
        },
        onClose: {
            table: {
                category: 'Events',
            },
            type: 'function',
            control: false,
        },
        onBackdropClose: {
            table: {
                category: 'Events',
            },
            type: 'function',
            control: false,
        },
    },
    args: {
        title: "I'm title",
        content: "I'm content",
        cancelText: 'Cancel',
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=336%3A21814&t=hhW41fsNd1DwTfoG-1',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Dialog>;

const Template: StoryFn<typeof Dialog> = (args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
        <>
            <Button
                type="primary"
                text="Open Dialog"
                onClick={() => {
                    updateArgs({
                        open: true,
                    });
                }}
            />
            <Dialog
                {...args}
                open={open}
                onClose={(dontAskedAgain) => {
                    args?.onClose?.(dontAskedAgain);
                    updateArgs({
                        open: false,
                    });
                }}
                onConfirm={(dontAskedAgain) => {
                    args?.onConfirm?.(dontAskedAgain);
                    updateArgs({
                        open: false,
                    });
                }}
                onBackdropClose={() => {
                    args?.onBackdropClose?.();
                    updateArgs({
                        open: false,
                    });
                }}
            />
        </>
    );
};
export const Default = Template.bind({});
Default.args = {
    title: "I'm title",
    content: "I'm content",
    confirmText: 'Confirm',
};

const TemplateForm: StoryFn<typeof DialogFormComponent> = (args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
        <>
            <Button
                type="primary"
                text="Open Dialog"
                onClick={() => {
                    updateArgs({
                        open: true,
                    });
                }}
            />
            <DialogFormComponent<{ name: string; description: string }>
                {...args}
                open={open}
                onClose={() => {
                    args?.onClose();
                    updateArgs({
                        open: false,
                    });
                }}
                content={({ control }) => {
                    return (
                        <Space direction="vertical" size={18}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'Name is required',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldText label={'Name'} fullWidth error={!!error} helperText={error?.message} {...field} />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    required: 'Description is required',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldText label={'Description'} fullWidth error={!!error} helperText={error?.message} {...field} />
                                )}
                            />
                        </Space>
                    );
                }}
                // @ts-ignore
                onConfirm={args?.onConfirm}
                onBackdropClose={() => {
                    args?.onBackdropClose?.();
                    updateArgs({
                        open: false,
                    });
                }}
            />
        </>
    );
};
export const DialogForm = TemplateForm.bind({});
DialogForm.args = {
    title: "I'm Dialog Form",
    confirmText: 'Submit',
};

const TemplateStepForm: StoryFn<typeof DialogStepFormComponent> = (args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
        <>
            <Button
                type="primary"
                text="Open Dialog"
                onClick={() => {
                    updateArgs({
                        open: true,
                    });
                }}
            />
            <DialogStepFormComponent<{ name: string; description: string; note: string; notify: boolean }>
                {...args}
                open={open}
                onClose={() => {
                    args?.onClose();
                    updateArgs({
                        open: false,
                    });
                }}
                content={({ control }) => {
                    return [
                        <Space key={`step-${1}`} direction="vertical" size={18}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'Name is required',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldText label={'Name'} fullWidth error={!!error} helperText={error?.message} {...field} />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    required: 'Description is required',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldText label={'Description'} fullWidth error={!!error} helperText={error?.message} {...field} />
                                )}
                            />
                        </Space>,
                        <Space key={`step-${2}`} direction="vertical" size={18}>
                            <Controller
                                name="note"
                                control={control}
                                rules={{
                                    required: 'Note is required',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldText label={'Note'} fullWidth error={!!error} helperText={error?.message} {...field} />
                                )}
                            />
                            <Controller
                                name="notify"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldSwitch
                                        label={'Notify'}
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                        {...field}
                                        onChange={async (checked) => {
                                            field.onChange(checked);
                                        }}
                                    />
                                )}
                            />
                        </Space>,
                    ];
                }}
                // @ts-ignore
                onConfirm={args?.onConfirm}
                onBackdropClose={() => {
                    args?.onBackdropClose?.();
                    updateArgs({
                        open: false,
                    });
                }}
            />
        </>
    );
};
export const DialogStepForm = TemplateStepForm.bind({});
DialogStepForm.args = {
    title: "I'm Dialog Step Form",
};
