import FormControl from '@mui/material/FormControl';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import type { ChangeEvent, ForwardedRef, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Modal } from '../Modal';
import type { SpaceProps } from '../Space';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import type { FieldBaseProps } from '.';
import { FormLabel } from '.';
import { FormHelperText, Input } from '.';
import styles from './index.module.scss';

export interface FieldTextProps extends FieldBaseProps, Omit<OutlinedInputProps, 'ref' | 'prefix'> {
    prefix?: ReactNode;
    suffix?: ReactNode;
    onReset?: () => void;
    bordered?: boolean;
    compact?: boolean;
    containerSpaceProps?: Omit<SpaceProps, 'children'>;
    /** When true and multiline, the textarea can be resized vertically by dragging */
    resizable?: boolean;
    /** When true and multiline, shows an expand button to edit content in a fullscreen modal */
    expandable?: boolean;
}

const TextComponent = (props: FieldTextProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        fullWidth,
        placeholder,
        label,
        error,
        helperText,
        description,
        onReset,
        InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
        formControlSx,
        disabled,
        tooltip,
        tooltipSx,
        labelProps,
        prefix,
        suffix,
        bordered = true,
        compact = false,
        tooltipPlacement,
        tooltipPosition,
        containerSpaceProps,
        resizable = false,
        expandable = false,
        ...restProps
    } = props;

    const isMultiline = !!restProps.multiline;
    const [fullScreenOpen, setFullScreenOpen] = useState(false);
    const [fullScreenValue, setFullScreenValue] = useState('');
    const [internalValue, setInternalValue] = useState<string>((restProps.value as string) ?? (restProps.defaultValue as string) ?? '');
    const userResizedHeightRef = useRef<number | null>(null);
    const isDraggingRef = useRef(false);
    const dragStartYRef = useRef(0);
    const dragStartHeightRef = useRef(0);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);
    const formControlRef = useRef<HTMLDivElement>(null);

    // Sync internalValue with prop value if controlled
    useLayoutEffect(() => {
        if (restProps.value !== undefined) {
            setInternalValue(restProps.value as string);
        }
    }, [restProps.value]);

    const handleInternalChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setInternalValue(e.target.value);
            restProps.onChange?.(e);
        },
        [restProps],
    );

    // Re-apply saved height whenever the textarea mounts / re-renders.
    // Using min-height + max-height locks the visual size so MUI's internal
    // auto-resize (which only sets style.height) cannot cause a visible flicker.
    useLayoutEffect(() => {
        if (!resizable || !isMultiline) return;
        if (userResizedHeightRef.current == null) return;

        const formEl = formControlRef.current;
        if (!formEl) return;

        const textareas = formEl.querySelectorAll('textarea');
        const textarea =
            textareas.length > 1 ? Array.from(textareas).find((ta) => ta.getAttribute('aria-hidden') !== 'true') : textareas[0];

        if (!textarea) return;

        const h = userResizedHeightRef.current;
        textarea.style.minHeight = `${h}px`;
        textarea.style.maxHeight = `${h}px`;
        textarea.style.height = `${h}px`;
        textarea.style.overflow = 'auto';
    });

    // Custom resize handle – pointer events for smooth full-width bottom drag
    useEffect(() => {
        if (!resizable || !isMultiline) return;

        const handle = resizeHandleRef.current;
        if (!handle) return;

        const getTextarea = () => {
            const formEl = formControlRef.current;
            if (!formEl) return null;
            const textareas = formEl.querySelectorAll('textarea');
            return textareas.length > 1
                ? Array.from(textareas).find((ta) => ta.getAttribute('aria-hidden') !== 'true') ?? null
                : textareas[0] ?? null;
        };

        const onPointerDown = (e: PointerEvent) => {
            const textarea = getTextarea();
            if (!textarea) return;

            e.preventDefault();
            handle.setPointerCapture(e.pointerId);

            isDraggingRef.current = true;
            dragStartYRef.current = e.clientY;
            dragStartHeightRef.current = textarea.getBoundingClientRect().height;
            textareaRef.current = textarea as HTMLTextAreaElement;

            // Lock all three so MUI's ResizeObserver can't override the visual height
            textarea.style.minHeight = `${dragStartHeightRef.current}px`;
            textarea.style.maxHeight = `${dragStartHeightRef.current}px`;
            textarea.style.height = `${dragStartHeightRef.current}px`;
            textarea.style.overflow = 'auto';
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDraggingRef.current) return;
            const textarea = textareaRef.current;
            if (!textarea) return;

            const delta = e.clientY - dragStartYRef.current;
            const newHeight = Math.max(60, dragStartHeightRef.current + delta);

            // Lock min/max alongside height — MUI's TextareaAutosize ResizeObserver
            // resets style.height to content height, but minHeight takes visual precedence.
            textarea.style.minHeight = `${newHeight}px`;
            textarea.style.maxHeight = `${newHeight}px`;
            textarea.style.height = `${newHeight}px`;
            textarea.style.overflow = 'auto';
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;

            const textarea = textareaRef.current;
            if (!textarea) return;

            const delta = e.clientY - dragStartYRef.current;
            const finalHeight = Math.max(60, dragStartHeightRef.current + delta);
            userResizedHeightRef.current = finalHeight;
            textarea.style.height = `${finalHeight}px`;
            textarea.style.overflow = 'auto';
        };

        handle.addEventListener('pointerdown', onPointerDown);
        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
        handle.addEventListener('pointercancel', onPointerUp);

        return () => {
            handle.removeEventListener('pointerdown', onPointerDown);
            handle.removeEventListener('pointermove', onPointerMove);
            handle.removeEventListener('pointerup', onPointerUp);
            handle.removeEventListener('pointercancel', onPointerUp);
        };
    }, [resizable, isMultiline]);

    const handleOpenFullScreen = useCallback(() => {
        setFullScreenValue(internalValue);
        setFullScreenOpen(true);
    }, [internalValue]);

    const handleCloseFullScreen = useCallback(async () => {
        setFullScreenOpen(false);
    }, []);

    const handleFullScreenChange = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            setFullScreenValue(newValue);
            setInternalValue(newValue);
            // Propagate changes back to the parent via the original onChange
            restProps.onChange?.(e as unknown as ChangeEvent<HTMLInputElement>);
        },
        [restProps],
    );

    return (
        <>
            <FormControl
                disabled={disabled}
                variant="standard"
                className={`${styles.container}`}
                sx={{
                    width: fullWidth ? '100%' : '240px',
                    '& .MuiInputLabel-root.Mui-disabled': {
                        color: 'var(--color-light-7)',
                    },
                    '& textarea': {
                        '&::-webkit-scrollbar': {
                            width: '7px !important',
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '10px',
                            backgroundColor: 'rgba(130, 130, 130, 0.7)',
                        },
                        '&::-webkit-scrollbar-corner': {
                            backgroundColor: 'transparent',
                        },
                        // Native resize disabled – we use the custom handle below
                        ...(resizable && isMultiline && { resize: 'none' }),
                    },
                    '& > div > .MuiInputBase-root': {
                        border: 'none',
                        borderRadius: '0',
                        letterSpacing: 0,
                    },
                    '& > div': {
                        overflow: 'visible',
                        border: bordered ? '1px solid var(--color-secondary-4)' : '0',
                        // When the resize handle is shown it forms the bottom edge, so drop
                        // the wrapper's bottom border to avoid a doubled line.
                        ...(resizable &&
                            isMultiline &&
                            !disabled &&
                            bordered && {
                                borderBottom: 'none',
                                borderRadius: '4px 4px 0 0',
                            }),
                        borderRadius: bordered ? '4px' : 0,
                        ...(!disabled && {
                            '&:hover': {
                                borderColor: 'var(--color-primary-1)',
                            },
                        }),
                        ...(disabled && {
                            background: 'var(--color-light-2)',
                        }),
                        ...(compact && { '& .MuiInputBase-input': { padding: 0 } }),
                        ...(error && {
                            borderColor: 'var(--color-danger-1)',
                            '&:hover': {
                                borderColor: 'var(--color-danger-1)',
                            },
                        }),
                    },

                    ...formControlSx,
                }}
                error={error}
                ref={(node: HTMLDivElement | null) => {
                    (formControlRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof containerRef === 'function') {
                        containerRef(node);
                    } else if (containerRef) {
                        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    }
                }}
            >
                {(label || description) && (
                    <FormLabel
                        label={label}
                        tooltip={tooltip}
                        tooltipSx={tooltipSx}
                        description={description}
                        labelProps={labelProps}
                        tooltipPlacement={tooltipPlacement}
                        tooltipPosition={tooltipPosition}
                    />
                )}
                <div style={{ position: 'relative' }}>
                    <Tooltip
                        disableHoverListener={!tooltip || tooltipPosition !== 'input'}
                        disableFocusListener
                        title={tooltip}
                        placement={tooltipPlacement}
                        sx={tooltipSx}
                        arrow
                    >
                        <Space size={0} {...containerSpaceProps}>
                            {prefix}
                            <Input
                                disabled={disabled}
                                inputRef={ref}
                                placeholder={placeholder}
                                type="text"
                                startAdornment={startAdornment}
                                endAdornment={
                                    endAdornment ? (
                                        endAdornment
                                    ) : onReset ? (
                                        <IconButton
                                            onClick={onReset}
                                            size="xs"
                                            type="secondary"
                                            variant="text"
                                            sx={{
                                                marginRight: '8px',
                                            }}
                                            disabled={disabled}
                                        >
                                            <Icon name="close" fontSize={20} />
                                        </IconButton>
                                    ) : undefined
                                }
                                {...restProps}
                                value={internalValue}
                                onChange={handleInternalChange}
                                sx={{
                                    ...(prefix && {
                                        flex: 1,
                                        '& .MuiInputBase-input': {
                                            paddingLeft: 0,
                                        },
                                    }),
                                    ...(suffix && {
                                        flex: 1,
                                        '& .MuiInputBase-input': {
                                            paddingRight: 0,
                                        },
                                    }),
                                    ...restProps.sx,
                                }}
                            />
                            {suffix}
                        </Space>
                    </Tooltip>
                    {expandable && isMultiline && !disabled && (
                        <Tooltip title="Expand" placement="top" arrow>
                            <IconButton
                                size="xs"
                                type="secondary"
                                variant="text"
                                onClick={handleOpenFullScreen}
                                sx={{
                                    position: 'absolute',
                                    left: '8px',
                                    bottom: '8px',
                                    zIndex: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                }}
                            >
                                <Icon name="fullScreen" style={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                {/* Custom full-width resize handle */}
                {resizable && isMultiline && !disabled && (
                    <div
                        ref={resizeHandleRef}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '12px',
                            cursor: 'ns-resize',
                            userSelect: 'none',
                            touchAction: 'none',
                            // Complete the border box: left, right, bottom sides
                            border: bordered ? '1px solid var(--color-secondary-4)' : '0',
                            borderTop: 'none',
                            background: 'var(--color-light-1, #f7f7f7)',
                            borderRadius: '0 0 4px 4px',
                            transition: 'background 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'var(--color-light-3, #ebebeb)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'var(--color-light-1, #f7f7f7)';
                        }}
                    >
                        {/* Three-line drag indicator centered */}
                        <svg
                            width="32"
                            height="6"
                            viewBox="0 0 32 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ pointerEvents: 'none', opacity: 0.45 }}
                        >
                            <rect y="0" width="32" height="1.5" rx="1" fill="currentColor" />
                            <rect y="2.25" width="32" height="1.5" rx="1" fill="currentColor" />
                            <rect y="4.5" width="32" height="1.5" rx="1" fill="currentColor" />
                        </svg>
                    </div>
                )}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>

            {/* Expanded Edit Modal */}
            {expandable && isMultiline && (
                <Modal
                    open={fullScreenOpen}
                    onClose={handleCloseFullScreen}
                    backdropClosable
                    onBackdropClose={handleCloseFullScreen}
                    title={label || 'Edit Content'}
                    closeIcon="fullScreenExit"
                    paperSx={{
                        width: '100%',
                        maxWidth: '1200px',
                        height: '80vh',
                    }}
                >
                    <textarea
                        value={fullScreenValue}
                        onChange={handleFullScreenChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            padding: '16px',
                            fontSize: '14px',
                            lineHeight: '22px',
                            fontFamily: 'inherit',
                            color: 'var(--color-light-7)',
                            backgroundColor: 'transparent',
                            boxSizing: 'border-box',
                        }}
                    />
                </Modal>
            )}
        </>
    );
};

export const FieldText = forwardRef<HTMLInputElement, FieldTextProps>(TextComponent);
