import FormControl from '@mui/material/FormControl';
import type { RefObject } from 'react';
import { forwardRef } from 'react';

import type { TextEditorProps } from '../TextEditor';
import { TextEditor } from '../TextEditor';
import type { FieldBaseProps } from '.';
import { FormHelperText, FormLabel } from '.';
import styles from './index.module.scss';

export interface FieldTextEditorProps extends FieldBaseProps, TextEditorProps {
    bordered?: boolean;
    disabled?: boolean;
    containerRef?: RefObject<HTMLDivElement>;
}

export const FieldTextEditor = forwardRef<HTMLInputElement, FieldTextEditorProps>((props) => {
    const { label, error, helperText, description, formControlSx, disabled, tooltip, tooltipSx, labelProps, containerRef, ...restProps } =
        props;

    return (
        <FormControl
            disabled={disabled}
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: '100%',
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
                },
                '& .MuiInputBase-root': {
                    border: 'none',
                    borderRadius: '0',
                    letterSpacing: 0,
                },
                '&  div.textEditorContainer': {
                    overflow: 'hidden',
                    border: '1px solid var(--color-secondary-4)',
                    borderRadius: '4px',
                    ...(!disabled && {
                        '&:hover': {
                            borderColor: 'var(--color-primary-1)',
                        },
                    }),

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
            ref={containerRef}
        >
            {label && <FormLabel label={label} tooltip={tooltip} tooltipSx={tooltipSx} description={description} labelProps={labelProps} />}

            <TextEditor {...restProps} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
});
