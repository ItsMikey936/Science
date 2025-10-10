import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBiographyViewModel } from '../../hooks/useBiographyViewModel';
import { TimelineEvent } from '../../models/Biography';

type RootStackParamList = {
  HomeTabs: undefined;
  BiographyDetails: { biographyId: string };
  CreateBiography: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateBiography() {
  const navigation = useNavigation<NavigationProp>();
  const viewModel = useBiographyViewModel();
  
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: '1', year: '', event: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter((_, i) => i !== index));
    }
  };

  const addTimelineEvent = () => {
    setTimeline([
      ...timeline,
      { id: Date.now().toString(), year: '', event: '' }
    ]);
  };

  const updateTimelineEvent = (
    id: string,
    field: 'year' | 'event',
    value: string
  ) => {
    setTimeline(
      timeline.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeTimelineEvent = (id: string) => {
    if (timeline.length > 1) {
      setTimeline(timeline.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit iniciado');
    
    if (isSubmitting) {
      console.log('⚠️ Ya hay un submit en proceso');
      return;
    }

    // Validaciones
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!profession.trim()) {
      Alert.alert('Error', 'La profesión es obligatoria');
      return;
    }
    if (!birthDate.trim()) {
      Alert.alert('Error', 'La fecha de nacimiento es obligatoria');
      return;
    }
    if (!summary.trim()) {
      Alert.alert('Error', 'El resumen es obligatorio');
      return;
    }
    
    const validAchievements = achievements.filter(a => a.trim());
    if (validAchievements.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un logro');
      return;
    }

    const validTimeline = timeline.filter(t => t.year.trim() && t.event.trim());
    if (validTimeline.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un evento en la línea de tiempo');
      return;
    }

    console.log('✅ Validaciones pasadas');
    setIsSubmitting(true);

    const biographyData = {
      name: name.trim(),
      profession: profession.trim(),
      birthDate: birthDate.trim(),
      deathDate: deathDate.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      summary: summary.trim(),
      achievements: validAchievements,
      timeline: validTimeline.sort((a, b) => parseInt(a.year) - parseInt(b.year)),
    };

    console.log('📦 Datos a enviar:', JSON.stringify(biographyData, null, 2));

    try {
      console.log('⏳ Llamando a viewModel.createBiography...');
      const success = await viewModel.createBiography(biographyData);
      console.log('📊 Resultado de createBiography:', success);

      if (success) {
        console.log('✅ Biografía creada exitosamente');
        setIsSubmitting(false);
        
        // Cerrar el modal
        navigation.goBack();
        
        // Mostrar confirmación
        setTimeout(() => {
          Alert.alert('Éxito', 'Biografía creada correctamente');
        }, 100);
      } else {
        console.log('❌ createBiography retornó false');
        setIsSubmitting(false);
        Alert.alert('Error', 'No se pudo crear la biografía. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('💥 Error capturado:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Ocurrió un error al crear la biografía.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Biografía</Text>
        <Text style={styles.subtitle}>
          Completa todos los campos para crear una biografía
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Isaac Newton"
            value={name}
            onChangeText={setName}
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Profesión *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Físico y Matemático"
            value={profession}
            onChangeText={setProfession}
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Fecha de Nacimiento * (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="1643-01-04"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Fecha de Fallecimiento (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="1727-03-31 (opcional)"
            value={deathDate}
            onChangeText={setDeathDate}
            editable={!isSubmitting}
          />

          <Text style={styles.label}>URL de Imagen (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
            editable={!isSubmitting}
          />
        </View>

        {/* Resumen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe un breve resumen de la vida y contribuciones..."
            value={summary}
            onChangeText={setSummary}
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />
        </View>

        {/* Logros */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Logros Principales *</Text>
            <TouchableOpacity 
              onPress={addAchievement} 
              style={styles.addButton}
              disabled={isSubmitting}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {achievements.map((achievement, index) => (
            <View key={index} style={styles.listItem}>
              <TextInput
                style={[styles.input, styles.listInput]}
                placeholder={`Logro ${index + 1}`}
                value={achievement}
                onChangeText={(value) => updateAchievement(index, value)}
                multiline
                editable={!isSubmitting}
              />
              {achievements.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeAchievement(index)}
                  style={styles.removeButton}
                  disabled={isSubmitting}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Línea de Tiempo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Línea de Tiempo *</Text>
            <TouchableOpacity 
              onPress={addTimelineEvent} 
              style={styles.addButton}
              disabled={isSubmitting}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {timeline.map((item) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineRow}>
                <TextInput
                  style={[styles.input, styles.yearInput]}
                  placeholder="Año"
                  value={item.year}
                  onChangeText={(value) => updateTimelineEvent(item.id, 'year', value)}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
                {timeline.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeTimelineEvent(item.id)}
                    style={styles.removeButton}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.input, styles.eventInput]}
                placeholder="Descripción del evento"
                value={item.event}
                onChangeText={(value) => updateTimelineEvent(item.id, 'event', value)}
                multiline
                editable={!isSubmitting}
              />
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botones Fijos en el Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Guardando...' : 'Crear Biografía'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  listItem: {
    marginBottom: 12,
  },
  listInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timelineItem: {
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearInput: {
    flex: 1,
    marginRight: 8,
  },
  eventInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});