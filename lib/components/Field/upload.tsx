import FormControl from '@mui/material/FormControl';
import type { RefObject } from 'react';
import { forwardRef } from 'react';

import { Space } from '../Space';
import { Upload } from '../Upload';
import type { InputUploadRef } from '../Upload/inputUpload';
import type { UploadProps } from '../Upload/types';
import type { FieldBaseProps } from '.';
import { FormLabel } from '.';
import { FormHelperText } from '.';
import styles from './index.module.scss';

interface UploadBaseProps extends Omit<FieldBaseProps, 'tooltipPosition'> {
    disabled?: boolean;
    containerRef?: RefObject<HTMLDivElement>;
}

export type FieldUploadProps = UploadBaseProps & UploadProps;

export const FieldUpload = forwardRef<HTMLInputElement | InputUploadRef, FieldUploadProps>((props, ref) => {
    const {
        label,
        error,
        helperText,
        description,
        formControlSx,
        disabled,
        tooltip,
        tooltipSx,
        labelProps,
        containerRef,
        readOnly,
        tooltipPlacement,
        ...restProps
    } = props;

    return (
        <FormControl
            disabled={disabled}
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: '100%',

                ...(readOnly && {
                    pointerEvents: 'none',
                }),

                ...formControlSx,
            }}
            error={error}
            ref={containerRef}
        >
            {restProps.type === 'avatar' ? (
                <>
                    <Space size={24} align="start">
                        <Upload {...restProps} ref={ref} disabled={disabled} />
                        <Space size={0} direction="vertical" align="stretch" justify="stretch">
                            {label && (
                                <FormLabel
                                    label={label}
                                    tooltip={tooltip}
                                    tooltipSx={tooltipSx}
                                    description={description}
                                    labelProps={labelProps}
                                    tooltipPlacement={tooltipPlacement}
                                />
                            )}
                            {helperText && <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>}
                        </Space>
                    </Space>
                </>
            ) : restProps.type === 'input' ? (
                <>
                    {label && (
                        <FormLabel
                            label={label}
                            tooltip={tooltip}
                            tooltipSx={tooltipSx}
                            description={description}
                            labelProps={labelProps}
                            tooltipPlacement={tooltipPlacement}
                        />
                    )}
                    <Upload {...restProps} ref={ref} disabled={disabled}></Upload>
                    {helperText && <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>}
                </>
            ) : (
                <>
                    {label && (
                        <FormLabel
                            label={label}
                            tooltip={tooltip}
                            tooltipSx={tooltipSx}
                            description={description}
                            labelProps={labelProps}
                            tooltipPlacement={tooltipPlacement}
                        />
                    )}

                    <Upload {...restProps} ref={ref} disabled={disabled}>
                        {helperText && <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>}
                    </Upload>
                </>
            )}
        </FormControl>
    );
});
