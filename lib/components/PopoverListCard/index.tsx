import 'simplebar-react/dist/simplebar.min.css';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable as pragmaticDaDDraggable,
    dropTargetForElements,
    monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import type { PopoverProps, SxProps, Theme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ForwardedRef, ReactNode, Ref } from 'react';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import invariant from 'tiny-invariant';

import { DropdownMenuItem } from '../Dropdown';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Search } from '../Search';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';
import styles from './index.module.scss';

declare module 'react' {
    function forwardRef<T, P = object>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
type State = { type: 'idle' } | { type: 'preview'; container: HTMLElement; rect?: DOMRect } | { type: 'dragging' };

const idleState: State = { type: 'idle' };
const draggingState: State = { type: 'dragging' };

interface CustomMenuItemProps {
    id: string;
    index: number;
    selected?: boolean;
    text: string;
    onSelect?: (id: string) => void;
    extra?: (visible: boolean) => ReactNode;
    description?: string;
    draggable?: boolean;
    instanceId: symbol;
}

const CustomMenuItem = ({ id, selected, index, text, onSelect, extra, description, draggable = true, instanceId }: CustomMenuItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const extraRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLButtonElement>(null);
    const [state, setState] = useState<State>(idleState);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [visible, setVisible] = useState(false);
    const [buttonGroupWidth, setButtonGroupWidth] = useState(8);

    useEffect(() => {
        setButtonGroupWidth((extraRef?.current?.getBoundingClientRect().width ?? 0) + 8);
    }, [visible]);

    useEffect(() => {
        if (draggable) {
            const dragElement = dragHandleRef.current;
            const dropTargetElement = containerRef.current;
            invariant(dragElement);
            invariant(dropTargetElement);
            return combine(
                pragmaticDaDDraggable({
                    element: dragElement,
                    getInitialData: () => ({ itemId: index, instanceId }),
                    onGenerateDragPreview: ({ location, nativeSetDragImage }) => {
                        const rect = containerRef.current?.getBoundingClientRect();

                        setCustomNativeDragPreview({
                            nativeSetDragImage,
                            getOffset: () => ({
                                x: location.current.input.clientX - (rect?.left ?? 0),
                                y: location.current.input.clientY - (rect?.top ?? 0),
                            }),
                            render({ container }) {
                                setState({ type: 'preview', container, rect });
                                return () => setState(draggingState);
                            },
                        });
                    },

                    onDragStart: () => setState(draggingState),
                    onDrop: () => setState(idleState),
                }),
                dropTargetForElements({
                    element: dropTargetElement,
                    canDrop: ({ source }) => {
                        return source.data.instanceId === instanceId;
                    },
                    getIsSticky: () => true,
                    getData: ({ input, element }) => {
                        const data = { itemId: index };

                        return attachClosestEdge(data, {
                            input,
                            element,
                            allowedEdges: ['top', 'bottom'],
                        });
                    },
                    onDragEnter: (args) => {
                        if (args.source.data.itemId !== index) {
                            setClosestEdge(extractClosestEdge(args.self.data));
                        }
                    },
                    onDrag: ({ self, source }) => {
                        if (source.data.itemId !== index) {
                            setClosestEdge(extractClosestEdge(self.data));
                        }
                    },
                    onDragLeave: () => {
                        setClosestEdge(null);
                    },
                    onDrop: () => {
                        setClosestEdge(null);
                    },
                }),
            );
        }
    }, [instanceId, index, draggable]);

    useEffect(() => {
        if (selected) {
            containerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selected]);

    return (
        <>
            <div
                ref={containerRef}
                className={styles.listItem}
                onMouseEnter={() => {
                    setVisible(true);
                }}
                onMouseLeave={() => {
                    setVisible(false);
                }}
            >
                {closestEdge === 'top' && (
                    <div style={{ position: 'relative', width: 'calc(100% - 12px)', left: '12px' }}>
                        <DropIndicator edge="top" gap={'0px'} />
                    </div>
                )}
                <DropdownMenuItem
                    selected={selected}
                    onClick={() => {
                        onSelect?.(id);
                    }}
                >
                    <div
                        style={{
                            width: `calc(100% - ${buttonGroupWidth}px)`,
                            textAlign: 'left',
                        }}
                    >
                        <Space size={4}>
                            <EllipsisText text={text} />
                            {description && (
                                <Tooltip title={description} placement="top" arrow>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon name="info" style={{ fontSize: '16px', color: 'var(--color-light-4)' }} />
                                    </div>
                                </Tooltip>
                            )}
                        </Space>
                    </div>
                </DropdownMenuItem>
                <Space size={8} containerRef={extraRef} className={styles.iconContainer}>
                    {extra?.(visible)}
                    {draggable && (
                        <IconButton
                            type="secondary"
                            variant="text"
                            size="xs"
                            sx={{
                                display: visible ? 'inline-flex' : 'none',
                            }}
                            ref={dragHandleRef}
                        >
                            <Icon name="dragAndDropHandle" fontSize={20} />
                        </IconButton>
                    )}
                </Space>

                {closestEdge === 'bottom' && (
                    <div style={{ position: 'relative', width: 'calc(100% - 12px)', left: '12px' }}>
                        <DropIndicator edge="bottom" gap={'0px'} />
                    </div>
                )}
            </div>
            {state.type === 'preview' &&
                createPortal(
                    <div
                        style={{
                            boxSizing: 'border-box',
                            width: state.rect?.width,
                            height: state.rect?.height,
                        }}
                    >
                        <div
                            className={styles.listItem}
                            style={{
                                background: 'white',
                            }}
                        >
                            <DropdownMenuItem selected={selected}>
                                <div
                                    style={{
                                        width: `calc(100% - ${buttonGroupWidth}px)`,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Space size={4}>
                                        <EllipsisText text={text} />
                                        {description && (
                                            <Tooltip title={description} placement="top" arrow>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Icon name="info" style={{ fontSize: '16px', color: 'var(--color-light-4)' }} />
                                                </div>
                                            </Tooltip>
                                        )}
                                    </Space>
                                </div>
                            </DropdownMenuItem>
                        </div>
                    </div>,
                    state.container,
                )}
        </>
    );
};

type ListData<D> = { data: D[]; options: PopoverListCardOption[] };

interface BaseProps<D, Q extends QueryKey = QueryKey, TQueryFnData = ListData<D>, TData = ListData<D>> {
    /**
     * Toggle Element
     * @param object.open whether current popover is open
     * @param object.onToggle toggle popover open/close
     * @returns
     */
    toggleElement?: ({ open, onToggle }: { open?: boolean; onToggle: (element: HTMLElement | null) => void }) => ReactNode;
    /**
     * footer element
     */
    footer?: () => ReactNode;
    onSelect?: (id: string, item?: D) => void;
    /**
     * draggable
     */
    draggable?: boolean;
    /**
     * List search control
     */
    searchable?: boolean;
    /**
     * onSearch
     */
    onSearch?: (search?: string) => void;
    /**
     * onSort
     */
    onSort?: (newOptions: PopoverListCardOption[]) => Promise<void>;

    /**
     * Popover props
     */
    popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>;
    /**
     * selected item
     */
    selected?: string;
    /**
     * close popover card on select
     */
    closeOnSelect?: boolean;
    /**
     * Empty text
     */
    emptyText?: string;
    paperSx?: SxProps<Theme>;
    queryKey: Q;
    request: QueryFunction<TQueryFnData, Q>;
    querySelect?: (data: TQueryFnData) => TData;
}
export type PopoverListCardProps<D, Q extends QueryKey = QueryKey, TQueryFnData = ListData<D>, TData = ListData<D>> = BaseProps<
    D,
    Q,
    TQueryFnData,
    TData
>;
export interface PopoverListCardOption {
    text: string;
    id: string;
    extra?: (visible: boolean) => ReactNode;
    description?: string;
    draggable?: boolean;
}
export interface PopoverListCardRef {
    refresh: () => void;
    close: () => void;
}

const Component = <D extends { id: string }, Q extends QueryKey = QueryKey, TQueryFnData = ListData<D>, TData = ListData<D>>(
    props: PopoverListCardProps<D, Q, TQueryFnData, TData>,
    ref: ForwardedRef<PopoverListCardRef>,
) => {
    const {
        toggleElement,
        onSelect,
        onSearch,
        onSort,
        draggable = true,
        searchable,
        footer,
        popoverProps,
        selected,
        closeOnSelect = false,
        emptyText,
        paperSx,
        queryKey,
    } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [instanceId] = useState(() => Symbol('instance-id'));
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [search, setSearch] = useState<string>();
    const { t } = useTranslation();
    const open = Boolean(anchorEl);
    const scrollableNodeRef = useRef<HTMLDivElement>(null);
    const request = useMemo(() => ('request' in props ? props.request : undefined), [props]);

    const {
        data: response,
        refetch,
        isFetching,
    } = useQuery({
        queryKey,
        // initialData: { data: [], options: [] },
        enabled: !!request,
        ...('request' in props && {
            queryFn: props.request,
            select: props.querySelect,
        }),
    });

    const listData = useMemo(
        () =>
            response
                ? {
                      data: (response as unknown as ListData<D>).data || [],
                      options: (response as unknown as ListData<D>).options || [],
                  }
                : { data: [], options: [] },
        [response],
    );

    const reorder = useCallback(
        async ({ startIndex, finishIndex }: { startIndex: number; finishIndex: number }) => {
            const newOptions = [...listData.options];
            newOptions.splice(finishIndex, 0, newOptions.splice(startIndex, 1)[0]);

            await onSort?.(newOptions);
            await refetch();
        },
        [listData.options, onSort, refetch],
    );

    useEffect(() => {
        return combine(
            monitorForElements({
                canMonitor({ source }) {
                    return source.data.instanceId === instanceId;
                },
                onDrop(args) {
                    const { location, source } = args;
                    // didn't drop on anything
                    if (!location.current.dropTargets.length) {
                        return;
                    }

                    const itemId = source.data.itemId;
                    invariant(typeof itemId === 'number');
                    const itemIndex = listData.options.findIndex((item, index) => index === itemId);

                    if (location.current.dropTargets.length === 1) {
                        const [destinationItem] = location.current.dropTargets;
                        const indexOfTarget = listData.options.findIndex((item, index) => index === destinationItem.data.itemId);
                        const closestEdgeOfTarget: Edge | null = extractClosestEdge(destinationItem.data);
                        const destinationIndex = getReorderDestinationIndex({
                            startIndex: itemIndex,
                            indexOfTarget: indexOfTarget,
                            closestEdgeOfTarget: closestEdgeOfTarget,
                            axis: 'vertical',
                        });
                        reorder({
                            startIndex: itemIndex,
                            finishIndex: destinationIndex,
                        });

                        return;
                    }
                },
            }),
        );
    }, [listData, instanceId, reorder]);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            refetch();
        },
        close: () => {
            setAnchorEl(null);
        },
    }));

