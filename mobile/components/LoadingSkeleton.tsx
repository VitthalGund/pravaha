import React from 'react';
import { View } from 'react-native';

type Props = {
  height?: number;
  width?: string | number;
  borderRadius?: number;
};

export function LoadingSkeleton({ height = 48, width = '100%', borderRadius = 12 }: Props) {
  return (
    <View
      style={{ height, width, borderRadius }}
      className="bg-surface-secondary my-1 animate-pulse"
    />
  );
}
