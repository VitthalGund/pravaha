import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, icon = '📋', actionLabel, onAction }: Props) {
  return (
    <View className="items-center justify-center p-8 bg-surface rounded-xl border border-border border-dashed my-4">
      <Text className="text-4xl mb-3">{icon}</Text>
      <Text className="text-base font-semibold text-text-primary text-center mb-1">{title}</Text>
      <Text className="text-xs text-text-secondary text-center max-w-xs mb-4">{description}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          className="bg-brand-teal px-4 py-2.5 rounded-lg shadow-card"
        >
          <Text className="text-xs font-semibold text-text-inverse">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