    useEffect(() => {
        if (!searchable) {
            setSearch(undefined);
        }
    }, [searchable]);

    useEffect(() => {
        if (open) {
            setSearch(undefined);
        }
    }, [open]);

    const options = useMemo(
        () =>
            listData.options
                .filter((option) => (searchable && search ? option.text.toLowerCase().indexOf(search.toLowerCase()) !== -1 : true))
                .map((option, index) => (
                    <CustomMenuItem
                        key={option.id}
                        index={index}
                        id={option.id}
                        text={option.text}
                        onSelect={(id) => {
                            onSelect?.(
                                id,
                                listData.data.find((item) => item.id === id),
                            );
                            if (closeOnSelect) {
                                setAnchorEl(null);
                            }
                        }}
                        selected={selected === option.id}
                        extra={option.extra}
                        description={option.description}
                        draggable={draggable && option.draggable}
                        instanceId={instanceId}
                    />
                )),
        [searchable, search, listData, closeOnSelect, setAnchorEl, onSelect, selected, draggable, instanceId],
    );

    return (
        <>
            {toggleElement ? (
                toggleElement({
                    open,
                    onToggle: (element: HTMLElement | null) => {
                        setAnchorEl((prev) => (prev ? null : element));
                    },
                })
            ) : (
                <IconButton
                    size="s"
                    onClick={(event) => {
                        setAnchorEl((prev) => (prev ? null : event.currentTarget));
                    }}
                    variant="text"
                    type="secondary"
                >
                    <Icon name={open ? 'expandLess' : 'expandMore'} />
                </IconButton>
            )}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableEnforceFocus
                slotProps={{
                    paper: {
                        sx: {
                            overflow: 'hidden',
                            padding: '12px 0',
                            paddingTop: '8px',
                            width: '436px',
                            marginTop: '4px',
                            boxShadow: '0px 2px 24px 0px #E0E0E033, 0px 4px 8px 0px #BDBDBD14',
                            ...paperSx,
                        },
                    },
                }}
                {...popoverProps}
            >
                {searchable && (
                    <>
                        <div style={{ padding: '0 12px', paddingBottom: '12px' }}>
                            <Search
                                fullWidth
                                placeholder={t('search')}
                                onSearch={(value) => {
                                    setSearch(value);
                                    onSearch?.(value);
                                }}
                            />
                        </div>
                        <Divider />
                    </>
                )}
                <div className={styles.contentContainer}>
                    <SimpleBar
                        autoHide
                        style={{ maxHeight: 280, minHeight: isFetching ? 40 : 0 }}
                        scrollableNodeProps={{ ref: scrollableNodeRef }}
                    >
                        <div ref={containerRef} style={{ paddingTop: '4px' }} className={isFetching ? styles.blur : ''}>
                            {options.length === 0 && (
                                <DropdownMenuItem disabled>
                                    <Typography style={{ color: 'var(--color-light-5)', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                                        {emptyText || t('no_additional_option')}
                                    </Typography>
                                </DropdownMenuItem>
                            )}

                            {options}
                        </div>
                    </SimpleBar>

                    {isFetching && (
                        <div className={styles.loadingContainer}>
                            <CircularProgress size={25} />
                        </div>
                    )}
                </div>
                {footer && (
                    <>
                        <Divider />
                        <div>{footer()}</div>
                    </>
                )}
            </Popover>
        </>
    );
};

export const PopoverListCard = React.forwardRef(Component);
