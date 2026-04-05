import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Alarm } from '../../domain/alarm';
import { TimePicker } from './TimePicker';
import { RepeatDaysPicker } from './RepeatDaysPicker';
import { AlarmFactory, AlarmFormData } from '../../application/alarm/AlarmFactory';
import { DEFAULT_ALARM_SOUNDS } from '../../domain/alarm/value-objects/SoundSelection';

interface AlarmFormProps {
  alarm?: Alarm;
  onSave: (formData: AlarmFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function AlarmForm({ alarm, onSave, onCancel, onDelete }: AlarmFormProps) {
  const defaultData = alarm
    ? {
        hour: alarm.time.hour,
        minute: alarm.time.minute,
        label: alarm.label,
        soundId: alarm.sound.soundId,
        repeatDays: [...alarm.repeatPattern.days],
        isEnabled: alarm.isEnabled,
      }
    : AlarmFactory.getDefaultFormData();

  const [formData, setFormData] = useState<AlarmFormData>(defaultData);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  const handleSave = () => {
    onSave(formData);
  };

  const selectedSound = DEFAULT_ALARM_SOUNDS.find((s) => s.id === formData.soundId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.timeSection}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeLabel}>Alarm Time</Text>
          <Text style={styles.timeValue}>
            {formData.hour.toString().padStart(2, '0')}:
            {formData.minute.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.tapHint}>Tap to change</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Label</Text>
          <TextInput
            style={styles.input}
            value={formData.label}
            onChangeText={(label) => setFormData({ ...formData, label })}
            placeholder="Alarm label"
            placeholderTextColor="#666666"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Repeat</Text>
          <RepeatDaysPicker
            selectedDays={formData.repeatDays}
            onDaysChange={(repeatDays) => setFormData({ ...formData, repeatDays })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sound</Text>
          <TouchableOpacity
            style={styles.soundButton}
            onPress={() => setShowSoundPicker(true)}
          >
            <Text style={styles.soundText}>{selectedSound?.name ?? 'Default'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {alarm && onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Alarm</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showTimePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TimePicker
              hour={formData.hour}
              minute={formData.minute}
              onTimeChange={(hour, minute) => {
                setFormData({ ...formData, hour, minute });
                setShowTimePicker(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSoundPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSoundPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sound</Text>
            {DEFAULT_ALARM_SOUNDS.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundOption,
                  formData.soundId === sound.id && styles.soundOptionSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, soundId: sound.id });
                  setShowSoundPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.soundOptionText,
                    formData.soundId === sound.id && styles.soundOptionTextSelected,
                  ]}
                >
                  {sound.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
  timeSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    marginBottom: 24,
  },
  timeLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 72,
    fontWeight: '200',
    color: '#ffffff',
  },
  tapHint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  soundButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
  },
  soundText: {
    fontSize: 16,
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ffffff',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4a90d9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  soundOption: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  soundOptionSelected: {
    backgroundColor: '#4a90d9',
  },
  soundOptionText: {
    fontSize: 16,
    color: '#ffffff',
  },
  soundOptionTextSelected: {
    fontWeight: '600',
  },
});
