// src/navigation/index.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import newspaper from '../assets/newspaper.png';
import Home from './screens/Home';
import BiographyDetails from './screens/BiographyDetails';
import CreateBiography from './screens/CreateBiography';
import Favorites from './screens/Favorites';
import Statistics from './screens/Stadistics';
import Settings from './screens/Settings';
import Help from './screens/Help';

// Definir las tabs principales
const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Biografías',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Favorites: {
      screen: Favorites,
      options: {
        title: 'Favoritos',
        tabBarIcon: ({ color }) => (
          <span style={{ fontSize: 24 }}>❤️</span>
        ),
      },
    },
    Statistics: {
      screen: Statistics,
      options: {
        title: 'Estadísticas',
        tabBarIcon: ({ color }) => (
          <span style={{ fontSize: 24 }}>📊</span>
        ),
      },
    },
    Settings: {
      screen: Settings,
      options: {
        title: 'Ajustes',
        tabBarIcon: ({ color }) => (
          <span style={{ fontSize: 24 }}>⚙️</span>
        ),
      },
    },
  },
});

// Stack principal con navegación a detalles y creación
const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    BiographyDetails: {
      screen: BiographyDetails,
      options: {
        title: 'Biografía',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    },
    CreateBiography: {
      screen: CreateBiography,
      options: {
        title: 'Nueva Biografía',
        headerShown: false,
        presentation: 'modal',
      },
    },
    Help: {
      screen: Help,
      options: {
        title: 'Ayuda',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

// Tipos para navegación tipada
type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      HomeTabs: undefined;
      BiographyDetails: { biographyId: string };
      CreateBiography: undefined;
      Help: undefined;
    }
  }
}