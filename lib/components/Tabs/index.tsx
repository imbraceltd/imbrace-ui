import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import type { TabProps as MuiTabProps } from '@mui/material/Tab';
import MuiTab from '@mui/material/Tab';
import type { TabsProps as MuiTabsProps } from '@mui/material/Tabs';
import MuiTabs from '@mui/material/Tabs';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ForwardedRef, MouseEvent } from 'react';
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';

import type { DividerOptionType, DropdownOption } from '../Dropdown';
import { DividerOption, DropdownMenu, DropdownMenuItem } from '../Dropdown';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';
import TabsSkeleton from './TabsSkeleton';

declare module 'react' {
    function forwardRef<T, P = object>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export const Tab = styled(MuiTab)({
    fontWeight: '600',
    fontSize: '1rem',
    textTransform: 'none',
    padding: '8px 12px',
    minHeight: 'auto',
    height: '40px',
    minWidth: 'auto',
    lineHeight: '23px',
    color: 'var(--color-secondary-3)',
    display: 'flex',
    flexDirection: 'row',
    '& .MuiTab-iconWrapper': {
        marginRight: '8px',
    },
    '& svg': {
        height: '100%',
        margin: 'auto 0',
        fontSize: 24,
    },
    '&:hover': {
        color: 'var(--color-primary-6)',
    },
    '&.Mui-selected': {
        color: 'var(--color-primary-1)',
    },
});

export const StyledTabs = styled(MuiTabs)(({ theme }) => ({
    minHeight: 'auto',
    '& .MuiTabScrollButton-root': {
        transition: theme.transitions.create(['width']),
        width: '32px',
        '& svg': {
            color: 'var(--color-light-4)',
            fontSize: 24,
        },
        '&.Mui-disabled': {
            width: 0,
        },
    },
    '& .MuiTabs-scrollButtons.Mui-disabled': {
        display: 'none',
    },
}));

interface Option extends DropdownOption<string> {
    index: string;
    handler?: () => void;
}

export interface TabProps extends Omit<MuiTabProps, 'icon'> {
    description?: string;
    icon?: (handleOpen: (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void) => JSX.Element;

    menuOptions?: (Option | DividerOptionType)[];
    selected?: boolean;
}

export interface DividerTabType {
    type: 'divider';
}

export type TabType = TabProps | DividerTabType;

interface General extends Omit<MuiTabsProps, 'ref'> {
    currentTab?: string | number;
    loading?: boolean;
}

interface StaticTabs extends General {
    tabs: TabType[];
}

interface RemoteTabs<Q extends QueryKey = QueryKey, TQueryFnData = TabType[], TData = TabType[]> extends General {
    queryKey: Q;
    request: QueryFunction<TQueryFnData, Q>;
    querySelect?: (data: TQueryFnData) => TData;
}

export const CustomTab = ({ label, description, icon, menuOptions, ...props }: TabProps) => {
    const linkTabRef = useRef<HTMLDivElement>(null);
    const [contextMenu, setContextMenu] = useState<boolean>(false);

    const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu((prev) => !prev);
    }, []);

    const handleClose = () => {
        setContextMenu(false);
    };

