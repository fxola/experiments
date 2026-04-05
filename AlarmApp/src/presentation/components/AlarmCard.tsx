import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Alarm } from '../../domain/alarm';
import { DAYS_OF_WEEK } from '../../domain/alarm/value-objects';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onPress: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
}

export function AlarmCard({ alarm, onToggle, onPress, onDelete }: AlarmCardProps) {
  const { time, period } = alarm.time.format12Hour();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(alarm)}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Text style={[styles.time, !alarm.isEnabled && styles.disabled]}>
          {time}
        </Text>
        <Text style={[styles.period, !alarm.isEnabled && styles.disabled]}>
          {period}
        </Text>
      </View>

      <View style={styles.centerContent}>
        {alarm.label ? (
          <Text style={[styles.label, !alarm.isEnabled && styles.disabled]}>
            {alarm.label}
          </Text>
        ) : null}
        <View style={styles.repeatDays}>
          {alarm.repeatPattern.isRecurring() ? (
            <Text style={[styles.repeatText, !alarm.isEnabled && styles.disabled]}>
              {alarm.repeatPattern.isDaily()
                ? 'Every day'
                : alarm.repeatPattern.isWeekdays()
                ? 'Weekdays'
                : alarm.repeatPattern.isWeekends()
                ? 'Weekends'
                : alarm.repeatPattern.days.map((d) => DAYS_OF_WEEK[d]).join(', ')}
            </Text>
          ) : (
            <Text style={[styles.repeatText, !alarm.isEnabled && styles.disabled]}>
              Once
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightContent}>
        <Switch
          value={alarm.isEnabled}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={alarm.isEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    color: '#ffffff',
  },
  period: {
    fontSize: 18,
    fontWeight: '300',
    color: '#ffffff',
    marginLeft: 8,
  },
  disabled: {
    color: '#666666',
  },
  centerContent: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  repeatDays: {
    flexDirection: 'row',
  },
  repeatText: {
    fontSize: 14,
    color: '#888888',
  },
  rightContent: {
    marginLeft: 'auto',
  },
});
