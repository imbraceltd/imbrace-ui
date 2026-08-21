import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldSelect, FieldTextEditor, Icon, Space } from '../lib/main';

const fetchBoards = async () => {
    const { data } = await axios.get<{ data: { _id: string; name: string }[] }>('/api/v1/board', {
        params: {
            limit: 0,
            skip: 0,
        },
        headers: {
            'x-access-token': '<YOUR_ACCESS_TOKEN>',
        },
    });
    return data.data;
};

const fetchFields = async (boardId: string) => {
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
    return data.fields;
};

const TextEditorExample = () => {
    const { t } = useTranslation();
    const { watch, control } = useForm({
        defaultValues: {
            audience: '',
            content: undefined,
        },
    });

    const audience = watch('audience');

    return (
        <Space direction="vertical" align="start">
            <Controller
                control={control}
                name="audience"
                render={({ field }) => (
                    <FieldSelect
                        {...field}
                        label="Source"
                        queryKey={['boards']}
                        request={async () => {
                            const boards = await fetchBoards();
                            return boards.map((board) => {
                                return {
                                    value: board._id,
                                    text: board.name,
                                };
                            });
                        }}
                    />
                )}
            />
            <Controller
                control={control}
                name="content"
                render={({ field }) => (
                    <FieldTextEditor
                        {...field}
                        blotsProps={{
                            unsubscribe: {
                                link: 'http://localhost:8080/email-campaign/optout',
                            },
                            dataBoardVariable: {
                                boardsRequest: async () => {
                                    const boards = await fetchBoards();
                                    return boards.map((board) => {
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
                                    const fields = await fetchFields(boardId);
                                    return fields.map((boardField) => {
                                        return {
                                            text: boardField.name,
                                            value: boardField._id,
                                        };
                                    });
                                },
                                blotsValidation: async (blotInstances) => {
                                    try {
                                        const boardId = audience;
                                        if (boardId) {
                                            const fields = await fetchFields(boardId);

                                            blotInstances.forEach((blotInstance) => {
                                                // Data board variable blot validation
                                                if (blotInstance.getCurrentBoardId() !== boardId) {
                                                    blotInstance.changeCurrentBoardId(boardId || '');
                                                }
                                                const isExist =
                                                    fields?.findIndex(
                                                        (boardField) => boardField._id === blotInstance.getCurrentFieldId(),
                                                    ) !== -1;
                                                console.log(fields, isExist);

                                                if (fields && !isExist) {
                                                    blotInstance.toggleInvalid(true);
                                                } else if (fields && isExist) {
                                                    blotInstance.toggleInvalid(false);
                                                }
                                            });
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                },
                                boardId: audience,
                                hideSource: !audience,
                            },
                            ctaButton: {
                                request:
                                    (params) =>
                                    async ({ queryKey }) => {
                                        const { type } = queryKey[1];
                                        const { setCurrentType } = params;
                                        if (!type) {
                                            return [
                                                {
                                                    icon: <Icon name="link" fontSize={24} style={{ color: 'var(--color-light-5)' }} />,
                                                    text: t('text_editor_cta_button_use_url'),
                                                    description: t('text_editor_cta_button_use_url_desc'),
                                                    value: 'url',
                                                    iconAlignment: 'flex-start',
                                                    onClick: () => {
                                                        setCurrentType('url');
                                                    },
                                                },
                                            ];
                                        }
                                        return [];
                                    },
                            },
                        }}
                    />
                )}
            />
        </Space>
    );
};

export default TextEditorExample;
