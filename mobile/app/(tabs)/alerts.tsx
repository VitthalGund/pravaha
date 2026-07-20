import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

type RiskFlag = {
  id: string;
  flag_type: 'seasonal_normal' | 'market_shock' | 'climate_shock' | 'personal_shock' | 'over_leverage';
  severity: 'low' | 'watch' | 'high';
  reason_codes: string[];
  suggested_action: string;
  status: 'active' | 'acknowledged' | 'resolved';
};

const MOCK_FLAGS: RiskFlag[] = [
  {
    id: 'flag-1',
    flag_type: 'market_shock',
    severity: 'high',
    reason_codes: ['Feed prices in Nashik district rose 35% over past 3 weeks while milk yields remained flat.'],
    suggested_action: 'Apply for NABARD Priority Sector Feed Subsidy before next repayment cycle',
    status: 'active',
  },
  {
    id: 'flag-2',
    flag_type: 'over_leverage',
    severity: 'watch',
    reason_codes: ['Combined monthly debt load (₹5,000 bank loan + ₹3,000 informal shop credit) exceeds 50% of forecasted cash flow.'],
    suggested_action: 'Compare informal debt cost against formal KCC refinancing options',
    status: 'active',
  },
];

export default function AlertsScreen() {
  const router = useRouter();
  const [flags, setFlags] = useState<RiskFlag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter out seasonal_normal from enterprise alerts per architecture.md invariant
    const filtered = MOCK_FLAGS.filter((f) => f.flag_type !== 'seasonal_normal');
    setFlags(filtered);
  }, []);

  const getBorderColor = (sev: string) => {
    if (sev === 'high') return 'border-l-risk-stress';
    if (sev === 'watch') return 'border-l-risk-watch';
    return 'border-l-risk-safe';
  };

  const getBadgeStyle = (sev: string) => {
    if (sev === 'high') return 'bg-risk-stress-light text-risk-stress';
    if (sev === 'watch') return 'bg-risk-watch-light text-risk-watch';
    return 'bg-risk-safe-light text-risk-safe';
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="mt-8 mb-4">
        <Text className="text-2xl font-semibold text-text-primary">Risk Radar & Alerts</Text>
        <Text className="text-xs text-text-secondary">
          AI-generated early warnings with concrete next actions
        </Text>
      </View>

      <ScrollView className="flex-1 space-y-4">
        {flags.map((flag) => (
          <View
            key={flag.id}
            className={`rounded-xl border border-border border-l-4 ${getBorderColor(
              flag.severity
            )} bg-surface p-4 shadow-card mb-3`}
          >
            {/* Header: Badge & Tag */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold uppercase text-text-secondary">
                {flag.flag_type.replace('_', ' ')}
              </Text>
              <View className={`rounded-full px-2.5 py-0.5 ${getBadgeStyle(flag.severity)}`}>
                <Text className="text-xs font-semibold capitalize">{flag.severity} Risk</Text>
              </View>
            </View>

            {/* Plain-Language Reason Code */}
            <Text className="text-sm font-medium text-text-primary mb-3">
              {flag.reason_codes[0]}
            </Text>

            {/* Suggested Action CTA */}
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/alert/[id]', params: { id: flag.id } })}
              className="rounded-lg bg-brand-forest p-3 items-center"
            >
              <Text className="text-xs font-semibold text-text-inverse">
                {flag.suggested_action}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
