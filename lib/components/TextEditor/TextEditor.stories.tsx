import { fn } from '@storybook/test';
import { TextEditor } from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Meta, StoryFn } from '@storybook/react';
import axios from 'axios';

export default {
    title: 'Imbrace/TextEditor',
    component: TextEditor,
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
        // design: {
        //     type: 'figma',
        //     url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=1398%3A47307&t=Vc0crWfsWncBtL1k-1',
        // },
        docs: { source: { type: 'dynamic' } },
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} as Meta<typeof TextEditor>;

const Template: StoryFn<typeof TextEditor> = (args) => <TextEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
    blotsProps: {
        unsubscribe: {
            link: 'http://localhost:8080/email-campaign/optout',
        },
        dataBoardVariable: {
            boardsRequest: async () => {
                const { data } = await axios.get<{ data: { _id: string; name: string }[] }>('/api/v1/board', {
                    params: {
                        limit: 0,
                        skip: 0,
                    },
                    headers: {
                        'x-access-token': '<YOUR_ACCESS_TOKEN>',
                    },
                });
                return data.data.map((board) => {
                    return {
                        value: board._id,
                        text: board.name,
                    };
                });
            },
            fieldsRequest: async ({ queryKey }) => {
                const boardId = queryKey[1];
                if (!boardId) {
                    return [];
                }
                const { data } = await axios.get<{
                    _id: string;
                    fields: {
                        name: string;
                        _id: string;
                    }[];
                }>(`/api/v1/board/${boardId}`, {
                    headers: {
                        'x-access-token': '<YOUR_ACCESS_TOKEN>',
                    },
                });
                return data.fields.map((boardField) => {
                    return {
                        text: boardField.name,
                        value: boardField._id,
                    };
                });
            },
            blotsValidation: async (blotInstances) => {
                try {
                    const boardId = 'brd_c3a66c61-cbe7-40fb-bbc2-17622b30329c';
                    if (boardId) {
                        const { data } = await axios.get<{
                            _id: string;
                            fields: {
                                name: string;
                                _id: string;
                            }[];
                        }>(`/api/v1/board/${boardId}`, {
                            headers: {
                                'x-access-token': '<YOUR_ACCESS_TOKEN>',
                            },
                        });

                        blotInstances.forEach((blotInstance) => {
                            // Data board variable blot validation
                            const isExist =
                                data.fields?.findIndex((boardField) => boardField._id === blotInstance.getCurrentFieldId()) !== -1;
                            if (blotInstance.getCurrentBoardId() !== boardId) {
                                blotInstance.changeCurrentBoardId(boardId || '');
                            } else if (data.fields && !isExist) {
                                blotInstance.toggleInvalid(true);
                            } else if (data.fields && isExist) {
                                blotInstance.toggleInvalid(false);
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            },
        },
    },
};
