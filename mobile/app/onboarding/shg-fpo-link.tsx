import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ShgFpoLinkScreen() {
  const router = useRouter();
  const { sector } = useLocalSearchParams<{ sector: string }>();

  const [enterpriseName, setEnterpriseName] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [stateName, setStateName] = useState('Maharashtra');
  const [shgQuery, setShgQuery] = useState('');
  const [selectedShg, setSelectedShg] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompleteOnboarding = async () => {
    if (!enterpriseName.trim()) return;
    setLoading(true);
    try {
      // Complete onboarding and navigate to main app tabs
      router.replace('/(tabs)');
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6">
      <ScrollView className="flex-1">
        <View className="mt-8 mb-6">
          <Text className="text-2xl font-semibold text-text-primary">Enterprise & Group Link</Text>
          <Text className="mt-1 text-sm text-text-secondary">
            Provide your business name and optional SHG / FPO membership.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-xs font-semibold text-text-secondary mb-1">ENTERPRISE / BUSINESS NAME</Text>
            <TextInput
              value={enterpriseName}
              onChangeText={setEnterpriseName}
              placeholder="e.g. Kamdhenu Dairy Farm"
              className="rounded-lg border border-border bg-surface p-3 text-text-primary"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-text-secondary mb-1">DISTRICT</Text>
              <TextInput
                value={district}
                onChangeText={setDistrict}
                className="rounded-lg border border-border bg-surface p-3 text-text-primary"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-text-secondary mb-1">STATE</Text>
              <TextInput
                value={stateName}
                onChangeText={setStateName}
                className="rounded-lg border border-border bg-surface p-3 text-text-primary"
              />
            </View>
          </View>

          <View className="mt-4 border-t border-border pt-4">
            <Text className="text-xs font-semibold text-text-secondary mb-1">SEARCH SHG GROUP (OPTIONAL)</Text>
            <TextInput
              value={shgQuery}
              onChangeText={setShgQuery}
              placeholder="Search by group name..."
              className="rounded-lg border border-border bg-surface p-3 text-text-primary"
            />
            {selectedShg && (
              <View className="mt-2 flex-row items-center justify-between rounded-lg bg-brand-teal-light p-3 border border-brand-teal">
                <Text className="text-sm font-medium text-brand-teal-dark">Linked: {selectedShg.name}</Text>
                <TouchableOpacity onPress={() => setSelectedShg(null)}>
                  <Text className="text-xs text-risk-stress font-semibold">Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleCompleteOnboarding}
        disabled={loading || !enterpriseName.trim()}
        className={`my-4 rounded-xl p-4 items-center justify-center ${
          enterpriseName.trim() ? 'bg-brand-forest' : 'bg-border-muted'
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="font-semibold text-text-inverse text-base">Complete Setup</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
