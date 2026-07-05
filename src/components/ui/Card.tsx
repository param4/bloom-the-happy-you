import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { shadows } from '@/theme/shadows';

interface CardProps extends ViewProps {
  /** Stronger shadow for hero cards. */
  emphasized?: boolean;
}

/** White rounded card with the prototype's soft shadow. */
export function Card({ emphasized, className, style, children, ...rest }: PropsWithChildren<CardProps>) {
  return (
    <View
      className={`rounded-[22px] bg-card ${className ?? ''}`}
      style={[emphasized ? shadows.soft : shadows.softer, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
