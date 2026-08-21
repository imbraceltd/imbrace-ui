import type { QueryFunction } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useRef, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { urlRegex } from '../../utils';
import type { Option } from '../Field';
import { FieldSelect } from '../Field/select';
import { FieldText } from '../Field/text';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import type { SelectRef } from '../Select';
import { Space } from '../Space';
import { Typography } from '../Typography';

export const CTAButtonFormSchema = (t: TFunction<'translation', undefined>) =>
    z.object({
        text: z
            .string({ required_error: t('validation_field_required') })
            .trim()
            .min(1, {
                message: t('validation_field_required'),
            }),
        touchpoint_id: z.string({ required_error: t('validation_field_required') }).optional(),
        href: z
            .string({ required_error: t('validation_field_required') })

            .regex(urlRegex, { message: t('validation_url_pattern') }),
    });

export type CTAButtonFormData = z.infer<ReturnType<typeof CTAButtonFormSchema>>;

const CTAButtonForm = (props: {
    methods: UseFormReturn<CTAButtonFormData>;
    defaultValues?: CTAButtonFormData;
    newTouchpointOnClick?: ({ setValue }: { setValue: (data: { id: string; url: string }) => void }) => void;
    request?: (params: { setValue: (url: string) => void; setCurrentType: (type: string) => void }) => QueryFunction<
        Option[],
        [
            'ctaButtonType',
            {
                type?: string | undefined;
            },
        ],
        never
    >;
}) => {
    const { defaultValues, methods, newTouchpointOnClick, request } = props;
    const { control, setValue, getValues } = methods;
    const [currentType, setCurrentType] = useState<string | undefined>(
        defaultValues ? (defaultValues?.touchpoint_id ? 'touchpoint' : 'url') : undefined,
    );
    const touchpointRef = useRef<SelectRef>(null);
    const { t } = useTranslation();
    return (
        <Space size={24} style={{ width: '100%' }} direction="vertical">
            <Controller
                control={control}
                name="text"
                render={({ field, fieldState: { error } }) => (
                    <FieldText
                        fullWidth
                        label={`${t('text_editor_text_in_cta')}*`}
                        error={!!error}
                        helperText={error?.message}
                        {...field}
                    />
                )}
            />
            {currentType !== 'url' && (
                <Controller
                    control={control}
                    name="touchpoint_id"
                    render={({ field, fieldState: { error } }) => (
                        <FieldSelect<string, ['ctaButtonType', { type?: string }]>
                            fullWidth
                            queryKey={['ctaButtonType', { type: currentType }]}
                            placeholder={t('click_to_select')}
                            label={`${t('text_editor_cta_button_content')}*`}
                            {...field}
                            value={field.value || ''}
                            request={async (params) => {
                                if (request) {
                                    return request({
                                        setValue: (url) => {
                                            setValue('href', url, {
                                                shouldValidate: true,
                                            });
                                        },
                                        setCurrentType,
                                    })(params);
                                }

                                return [];
                            }}
                            error={!!error}
                            helperText={error?.message}
                            onChange={(e) => {
                                if (currentType === 'touchpoint') {
                                    field.onChange(e);
                                }
                            }}
                            ref={touchpointRef}
                            closeOnSelect={currentType === 'touchpoint'}
                            onClose={() => {
                                if (currentType === 'touchpoint' && !getValues('touchpoint_id')) {
                                    setCurrentType(undefined);
                                }
                            }}
                            {...(currentType === 'touchpoint' &&
                                newTouchpointOnClick && {
                                footer: () => {
                                    return (
                                        <IconButton
                                            size="default"
                                            variant="text"
                                            type="secondary"
                                            sx={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                gap: '12px',
                                                justifyContent: 'flex-start',
                                                textTransform: 'capitalize',
                                                borderRadius: 0,
                                            }}
                                            onClick={() => {
                                                newTouchpointOnClick({
                                                    setValue: (data: { id: string; url: string }) => {
                                                        touchpointRef.current?.refresh();
                                                        setValue('touchpoint_id', data.id, {
                                                            shouldValidate: true,
                                                        });
                                                        setValue('href', data.url, {
                                                            shouldValidate: true,
                                                        });
                                                        touchpointRef.current?.close();
                                                    },
                                                });
                                            }}
                                        >
                                            <Icon name="add" fontSize={24} style={{ color: 'var(--color-primary-1)' }} />
                                            <Space size={4}>
                                                <Typography
                                                    variant="BodyTight"
                                                    style={{
                                                        color: 'var(--color-primary-1)',
                                                    }}
                                                >
                                                    {t('new_touchpoint')}
                                                </Typography>
                                            </Space>
                                        </IconButton>
                                    );
                                },
                            })}
                            {...(field.value && {
                                onReset: () => {
                                    setValue('touchpoint_id', '', {
                                        shouldValidate: true,
                                    });
                                    setValue('href', '', {
                                        shouldValidate: true,
                                    });
                                    setCurrentType(undefined);
                                },
                            })}
                        />
                    )}
                />
            )}
            {currentType === 'url' && (
                <Controller
                    control={control}
                    name="href"
                    render={({ field, fieldState: { error } }) => (
                        <FieldText
                            fullWidth
                            label={`${t('text_editor_cta_button_url')}*`}
                            error={!!error}
                            helperText={error?.message}
                            placeholder="http://"
                            onReset={() => {
                                setCurrentType(undefined);
                                setValue('href', '', {
                                    shouldValidate: true,
                                });
                            }}
                            {...field}
                        />
                    )}
                />
            )}
        </Space>
    );
};

export default CTAButtonForm;
