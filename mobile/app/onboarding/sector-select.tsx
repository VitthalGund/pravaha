import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const SECTORS = [
  { id: 'dairy', label: 'Dairy Enterprise', icon: '🥛', desc: 'Milk production, cattle, dairy products' },
  { id: 'poultry', label: 'Poultry Enterprise', icon: '🐔', desc: 'Egg & broiler poultry farming' },
  { id: 'food_processing', label: 'Food Processing', icon: '🌾', desc: 'Grains, spices, flour milling, agro-processing' },
  { id: 'handicrafts', label: 'Handicrafts & Artisans', icon: '🎨', desc: 'Weaving, pottery, handloom, crafts' },
  { id: 'retail', label: 'Rural Retail / Kirana', icon: '🏪', desc: 'General store, inputs, retail trade' },
];

export default function SectorSelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('dairy');

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/shg-fpo-link',
      params: { sector: selected },
    });
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-semibold text-text-primary">Choose Your Sector</Text>
        <Text className="mt-1 text-sm text-text-secondary">
          Pravaha applies sector-specific seasonal risk templates to your cash flow forecast.
        </Text>
      </View>

      <ScrollView className="flex-1 space-y-3">
        {SECTORS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSelected(s.id)}
              className={`flex-row items-center rounded-xl p-4 border ${
                isSelected
                  ? 'border-brand-teal bg-brand-teal-light'
                  : 'border-border bg-surface'
              }`}
            >
              <Text className="text-3xl mr-4">{s.icon}</Text>
              <View className="flex-1">
                <Text className={`font-semibold text-base ${isSelected ? 'text-brand-teal-dark' : 'text-text-primary'}`}>
                  {s.label}
                </Text>
                <Text className="text-xs text-text-muted mt-0.5">{s.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={handleNext}
        className="my-4 rounded-xl bg-brand-teal p-4 items-center justify-center"
      >
        <Text className="font-semibold text-text-inverse text-base">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
