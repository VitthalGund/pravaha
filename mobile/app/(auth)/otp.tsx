import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length < 6) return;
    router.push('/(auth)/pin-setup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background px-6 justify-center"
    >
      <View className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <Text className="text-xl font-bold text-text-primary mb-1">Enter 6-Digit Code</Text>
        <Text className="text-xs text-text-secondary mb-6">
          Sent via SMS to +91 {phone || '9876543210'}
        </Text>

        <View className="mb-6">
          <TextInput
            className="border border-border rounded-lg bg-surface-secondary text-center text-2xl font-bold tracking-widest text-text-primary py-3"
            placeholder="• • • • • •"
            placeholderTextColor="#8A8A7E"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
          />
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.length < 6}
          className={`rounded-lg py-3.5 items-center mb-4 ${
            otp.length === 6 ? 'bg-brand-forest' : 'bg-surface-muted'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              otp.length === 6 ? 'text-text-inverse' : 'text-text-muted'
            }`}
          >
            Verify Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="items-center py-2">
          <Text className="text-xs font-semibold text-brand-teal">Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
