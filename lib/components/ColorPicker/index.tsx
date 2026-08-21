import type { PopoverOrigin, SxProps, Theme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button';
import { FieldText } from '../Field/text';
import { Space } from '../Space';
import styles from './index.module.scss';

export interface ColorPickerProps {
    value?: string;
    onChange?: (color: string) => void;
}

export const ColorPicker = (props: ColorPickerProps) => {
    const { value, onChange } = props;
    const { t } = useTranslation();
    const [controlledValue, setControlledValue] = useState(value);

    useEffect(() => {
        setControlledValue(value);
    }, [value]);

    return (
        <Space className={styles.colorPicker} direction="vertical" size={10}>
            <HexColorPicker
                color={controlledValue}
                onChange={(color) => {
                    setControlledValue(color);
                    onChange?.(color);
                }}
            />
            <Space size={12} style={{ padding: '0 8px' }} align="stretch" direction="vertical">
                <FieldText
                    value={controlledValue}
                    fullWidth
                    placeholder="HEX"
                    onChange={(e) => {
                        setControlledValue(e.target.value);
                        onChange?.(e.target.value);
                        e.currentTarget.focus();
                    }}
                    endAdornment={
                        <InputAdornment position="end" sx={{ marginRight: '14px', marginLeft: 0 }}>
                            <div className={styles.colorPreview} style={{ background: controlledValue }} />
                        </InputAdornment>
                    }
                />
                <Space justify="end">
                    <Button
                        variant="link"
                        text={t('reset')}
                        onClick={() => {
                            setControlledValue('#000000');
                            onChange?.('#000000');
                        }}
                    />
                </Space>
            </Space>
        </Space>
    );
};

interface ColorPickerHOCProps extends ColorPickerProps {
    anchorEl: HTMLElement | null;
    onClose?: () => void;
    transformOrigin?: PopoverOrigin;
    anchorOrigin?: PopoverOrigin;
    paperSx?: SxProps<Theme>;
}

const ColorPickerHOC = ({ anchorEl, onClose, transformOrigin, anchorOrigin, paperSx, ...restProps }: ColorPickerHOCProps) => {
    const [targetAnchorEl, setTargetAnchorEl] = useState<HTMLElement | null>(anchorEl);
    const open = Boolean(anchorEl);

    const handleOnClose = () => {
        onClose?.();
        setTargetAnchorEl(null);
    };

    return (
        <Popover
            open={open}
            anchorEl={targetAnchorEl}
            onClose={handleOnClose}
            transformOrigin={transformOrigin}
            anchorOrigin={anchorOrigin}
            slotProps={{
                paper: {
                    sx: {
                        overflow: 'visible',
                        borderRadius: '8px',
                        marginTop: '4px',
                        paddingBottom: '12px',
                        boxShadow: '0px 2px 24px 0px #E0E0E033, 0px 4px 8px 0px #BDBDBD14',
                        ...paperSx,
                    },
                },
            }}
        >
            <ColorPicker {...restProps} />
        </Popover>
    );
};

interface ColorPickersRef {
    open: (props: ColorPickerHOCProps) => void;
}
interface ColorPickersProps {
    container?: HTMLElement;
}

type Items = ColorPickerHOCProps & {
    key: string;
};
export const ColorPickers = forwardRef<ColorPickersRef, ColorPickersProps>((props, ref) => {
    const [items, setItems] = useState<Items[]>([]);

    const onClose = (key: string) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
    };

    useImperativeHandle(ref, () => ({
        open: (colorPickerProps) => {
            const key = uniqueId('imbrace-color-picker');
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key,
                    ...colorPickerProps,
                });
                return clone;
            });
        },
    }));

    return createPortal(
        <>
            {items.map((item) => {
                const { key, ...restProps } = item;
                return (
                    <ColorPickerHOC
                        key={`imbrace-color-picker-${key}`}
                        {...restProps}
                        onClose={() => {
                            restProps.onClose?.();
                            onClose(key);
                        }}
                    />
                );
            })}
        </>,
        props.container || document.body,
    );
});

type ColorPickerAPI = {
    colorPicker: (colorPickerProps: ColorPickerHOCProps) => void;
};

type UseColorPickerType = (props?: ColorPickersProps) => [ColorPickerAPI, ReactElement];

export const useColorPicker: UseColorPickerType = (props) => {
    const colorPickersRef = useRef<ColorPickersRef>(null);

    const contextHolder = useMemo(() => <ColorPickers ref={colorPickersRef} {...props} />, [props]);

    const api = useMemo<ColorPickerAPI>(
        () => ({
            colorPicker: (colorPickerProps: ColorPickerHOCProps) => {
                colorPickersRef.current?.open(colorPickerProps);
            },
        }),
        [],
    );

    return [api, contextHolder];
};
