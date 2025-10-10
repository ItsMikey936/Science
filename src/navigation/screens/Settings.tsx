import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleAbout = () => {
    Alert.alert(
      'Acerca de',
      'Biografías Científicas v1.0\n\nUna app para explorar y crear biografías de grandes científicos.\n\nDesarrollada con React Native y patrón MVVM.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacidad',
      'Todos tus datos se guardan localmente en tu dispositivo. No compartimos información con terceros.',
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Borrar Datos',
      '¿Estás seguro de que quieres borrar todas las biografías creadas por ti? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Éxito', 'Datos borrados correctamente');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Configuración</Text>
        <Text style={styles.subtitle}>
          Personaliza tu experiencia
        </Text>
      </View>

      {/* Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificaciones</Text>
            <Text style={styles.settingDescription}>
              Recibe recordatorios sobre biografías
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        
      </View>

      {/* General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
          <Text style={styles.menuIcon}>❓</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Ayuda</Text>
            <Text style={styles.menuDescription}>
              Aprende a usar la aplicación
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

      </View>

      {/* Datos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>
        
        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={handleClearData}
        >
          <Text style={styles.menuIcon}>🗑️</Text>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuLabel, styles.dangerText]}>
              Borrar mis biografías
            </Text>
            <Text style={styles.menuDescription}>
              Elimina todas las biografías creadas por ti
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versión 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Biografías Científicas</Text>
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
  header: {
    backgroundColor: '#9C27B0',
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
    color: '#E1BEE7',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#999',
  },
  menuArrow: {
    fontSize: 24,
    color: '#CCC',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#D32F2F',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});