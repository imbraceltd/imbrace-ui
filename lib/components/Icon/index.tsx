import { Provider as UniqueIdGeneratorProvider } from '@inline-svg-unique-id/react';
import styled from '@mui/material/styles/styled';
import type { ComponentType, SVGProps } from 'react';
import { lazy, Suspense, useId, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { channelIconMapping, fileIconMapping, generalIconMapping, twoToneIconMapping, workflowIconMapping, integrationIconMapping } from './constant';
import styles from './index.module.scss';

export type IconNamespace = 'general' | 'channel' | 'workflow' | 'twoTone' | 'file' | 'integration';

export interface GeneralIconTypes extends SVGProps<SVGSVGElement> {
    namespace?: 'general';
    name: keyof typeof generalIconMapping;
}
export interface WorkflowIconTypes extends SVGProps<SVGSVGElement> {
    name: keyof typeof workflowIconMapping;
    namespace: 'workflow';
}
export interface ChannelIconTypes extends SVGProps<SVGSVGElement> {
    name: keyof typeof channelIconMapping;
    namespace: 'channel';
    inactive?: boolean;
    inactiveColor?: string;
}
export interface TwoToneIconTypes extends SVGProps<SVGSVGElement> {
    name: keyof typeof twoToneIconMapping;
    namespace: 'twoTone';
    primaryColor?: string;
    secondaryColor?: string;
}
export interface FileIconTypes extends SVGProps<SVGSVGElement> {
    name: keyof typeof fileIconMapping;
    namespace: 'file';
}
export interface IntegrationIconTypes extends SVGProps<SVGSVGElement> {
    name: keyof typeof integrationIconMapping;
    namespace: 'file';
}


export type IconProps = GeneralIconTypes | WorkflowIconTypes | ChannelIconTypes | TwoToneIconTypes | FileIconTypes | IntegrationIconTypes;

interface StyledIconProps extends SVGProps<SVGSVGElement> {
    iconName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    inactive?: boolean;
    inactiveColor?: string;
}

const withStyledIcon = (Component: ComponentType<StyledIconProps>) =>
    styled(Component, {
        shouldForwardProp: (propName) =>
            propName !== 'primaryColor' &&
            propName !== 'secondaryColor' &&
            propName !== 'iconName' &&
            propName !== 'inactive' &&
            propName !== 'inactiveColor',
    })<StyledIconProps>(({ theme, primaryColor, secondaryColor, iconName, inactiveColor }) => ({
        width: '1em',
        height: '1em',
        transition: theme.transitions.create(['color']),
        ...(primaryColor &&
            secondaryColor && {
                [`.${iconName}__first_tone`]: {
                    color: primaryColor,
                },
                [`.${iconName}__second_tone`]: {
                    color: secondaryColor,
                },
            }),
        '--channel-inactive-color': inactiveColor ?? 'var(--color-light-3)',
    }));

const EmptySVG = (props: StyledIconProps) => <svg viewBox="0 0 24 24" {...props} />;

export const Empty = styled<ComponentType<StyledIconProps>>(EmptySVG, {
    shouldForwardProp: (propName) =>
        propName !== 'primaryColor' &&
        propName !== 'secondaryColor' &&
        propName !== 'iconName' &&
        propName !== 'inactive' &&
        propName !== 'inactiveColor',
})(() => ({
    fill: 'currentColor',
    width: '1em',
    height: '1em',
}));

const importIcon = (namespace: IconNamespace, iconName: IconProps['name']) => {
    let LazyIcon = lazy(async () => ({ default: () => null }));
    switch (namespace) {
        case 'channel':
            LazyIcon = lazy(() => import(`./assets/channel/${channelIconMapping[iconName as ChannelIconTypes['name']]}.svg?react`));
            break;
        case 'workflow':
            LazyIcon = lazy(() => import(`./assets/workflow/${workflowIconMapping[iconName as WorkflowIconTypes['name']]}.svg?react`));
            break;
        case 'file':
            LazyIcon = lazy(() => import(`./assets/file/${fileIconMapping[iconName as FileIconTypes['name']]}.svg?react`));
            break;
        case 'twoTone':
            LazyIcon = lazy(() => import(`./assets/twoTone/${twoToneIconMapping[iconName as TwoToneIconTypes['name']]}.svg?react`));
            break;
        case 'integration':
            LazyIcon = lazy(() => import(`./assets/integration/${integrationIconMapping[iconName as IntegrationIconTypes['name']]}.svg?react`));
            break;
        case 'general':
        default:
            LazyIcon = lazy(() => import(`./assets/general/${generalIconMapping[iconName as GeneralIconTypes['name']]}.svg?react`));
            break;
    }

    try {
        const StyledComponent = withStyledIcon(LazyIcon);
        return StyledComponent;
    } catch (error) {
        console.log(error);
        console.error(`Icon ${iconName} in namespace ${namespace} not found`);
        return () => null;
    }
};

export const Icon = (props: IconProps) => {
    const { name, namespace = 'general', ...restProps } = props;
    const id = useId();
    let extraProps = {};
    if (namespace === 'channel') {
        const channelProps = restProps as ChannelIconTypes;
        extraProps = {
            inactive: channelProps.inactive,
            className: channelProps.inactive
                ? `${styles.disabled} ${styles[name]} ${channelProps.className ? channelProps.className : ''}`
                : channelProps.className,
        };
    }
    if (namespace === 'twoTone') {
        const twoToneProps = restProps as TwoToneIconTypes;
        extraProps = {
            primaryColor: twoToneProps.primaryColor,
            secondaryColor: twoToneProps.secondaryColor,
        };
    }

    const IconComponent = useMemo(() => importIcon(namespace, name), [namespace, name]);

    return (
        // @ts-expect-error children is not defined in the UniqueIdGeneratorProvider
        <UniqueIdGeneratorProvider idPrefix={`icon-${namespace}-${name}-${id}`}>
            <ErrorBoundary fallbackRender={() => <Empty {...restProps} style={{ ...restProps.style }} />}>
                <Suspense fallback={<Empty {...restProps} style={{ ...restProps.style }} />}>
                    <IconComponent {...extraProps} style={{ ...restProps.style }} {...restProps} iconName={name} />
                </Suspense>
            </ErrorBoundary>
        </UniqueIdGeneratorProvider>
    );
};
