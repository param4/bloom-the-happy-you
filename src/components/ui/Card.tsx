import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { shadows } from '@/theme/shadows';

interface CardProps extends ViewProps {
  /** Stronger shadow for hero cards. */
  emphasized?: boolean;
  /** Hairline border (the redesign's paper look). */
  bordered?: boolean;
}

/** Warm rounded card with the redesign's soft shadow. */
export function Card({
  emphasized,
  bordered,
  className,
  style,
  children,
  ...rest
}: PropsWithChildren<CardProps>) {
  return (
    <View
      className={`rounded-[22px] bg-card ${bordered ? 'border border-line' : ''} ${className ?? ''}`}
      style={[emphasized ? shadows.soft : shadows.softer, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
