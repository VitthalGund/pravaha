import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', label: 'Hindi' },
  { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
  { code: 'mr', name: 'मराठी', label: 'Marathi' },
  { code: 'te', name: 'తెలుగు', label: 'Telugu' },
  { code: 'bn', name: 'বাংলা', label: 'Bengali' },
  { code: 'en', name: 'English', label: 'English' },
];

type Props = {
  currentLang: string;
  onSelectLanguage: (code: string) => void;
};

export function LanguageSelector({ currentLang, onSelectLanguage }: Props) {
  return (
    <View className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <Text className="text-xs font-semibold text-text-muted uppercase mb-3">
        UI & Voice Language (Bhashini)
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              onPress={() => onSelectLanguage(lang.code)}
              className={`rounded-lg px-3.5 py-2 border items-center justify-center mr-2 ${
                isSelected
                  ? 'border-brand-teal bg-brand-teal-light'
                  : 'border-border bg-surface-secondary'
              }`}
            >
              <Text className={`font-semibold text-sm ${isSelected ? 'text-brand-teal-dark' : 'text-text-primary'}`}>
                {lang.name}
              </Text>
              <Text className="text-xs text-text-muted">{lang.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
