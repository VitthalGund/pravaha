import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LanguageSelector } from '../../components/LanguageSelector';

export default function ProfileScreen() {
  const [lang, setLang] = useState('hi');

  const handleLanguageChange = (newCode: string) => {
    setLang(newCode);
    Alert.alert('Language Updated', `Pravaha interface set to ${newCode.toUpperCase()}`);
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-semibold text-text-primary">Enterprise Profile</Text>
        <Text className="text-xs text-text-secondary">Kamdhenu Dairy Enterprise</Text>
      </View>

      {/* Language Selector */}
      <View className="mb-6">
        <LanguageSelector currentLang={lang} onSelectLanguage={handleLanguageChange} />
      </View>

      {/* Enterprise Details */}
      <View className="rounded-xl border border-border bg-surface p-5 shadow-card mb-4 space-y-3">
        <Text className="text-xs font-semibold text-text-muted uppercase">BUSINESS DETAILS</Text>
        <View className="flex-row justify-between border-b border-border-muted pb-2">
          <Text className="text-xs text-text-secondary">Sector</Text>
          <Text className="text-xs font-semibold text-text-primary capitalize">Dairy</Text>
        </View>
        <View className="flex-row justify-between border-b border-border-muted pb-2">
          <Text className="text-xs text-text-secondary">Location</Text>
          <Text className="text-xs font-semibold text-text-primary">Nashik, Maharashtra</Text>
        </View>
        <View className="flex-row justify-between pb-1">
          <Text className="text-xs text-text-secondary">NABARD e-Shakti Ref</Text>
          <Text className="text-xs font-semibold text-brand-teal">ESHAKTI-9F2A1B</Text>
        </View>
      </View>

      {/* Obligation Self-Declaration Prompt */}
      <View className="rounded-xl border border-border bg-surface p-5 shadow-card mb-6">
        <Text className="text-xs font-semibold text-text-muted uppercase mb-1">DEBT OBLIGATIONS</Text>
        <Text className="text-xs text-text-secondary mb-3">
          Do you also owe money to a local shop or lender? Declare it here to get an honest picture.
        </Text>
        <TouchableOpacity className="rounded-lg bg-brand-forest p-3 items-center">
          <Text className="text-xs font-semibold text-text-inverse">+ Add Debt Obligation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
