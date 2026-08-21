import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import type { EllipsisTextProps } from '../EllipsisText';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import type { SpaceProps } from '../Space';
import { Space } from '../Space';
import type { TypographyProps } from '../Typography';
import { Typography } from '../Typography';
import styles from './index.module.scss';

interface CommonProps {
    copyValue: string;
    copyText?: string;
    copyIcon?: ReactNode;
    copiedText?: string;
    copiedIcon?: ReactNode;
    iconOnly?: boolean;
}

export interface CopyButtonProps extends CommonProps {
    buttonSx?: ButtonProps['sx'];
}

export const CopyButton = ({ copyValue, copiedIcon, iconOnly, copiedText, copyIcon, copyText, buttonSx }: CopyButtonProps) => {
    const [toggle, setToggle] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (toggle) {
            timer = setTimeout(() => {
                setToggle(false);
            }, 2000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [toggle]);

    const onClick = async (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.currentTarget.blur();
            setToggle(true);
            await navigator.clipboard.writeText(copyValue);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button
            variant="text"
            size="xs"
            sx={{
                fontWeight: 400,
                textTransform: 'initial',
                whiteSpace: 'nowrap',
                ...buttonSx,
            }}
            startIcon={toggle ? copiedIcon || <Icon name="codeCopied" /> : copyIcon || <Icon name="copy" />}
            text={iconOnly ? '' : toggle ? copiedText || t('copied') : copyText || t('copy')}
            onClick={onClick}
        />
    );
};

export interface CopyTextProps extends CommonProps {
    typographyProps?: TypographyProps;
}

export const CopyText = ({ copyValue, copiedIcon, iconOnly, copiedText, copyIcon, copyText, typographyProps }: CopyTextProps) => {
    const [toggle, setToggle] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (toggle) {
            timer = setTimeout(() => {
                setToggle(false);
            }, 2000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [toggle]);

    const onClick = async (e: ReactMouseEvent<HTMLHeadingElement | HTMLParagraphElement, MouseEvent>) => {
        try {
            e.currentTarget.blur();
            setToggle(true);
            await navigator.clipboard.writeText(copyValue);
        } catch (error) {
            console.log(error);
        }
    };
    if (iconOnly) {
        return (
            <Typography {...typographyProps} style={{ cursor: 'pointer', ...typographyProps?.style }} onClick={onClick}>
                {toggle ? copiedIcon || <Icon name="codeCopied" /> : copyIcon || <Icon name="copy" />}
            </Typography>
        );
    }

    return (
        <Typography {...typographyProps} style={{ cursor: 'pointer', ...typographyProps?.style }} onClick={onClick}>
            {toggle ? copiedText || t('copied') : copyText || t('copy')}
        </Typography>
    );
};
export interface CopyProps extends CommonProps {
    displayText: string;
    containerClassName?: string;
    typographyProps?: TypographyProps;
    spaceProps?: Omit<SpaceProps, 'children' | 'className'>;
    ellipsisTextProps?: Omit<EllipsisTextProps, 'className' | 'text' | 'element'>;
}

export const Copy = ({
    displayText,
    copyValue,
    copyText,
    copiedText,
    containerClassName,
    copyIcon,
    copiedIcon,
    iconOnly,
    typographyProps,
    spaceProps,
    ellipsisTextProps,
}: CopyProps) => {
    const [toggle, setToggle] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (toggle) {
            timer = setTimeout(() => {
                setToggle(false);
            }, 2000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [toggle]);

    const onClick = async (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.currentTarget.blur();
            setToggle(true);
            await navigator.clipboard.writeText(copyValue);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Space size={12} className={`${styles.container} ${containerClassName || ''}`} {...spaceProps}>
            <EllipsisText element={<Typography {...typographyProps} />} text={displayText} {...ellipsisTextProps} />
            <div>
                <Button
                    variant="text"
                    size="xs"
                    sx={{
                        fontWeight: 400,
                        textTransform: 'initial',
                        whiteSpace: 'nowrap',
                    }}
                    startIcon={toggle ? copiedIcon || <Icon name="codeCopied" /> : copyIcon || <Icon name="copy" />}
                    text={iconOnly ? '' : toggle ? copiedText || t('copied') : copyText || t('copy')}
                    onClick={onClick}
                />
            </div>
        </Space>
    );
};