    const renderIcon = (handleOpen: (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void) =>
        icon ? <>{icon(handleOpen)}</> : undefined;

    const renderContextMenu = () => {
        if (!menuOptions) {
            return null;
        }
        return (
            <DropdownMenu
                open={contextMenu}
                onClose={handleClose}
                disableAutoFocusItem
                anchorEl={linkTabRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableEnforceFocus
            >
                {menuOptions?.map((option, index) => {
                    if ('type' in option) {
                        return (
                            <div key={`divider-${index}`} style={{ padding: '8px 12px' }}>
                                <DividerOption fullWidth={option.fullWidth} key={`divider-${index}`} />
                            </div>
                        );
                    }
                    return (
                        <Tooltip
                            key={`menu-${index}`}
                            placement={'bottom'}
                            disableHoverListener={!option.tooltip}
                            disableFocusListener
                            disableTouchListener
                            arrow
                            title={option.tooltip}
                        >
                            <div>
                                <DropdownMenuItem
                                    sx={option.sx}
                                    color={option.textColor}
                                    disabled={option.disabled || option.loading}
                                    onClick={option.handler}
                                >
                                    {option.loading && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CircularProgress size={16} />
                                        </div>
                                    )}
                                    {option.text && (
                                        <EllipsisText element={<Typography {...option.typographyProps} />} text={option.text} />
                                    )}
                                </DropdownMenuItem>
                            </div>
                        </Tooltip>
                    );
                })}
            </DropdownMenu>
        );
    };

    return (
        <div onContextMenu={menuOptions ? handleContextMenu : undefined}>
            <Tab
                ref={linkTabRef}
                label={
                    <Space size={6}>
                        <Tooltip
                            placement={'bottom'}
                            disableFocusListener
                            disableTouchListener
                            arrow
                            title={props.selected ? '' : description}
                        >
                            <div>
                                <Typography
                                    variant="SubHeading2"
                                    style={{
                                        width: '100%',
                                        color: 'inherit',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'break-word',
                                        transition: 'none',
                                    }}
                                >
                                    {label}
                                </Typography>
                            </div>
                        </Tooltip>

                        <Box
                            className="descContainer"
                            sx={{
                                display: 'none',
                            }}
                        >
                            {description && (
                                <Tooltip title={description} placement="bottom">
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon
                                            name="info"
                                            style={{
                                                fontSize: '16px',
                                                color: 'var(--color-light-4)',
                                            }}
                                        />
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    </Space>
                }
                sx={{
                    '&.Mui-selected': {
                        '& .MuiLoadingButton-root': {
                            display: 'flex',
                        },
                        '& .descContainer': {
                            display: !!description ? 'flex' : 'none',
                        },
                    },
                    '& .MuiLoadingButton-root': {
                        display: 'none',
                    },
                }}
                icon={renderIcon(handleContextMenu)}
                disableRipple={props.selected}
                {...props}
            />
            {renderContextMenu()}
        </div>
    );
};
export type TabsProps<Q extends QueryKey = QueryKey, TQueryFnData = TabType[], TData = TabType[]> =
    | StaticTabs
    | RemoteTabs<Q, TQueryFnData, TData>;

export type TabsRef = {
    refresh: () => void;
};

const Component = <Q extends QueryKey = QueryKey, TQueryFnData = TabType[], TData = TabType[]>(
    props: TabsProps<Q, TQueryFnData, TData>,
    ref: ForwardedRef<TabsRef>,
) => {
    const { currentTab, onChange, loading, ...restProps } = props;

    const { data, isFetching, refetch } = useQuery({
        queryKey: 'queryKey' in restProps ? restProps.queryKey : (['imbraceTabs'] as unknown as Q),

        initialData: [] as TQueryFnData,

        enabled: 'request' in restProps,
        ...('request' in restProps && {
            queryFn: restProps.request,
            select: restProps.querySelect,
        }),
    });

    const tabs = 'request' in restProps ? (Array.isArray(data) ? data : []) : restProps.tabs;

    const tabsProps = useMemo(() => {
        if ('request' in restProps) {
            const { request, queryKey, querySelect, ...exceptRequestProps } = restProps;

            return exceptRequestProps;
        }
        delete (restProps as Partial<StaticTabs>).tabs;
        return restProps;
    }, [restProps]);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            refetch();
        },
    }));

    if (isFetching || loading) {
        return <TabsSkeleton />;
    }

    return (
        <StyledTabs
            value={currentTab}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="auto"
            {...tabsProps}
            ScrollButtonComponent={(buttonProps) => {
                return (
                    <IconButton
                        disableRipple
                        sx={{
                            borderRadius: 0,
                            opacity: 1,
                            background: 'rgba(255,255,255, 0.24)',
                            '& svg': { color: 'var(--color-light-4)' },
                        }}
                        type="secondary"
                        variant="text"
                        {...buttonProps}
                    >
                        <Icon
                            name={buttonProps.direction === 'left' ? 'chevronLeft' : 'chevronRight'}
                            style={{ fontSize: 24, cursor: 'pointer' }}
                        />
                    </IconButton>
                );
            }}
        >
            {tabs.map((tab, index) => {
                if ('type' in tab && tab.type === 'divider') {
                    return <Divider key={`Tab-divider-${index}`} orientation="vertical" variant="middle" flexItem />;
                }
                return <CustomTab key={`Tab-${index}`} {...(tab as TabProps)} />;
            })}
        </StyledTabs>
    );
};

export const Tabs = React.forwardRef(Component);
