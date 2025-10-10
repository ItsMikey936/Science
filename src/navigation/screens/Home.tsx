import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBiographyViewModel } from '../../hooks/useBiographyViewModel';
import { Biography } from '../../models/Biography';

export default function Home() {
  const navigation = useNavigation();
  const viewModel = useBiographyViewModel();

  const handleBiographyPress = (biography: Biography) => {
    navigation.navigate('BiographyDetails', { biographyId: biography.id });
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateBiography');
  };

  const handleDeleteBiography = (biography: Biography) => {
    if (!biography.isUserCreated) {
      Alert.alert('Error', 'No puedes eliminar biografías predeterminadas');
      return;
    }

    Alert.alert(
      'Eliminar Biografía',
      `¿Estás seguro de eliminar la biografía de ${biography.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await viewModel.deleteBiography(biography.id);
            if (success) {
              Alert.alert('Éxito', 'Biografía eliminada correctamente');
            }
          }
        }
      ]
    );
  };

  const renderBiographyCard = ({ item }: { item: Biography }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleBiographyPress(item)}
      onLongPress={() => handleDeleteBiography(item)}
    >
      <View style={styles.cardContent}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardProfession}>{item.profession}</Text>
          <Text style={styles.cardDates}>
            {item.birthDate.split('-')[0]} - {item.deathDate ? item.deathDate.split('-')[0] : 'Presente'}
          </Text>
          {item.isUserCreated && (
            <View style={styles.userCreatedBadge}>
              <Text style={styles.userCreatedText}>Creada por ti</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            viewModel.toggleFavorite(item.id);
          }}
        >
          <Text style={styles.favoriteIcon}>
            {item.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.cardSummary} numberOfLines={2}>
        {item.summary}
      </Text>
    </TouchableOpacity>
  );

  if (viewModel.loading && viewModel.biographies.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando biografías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Biografías Científicas</Text>
        <Text style={styles.subtitle}>
          Explora y crea biografías de grandes científicos
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o profesión..."
          value={viewModel.searchQuery}
          onChangeText={(text) => viewModel.setSearchQuery(text)}
        />
        {viewModel.searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => viewModel.clearSearch()}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{viewModel.defaultBiographies.length}</Text>
          <Text style={styles.statLabel}>Predeterminadas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{viewModel.userCreatedBiographies.length}</Text>
          <Text style={styles.statLabel}>Creadas por ti</Text>
        </View>
      </View>

      {viewModel.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{viewModel.error}</Text>
          <TouchableOpacity onPress={() => viewModel.clearError()}>
            <Text style={styles.errorDismiss}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={viewModel.filteredBiographies}
        renderItem={renderBiographyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {viewModel.searchQuery
                ? 'No se encontraron biografías'
                : 'No hay biografías disponibles'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
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
    color: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 14,
  },
  errorDismiss: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardProfession: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardDates: {
    fontSize: 12,
    color: '#999',
  },
  userCreatedBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  userCreatedText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  cardSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
  },
});