import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { startRecording, stopRecording } from '../../lib/voice';
import { db } from '../../db/sqlite';
import { syncPendingEntries } from '../../db/sync-queue';

const CATEGORIES = [
  { id: 'milk_sale', label: 'Milk Sale', icon: '🥛', type: 'income' },
  { id: 'feed_purchase', label: 'Feed / Fodder', icon: '🌾', type: 'expense' },
  { id: 'fertilizer', label: 'Fertilizer / Inputs', icon: '🌱', type: 'expense' },
  { id: 'veterinary', label: 'Vet Care / Medicine', icon: '🩺', type: 'expense' },
  { id: 'loan_repayment', label: 'Loan Repayment', icon: '🏦', type: 'expense' },
  { id: 'other_income', label: 'Other Income', icon: '💵', type: 'income' },
];

export default function RecordScreen() {
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Manual state
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('milk_sale');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleToggleRecord = async () => {
    if (!isRecording) {
      const started = await startRecording();
      if (started) {
        setIsRecording(true);
        setStatusMessage('Recording voice note...');
      }
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      setStatusMessage('Processing audio...');
      const uri = await stopRecording();
      setIsProcessing(false);
      
      // Simulate voice parsing fallback
      setAmount('450');
      setCategory('milk_sale');
      setEntryType('income');
      setStatusMessage('Parsed: Milk Sale — ₹450 (Tap Save below to confirm)');
    }
  };

  const handleSaveEntry = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setStatusMessage('Please enter a valid amount');
      return;
    }

    const uuid = `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowISO = new Date().toISOString();

    try {
      // Local-first write to SQLite
      db.runSync(
        `INSERT INTO cash_flow_entries (client_entry_id, enterprise_id, type, category, amount, recorded_at, synced) VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [uuid, 'demo-enterprise-id', entryType, category, numericAmount, nowISO]
      );

      setStatusMessage('Saved locally! Syncing...');
      setAmount('');
      
      // Background sync trigger
      syncPendingEntries();
    } catch (e) {
      setStatusMessage('Error saving entry locally');
    }
  };

  return (
    <View className="flex-1 bg-background p-6">
      {/* Mode Selector Header */}
      <View className="mt-8 mb-4 flex-row rounded-xl bg-surface-secondary p-1">
        <TouchableOpacity
          onPress={() => setMode('voice')}
          className={`flex-1 rounded-lg py-2.5 items-center ${
            mode === 'voice' ? 'bg-surface shadow-card' : ''
          }`}
        >
          <Text className={`font-semibold text-sm ${mode === 'voice' ? 'text-brand-forest' : 'text-text-secondary'}`}>
            🎙️ Voice Entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('manual')}
          className={`flex-1 rounded-lg py-2.5 items-center ${
            mode === 'manual' ? 'bg-surface shadow-card' : ''
          }`}
        >
          <Text className={`font-semibold text-sm ${mode === 'manual' ? 'text-brand-forest' : 'text-text-secondary'}`}>
            ✏️ Manual Entry
          </Text>
        </TouchableOpacity>
      </View>

      {statusMessage && (
        <View className="mb-4 rounded-lg bg-brand-teal-light p-3 border border-brand-teal">
          <Text className="text-xs text-brand-teal-dark font-medium">{statusMessage}</Text>
        </View>
      )}

      {mode === 'voice' ? (
        <View className="flex-1 items-center justify-center">
          <TouchableOpacity
            onPress={handleToggleRecord}
            disabled={isProcessing}
            className={`h-32 w-32 rounded-full items-center justify-center shadow-card ${
              isRecording ? 'bg-risk-stress' : 'bg-accent'
            }`}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Text className="text-4xl">{isRecording ? '⏹️' : '🎙️'}</Text>
            )}
          </TouchableOpacity>
          <Text className="mt-4 text-base font-semibold text-text-primary">
            {isRecording ? 'Tap to Stop' : 'Tap Microphone to Speak'}
          </Text>
          <Text className="mt-1 text-xs text-text-muted text-center px-8">
            Speak in Hindi, Marathi, Tamil, or your chosen language (e.g., "Sold milk for 450 rupees")
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 space-y-4">
          {/* Income / Expense Toggle */}
          <View className="flex-row space-x-3 my-2">
            <TouchableOpacity
              onPress={() => setEntryType('income')}
              className={`flex-1 rounded-xl p-3 items-center border ${
                entryType === 'income' ? 'border-risk-safe bg-risk-safe-light' : 'border-border bg-surface'
              }`}
            >
              <Text className={`font-semibold ${entryType === 'income' ? 'text-risk-safe' : 'text-text-secondary'}`}>
                + Income (आय)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEntryType('expense')}
              className={`flex-1 rounded-xl p-3 items-center border ${
                entryType === 'expense' ? 'border-risk-stress bg-risk-stress-light' : 'border-border bg-surface'
              }`}
            >
              <Text className={`font-semibold ${entryType === 'expense' ? 'text-risk-stress' : 'text-text-secondary'}`}>
                - Expense (व्यय)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary mb-1">AMOUNT (₹)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="e.g. 500"
              className="rounded-lg border border-border bg-surface p-3 text-lg font-semibold text-text-primary"
            />
          </View>

          {/* Category Picker */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary mb-2">CATEGORY</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isCatSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    className={`flex-row items-center rounded-lg p-2.5 border ${
                      isCatSelected ? 'border-brand-teal bg-brand-teal-light' : 'border-border bg-surface'
                    }`}
                  >
                    <Text className="mr-1.5">{cat.icon}</Text>
                    <Text className={`text-xs font-medium ${isCatSelected ? 'text-brand-teal-dark' : 'text-text-primary'}`}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSaveEntry}
            className="mt-6 rounded-xl bg-brand-forest p-4 items-center justify-center"
          >
            <Text className="font-semibold text-text-inverse text-base">Save Entry</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
