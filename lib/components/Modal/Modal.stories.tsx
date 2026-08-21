import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Modal, ModalHOCProps, useModal } from '.';
import { Space } from '../Space';
import { Typography } from '../Typography';
import { Breadcrumb } from '../Breadcrumb';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
export default {
    title: 'Imbrace/Modal',
    component: Modal,

    argTypes: {
        open: {
            type: 'boolean',
            defaultValue: false,
        },
        hideHeader: {
            type: 'boolean',
            defaultValue: false,
        },
        disablePortal: {
            type: 'boolean',
            defaultValue: false,
        },
        backdropClosable: {
            type: 'boolean',
            defaultValue: false,
        },
        title: {
            type: 'string',
        },
        content: {
            type: 'function',
            table: {
                category: 'Element',
            },
            control: false,
            description: 'Only for useModal()',
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
        children: {
            table: {
                category: 'Element',
            },
            control: false,
            description: 'Only for Modal component',
        },
    },
    args: {
        title: "I'm title",
        hideHeader: false,
        open: false,
        disablePortal: false,
        backdropClosable: false,
    },
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
    const [{ open }, updateArgs] = useArgs();

    return (
        <>
            <Button
                type="primary"
                text="Open Modal"
                onClick={() => {
                    updateArgs({
                        open: true,
                    });
                }}
            />
            <Modal
                {...args}
                open={open}
                onClose={async () => {
                    args?.onClose?.();
                    updateArgs({
                        open: false,
                    });
                }}
            >
                I'm children
            </Modal>
        </>
    );
};
export const Default = Template.bind({});
Default.args = {
    title: "I'm title",
    children: "I'm children",
};

const TemplateFunc: StoryFn<ModalHOCProps> = (args) => {
    const [{ title, content }] = useArgs();
    const [{ modal }, modalContext] = useModal();
    return (
        <>
            {modalContext}
            <Button
                type="primary"
                text="Open Modal"
                onClick={() => {
                    modal({
                        title,
                        content,
                    });
                }}
            />
        </>
    );
};
export const CallByHooks = TemplateFunc.bind({});
CallByHooks.args = {
    title: "I'm title",
    content: ({ onClose, changeTitle, changeExtra }) => (
        <div style={{ padding: '0 20px' }}>
            <pre>called by useModal hooks</pre>
            <Space>
                <Button
                    text="Close modal"
                    variant="outlined"
                    onClick={() => {
                        onClose();
                    }}
                />
                <Button
                    text="Change title"
                    onClick={() => {
                        changeTitle(
                            <Space size={12}>
                                <Typography style={{ fontWeight: 700, color: 'var(--color-light-5)' }}>
                                    I'm new title that is changed by calling changeTitle()
                                </Typography>
                                <Breadcrumb
                                    items={[
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
                                        },
                                        {
                                            title: 'd',
                                            path: '/a/b/c/d',
                                        },
                                    ]}
                                    isActive={(path) => path === '/a/b/c/d'}
                                />
                            </Space>,
                        );
                    }}
                />
                <Button
                    text="Change extra"
                    onClick={() => {
                        changeExtra(
                            <IconButton
                                size="xs"
                                type="secondary"
                                variant="text"
                                onClick={() => {
                                    changeExtra(null);
                                }}
                            >
                                <Icon name="delete" />
                            </IconButton>,
                        );
                    }}
                />
            </Space>
        </div>
    ),
};
