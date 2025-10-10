import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useBiographyViewModel } from '../../hooks/useBiographyViewModel';

const { width } = Dimensions.get('window');

export default function Statistics() {
  const viewModel = useBiographyViewModel();
  const stats = viewModel.stats;

  const professions = Object.entries(stats.byProfession)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = Math.max(...professions.map(p => p[1]), 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Estadísticas</Text>
        <Text style={styles.subtitle}>
          Análisis de tu colección de biografías
        </Text>
      </View>

      {/* Resumen General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen General</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total de Biografías</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.statNumber}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statNumber}>{stats.userCreated}</Text>
            <Text style={styles.statLabel}>Creadas por ti</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.statNumber}>
              {stats.total - stats.userCreated}
            </Text>
            <Text style={styles.statLabel}>Predeterminadas</Text>
          </View>
        </View>
      </View>

      {/* Por Profesión */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Profesiones</Text>
        
        {professions.length > 0 ? (
          professions.map(([profession, count], index) => (
            <View key={profession} style={styles.barContainer}>
              <View style={styles.barInfo}>
                <Text style={styles.barRank}>#{index + 1}</Text>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {profession}
                </Text>
                <Text style={styles.barCount}>{count}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(count / maxCount) * 100}%`,
                      backgroundColor: getBarColor(index),
                    },
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay datos disponibles</Text>
        )}
      </View>

      {/* Porcentajes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribución</Text>
        
        <View style={styles.percentageContainer}>
          <View style={styles.percentageItem}>
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageNumber}>
                {stats.total > 0
                  ? Math.round((stats.userCreated / stats.total) * 100)
                  : 0}
                %
              </Text>
            </View>
            <Text style={styles.percentageLabel}>Creadas por ti</Text>
          </View>

          <View style={styles.percentageItem}>
            <View style={[styles.percentageCircle, { backgroundColor: '#E91E63' }]}>
              <Text style={styles.percentageNumber}>
                {stats.total > 0
                  ? Math.round((stats.favorites / stats.total) * 100)
                  : 0}
                %
              </Text>
            </View>
            <Text style={styles.percentageLabel}>Favoritos</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const getBarColor = (index: number): string => {
  const colors = ['#2196F3', '#9C27B0', '#4CAF50', '#FF9800', '#F44336'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFE0B2',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  barContainer: {
    marginBottom: 16,
  },
  barInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    width: 32,
  },
  barLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  barCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  percentageItem: {
    alignItems: 'center',
  },
  percentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  percentageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  percentageLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});