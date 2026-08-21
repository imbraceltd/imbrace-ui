import type { QueryFunction } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Option } from '../Field';
import { FieldSelect } from '../Field/select';
import { FieldText } from '../Field/text';
import { Space } from '../Space';

const DataBoardVariableForm = (props: {
    methods: UseFormReturn<
        {
            name: string;
            fieldId: string;
            boardId: string;
        },
        any
    >;
    disableBoard?: boolean;
    fieldsRequest?: QueryFunction<Option[], ['variable-fields', string | undefined], never>;
    boardsRequest?: QueryFunction<Option[], ['variable-boards'], never>;
    hideSource?: boolean;
}) => {
    const { methods, fieldsRequest, boardsRequest, disableBoard, hideSource } = props;
    const { control } = methods;
    const boardId = useWatch({ control, name: 'boardId' });
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return (
        <Space size={24} style={{ width: '100%' }} direction="vertical">
            <Controller
                control={control}
                name="name"
                rules={{
                    required: {
                        value: true,
                        message: t('validation_field_required'),
                    },
                    validate: {
                        checkSpace: (val: string) => val.trim().length > 0 || t('text_editor_variable_name_required'),
                    },
                }}
                render={({ field, fieldState: { error } }) => (
                    <FieldText
                        fullWidth
                        label={`${t('text_editor_variable_name')}*`}
                        description={t('text_editor_variable_name_desc')}
                        error={!!error}
                        helperText={error?.message}
                        {...field}
                    />
                )}
            />
            {!hideSource && (
                <>
                    <Controller
                        control={control}
                        name="boardId"
                        rules={{
                            required: {
                                value: true,
                                message: t('validation_field_required'),
                            },
                            validate: {
                                outOfRange: (v) => {
                                    const options = queryClient.getQueryData(['variable-boards']) as { text: string; value: string }[];
                                    if (options.find((option) => option.value === v)) {
                                        return true;
                                    }

                                    return t('text_editor_variable_out_of_range');
                                },
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FieldSelect<string, ['variable-boards']>
                                queryKey={['variable-boards']}
                                label={`${t('text_editor_variable_data_source')}*`}
                                description={t('text_editor_variable_data_source_desc')}
                                request={async (params) => {
                                    try {
                                        if (boardsRequest) {
                                            return await boardsRequest(params);
                                        }
                                        return [];
                                    } catch (err) {
                                        console.log(err);
                                        return [];
                                    }
                                }}
                                disabled={disableBoard}
                                placeholder={t('click_to_select')}
                                fullWidth
                                emptyText={t('text_editor_variable_board_empty')}
                                error={!!error}
                                helperText={error?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="fieldId"
                        rules={{
                            required: {
                                value: true,
                                message: t('validation_field_required'),
                            },
                            validate: {
                                outOfRange: (v) => {
                                    if (!v) {
                                        return true;
                                    }
                                    const options = queryClient.getQueryData(['variable-fields', boardId]) as {
                                        text: string;
                                        value: string;
                                    }[];
                                    if (options.find((option) => option.value === v)) {
                                        return true;
                                    }

                                    return t('text_editor_variable_out_of_range');
                                },
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FieldSelect<string, ['variable-fields', string | undefined]>
                                queryKey={['variable-fields', boardId]}
                                request={async (params) => {
                                    try {
                                        if (!boardId) {
                                            return [];
                                        }
                                        if (fieldsRequest) {
                                            return await fieldsRequest(params);
                                        }
                                        return [];
                                    } catch (err) {
                                        console.log(err);
                                        return [];
                                    }
                                }}
                                placeholder={t('click_to_select')}
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                {...field}
                            />
                        )}
                    />
                </>
            )}
        </Space>
    );
};

export default DataBoardVariableForm;
