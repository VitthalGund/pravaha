import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function PinSetupScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSetPin = () => {
    if (pin.length < 4) return;
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    setError('');
    // Navigate to onboarding flow or tabs
    router.replace('/onboarding/sector-select');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background px-6 justify-center"
    >
      <View className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <Text className="text-xl font-bold text-text-primary mb-1">Set 4-Digit PIN</Text>
        <Text className="text-xs text-text-secondary mb-6">
          Used for quick offline login and entry confirmation
        </Text>

        <Text className="text-xs font-medium text-text-muted mb-1">4-Digit PIN</Text>
        <TextInput
          className="border border-border rounded-lg bg-surface-secondary text-center text-xl font-bold tracking-widest text-text-primary py-2.5 mb-4"
          placeholder="• • • •"
          placeholderTextColor="#8A8A7E"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          value={pin}
          onChangeText={(val) => {
            setPin(val);
            setError('');
          }}
          autoFocus
        />

        <Text className="text-xs font-medium text-text-muted mb-1">Confirm PIN</Text>
        <TextInput
          className="border border-border rounded-lg bg-surface-secondary text-center text-xl font-bold tracking-widest text-text-primary py-2.5 mb-4"
          placeholder="• • • •"
          placeholderTextColor="#8A8A7E"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          value={confirmPin}
          onChangeText={(val) => {
            setConfirmPin(val);
            setError('');
          }}
        />

        {error ? <Text className="text-xs text-risk-stress mb-3 text-center">{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSetPin}
          disabled={pin.length < 4 || confirmPin.length < 4}
          className={`rounded-lg py-3.5 items-center ${
            pin.length === 4 && confirmPin.length === 4 ? 'bg-brand-forest' : 'bg-surface-muted'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              pin.length === 4 && confirmPin.length === 4 ? 'text-text-inverse' : 'text-text-muted'
            }`}
          >
            Save PIN & Continue
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
