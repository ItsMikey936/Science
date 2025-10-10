import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useBiographyViewModel } from '../../hooks/useBiographyViewModel';
import { Biography } from '../../models/Biography';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  BiographyDetails: { biographyId: string };
  CreateBiography: undefined;
};

type BiographyDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BiographyDetails'
>;

type BiographyDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'BiographyDetails'
>;

interface Props {
  navigation: BiographyDetailsScreenNavigationProp;
  route: BiographyDetailsScreenRouteProp;
}

export default function BiographyDetails({ navigation, route }: Props) {
  const viewModel = useBiographyViewModel();
  const [biography, setBiography] = useState<Biography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBiography();
  }, [route.params.biographyId]);

  const loadBiography = async () => {
    setLoading(true);
    const bio = await viewModel.getBiographyById(route.params.biographyId);
    setBiography(bio);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando biografía...</Text>
      </View>
    );
  }

  if (!biography) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Biografía no encontrada</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        {biography.imageUrl ? (
          <Image source={{ uri: biography.imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Text style={styles.heroPlaceholderText}>
              {biography.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.heroOverlay}>
          <Text style={styles.heroName}>{biography.name}</Text>
          <Text style={styles.heroProfession}>{biography.profession}</Text>
          <Text style={styles.heroDates}>
            {biography.birthDate} - {biography.deathDate || 'Presente'}
          </Text>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text style={styles.summaryText}>{biography.summary}</Text>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros Principales</Text>
        {biography.achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <View style={styles.achievementBullet}>
              <Text style={styles.achievementBulletText}>✓</Text>
            </View>
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
      </View>

      {/* Timeline Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Línea de Tiempo</Text>
        {biography.timeline.map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineYear}>{event.year}</Text>
              <View style={styles.timelineDot} />
              {index < biography.timeline.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineEvent}>{event.event}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Metadata Section */}
      <View style={styles.metadataSection}>
        <Text style={styles.metadataText}>
          {biography.isUserCreated ? 'Biografía creada por ti' : 'Biografía predeterminada'}
        </Text>
        <Text style={styles.metadataText}>
          Última actualización: {new Date(biography.updatedAt).toLocaleDateString('es-MX')}
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hero: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFF',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  heroName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  heroProfession: {
    fontSize: 18,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  heroDates: {
    fontSize: 14,
    color: '#BDBDBD',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  achievementBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  achievementBulletText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  achievementText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  timelineYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginBottom: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  timelineRight: {
    flex: 1,
    paddingTop: 20,
  },
  timelineEvent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  metadataSection: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 20,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});