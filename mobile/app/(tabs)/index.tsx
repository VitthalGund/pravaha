import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { db } from '../../db/sqlite';
import { syncPendingEntries } from '../../db/sync-queue';

export default function HomeScreen() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadLocalSnapshot = () => {
    try {
      const rows = db.getAllSync<{ type: string; total: number }>(
        `SELECT type, SUM(amount) as total FROM cash_flow_entries GROUP BY type`
      );
      let inc = 0;
      let exp = 0;
      for (const r of rows) {
        if (r.type === 'income') inc = r.total;
        if (r.type === 'expense') exp = r.total;
      }
      setIncome(inc);
      setExpense(exp);
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    loadLocalSnapshot();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncPendingEntries();
    loadLocalSnapshot();
    setRefreshing(false);
  };

  const netFlow = income - expense;

  return (
    <ScrollView
      className="flex-1 bg-background p-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="mt-8 mb-4">
        <Text className="text-2xl font-semibold text-text-primary">Cash Flow Snapshot</Text>
        <Text className="text-xs text-text-secondary">Current Period</Text>
      </View>

      {/* Snapshot Card */}
      <View className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <Text className="text-xs font-semibold text-text-muted uppercase">NET CASH FLOW</Text>
        <Text className={`text-3xl font-bold mt-1 ${netFlow >= 0 ? 'text-risk-safe' : 'text-risk-stress'}`}>
          ₹{Math.abs(netFlow).toLocaleString('en-IN')}
          <Text className="text-sm font-normal text-text-secondary"> {netFlow >= 0 ? 'Surplus' : 'Deficit'}</Text>
        </Text>

        <View className="mt-4 flex-row border-t border-border-muted pt-3">
          <View className="flex-1">
            <Text className="text-xs text-text-muted">INCOME</Text>
            <Text className="text-lg font-semibold text-risk-safe">+₹{income.toLocaleString('en-IN')}</Text>
          </View>
          <View className="flex-1 border-l border-border-muted pl-4">
            <Text className="text-xs text-text-muted">EXPENSE</Text>
            <Text className="text-lg font-semibold text-risk-stress">-₹{expense.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Trajectory Bar */}
      <View className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-card">
        <Text className="text-xs font-semibold text-text-muted uppercase mb-2">CREDIT-READINESS TRAJECTORY</Text>
        <View className="flex-row h-3 rounded-full bg-surface-secondary overflow-hidden mb-2">
          <View className="flex-1 bg-brand-gold mr-0.5 rounded-l-full" />
          <View className="flex-1 bg-surface-muted mr-0.5" />
          <View className="flex-1 bg-surface-muted rounded-r-full" />
        </View>
        <Text className="text-xs font-semibold text-brand-gold">Stage 1: Grant Dependent</Text>
        <Text className="text-xs text-text-secondary mt-0.5">
          Maintain 3 consecutive months of non-flagged forecast periods to advance to Emerging.
        </Text>
      </View>

      {/* Offline sync badge */}
      <TouchableOpacity
        onPress={onRefresh}
        className="mt-6 rounded-lg bg-offline-badge-bg p-3 items-center"
      >
        <Text className="text-xs font-medium text-offline-badge-text">
          📱 Local-first storage active • Pull to Sync
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
