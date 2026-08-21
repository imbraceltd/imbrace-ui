import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button';
import { FieldText } from '../Field/text';
import { Space } from '../Space';

interface LinkPopperProps {
    open: boolean;
    anchorEl: HTMLElement;
    onClose?: () => void;
    onDone: (link: string) => void;
    defaultValues?: {
        link?: string;
    };
}

const LinkPopper = (props: LinkPopperProps) => {
    const { open, anchorEl, onClose, onDone, defaultValues } = props;

    const { t } = useTranslation();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            link: defaultValues?.link || '',
        },
        mode: 'all',
    });

    const onSubmit = (formData: { link: string }) => {
        onDone(formData.link);
        onClose?.();
    };

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{
                background: 'white',
                overflow: 'hidden',
                padding: '12px ',
                marginTop: '4px',
                boxShadow: '0px 2px 24px 0px #E0E0E033, 0px 4px 8px 0px #BDBDBD14',
                zIndex: 10000,
            }}
        >
            <Space size={12} align="start">
                <Controller
                    control={control}
                    name="link"
                    rules={{
                        pattern: {
                            value: /^(https?:\/\/)+([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?[^\s]*)?$/,
                            message: t('validation_url_pattern'),
                        },
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <FieldText
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            onReset={
                                field.value
                                    ? () => {
                                          field.onChange('');
                                      }
                                    : undefined
                            }
                            placeholder={'http://'}
                            onBlur={(e) => {
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onFocus={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    )}
                />
                <Space justify="center" style={{ height: '40px', width: '69px' }}>
                    <Button
                        size="xxs"
                        variant="link"
                        sx={{
                            textTransform: 'uppercase',
                        }}
                        text={t('enter')}
                        onClick={() => {
                            handleSubmit(onSubmit)();
                        }}
                    />
                </Space>
            </Space>
        </Popper>
    );
};

interface HOCProps {
    anchorEl: HTMLElement;
    onDone: (link: string) => void;
    defaultValues?: {
        link?: string;
    };
    onClose?: () => void;
}

const HOC = ({ onClose, ...restProps }: HOCProps) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };

    return (
        <ClickAwayListener onClickAway={() => handleClose()}>
            <div>
                <LinkPopper open={open} onClose={handleClose} {...restProps} />
            </div>
        </ClickAwayListener>
    );
};

export const linkPopper = (props: HOCProps) => {
    const fragment = document.createDocumentFragment();
    const root = createRoot(fragment);

    return root.render(createPortal(<HOC {...props} />, document.body));
};
