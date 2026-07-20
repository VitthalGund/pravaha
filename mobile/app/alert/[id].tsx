import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVoiceExplanation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000); // simulate 3s TTS audio playback
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="mt-8 mb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="rounded-lg bg-surface-secondary px-3 py-1.5 border border-border">
          <Text className="text-xs font-semibold text-text-primary">← Back</Text>
        </TouchableOpacity>
        <Text className="text-sm font-semibold text-text-primary">Risk Alert Explanation</Text>
      </View>

      <ScrollView className="flex-1 space-y-4">
        <View className="rounded-xl border border-l-4 border-l-risk-stress border-border bg-surface p-5 shadow-card">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold uppercase text-risk-stress">MARKET SHOCK ALERT</Text>
            <View className="rounded-full bg-risk-stress-light px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-risk-stress">High Severity</Text>
            </View>
          </View>

          <Text className="text-base font-medium text-text-primary my-3">
            Feed prices in Nashik district rose 35% over past 3 weeks while milk yields remained flat due to fodder supply constraints.
          </Text>

          {/* Voice Explanation Button */}
          <TouchableOpacity
            onPress={handlePlayVoiceExplanation}
            disabled={isPlaying}
            className="flex-row items-center justify-center rounded-lg bg-accent p-3.5 mb-4"
          >
            {isPlaying ? (
              <ActivityIndicator color="#FFFFFF" className="mr-2" />
            ) : (
              <Text className="text-base mr-2">🔊</Text>
            )}
            <Text className="font-semibold text-text-inverse text-xs">
              {isPlaying ? 'Playing Voice Explanation...' : 'Listen to Voice Explanation (Hindi/Bhashini)'}
            </Text>
          </TouchableOpacity>

          <View className="rounded-lg bg-surface-secondary p-3 border border-border-muted">
            <Text className="text-xs font-semibold text-text-secondary uppercase mb-1">RECOMMENDED ACTION</Text>
            <Text className="text-xs text-text-primary font-medium">
              Apply for NABARD Priority Sector Feed Subsidy before next repayment cycle.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
