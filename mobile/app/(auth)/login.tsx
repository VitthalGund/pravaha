import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background px-6 justify-center"
    >
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-2xl bg-brand-forest items-center justify-center mb-3 shadow-card">
          <Text className="text-2xl font-bold text-text-inverse"> प्रवाह </Text>
        </View>
        <Text className="text-2xl font-bold text-text-primary text-center"> Welcome to Pravaha </Text>
        <Text className="text-xs text-text-secondary text-center mt-1">
          AI Cash Flow & Risk Intelligence for Rural Micro-Enterprises
        </Text>
      </View>

      <View className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <Text className="text-sm font-semibold text-text-primary mb-1">Enter Phone Number</Text>
        <Text className="text-xs text-text-muted mb-4">We will send a 6-digit verification code</Text>

        <View className="flex-row items-center border border-border rounded-lg bg-surface-secondary px-3 py-2.5 mb-4">
          <Text className="text-sm font-medium text-text-primary mr-2">🇮🇳 +91</Text>
          <View className="h-4 w-px bg-border-muted mr-2" />
          <TextInput
            className="flex-1 text-base font-semibold text-text-primary p-0"
            placeholder="98765 43210"
            placeholderTextColor="#8A8A7E"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={phone.length < 10 || loading}
          className={`rounded-lg py-3.5 items-center ${
            phone.length === 10 ? 'bg-brand-forest' : 'bg-surface-muted'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              phone.length === 10 ? 'text-text-inverse' : 'text-text-muted'
            }`}
          >
            {loading ? 'Sending Code...' : 'Get Verification Code'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center text-xs text-text-muted mt-8">
        Supported by NABARD • Financial Sector Hackathon
      </Text>
    </KeyboardAvoidingView>
  );
}
