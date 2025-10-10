// src/hooks/useBiographyViewModel.ts

import { useEffect, useState, useRef } from 'react';
import { BiographyViewModel } from '../viewmodels/BiographyViewModel';

// Singleton del ViewModel para compartir estado entre pantallas
let sharedViewModel: BiographyViewModel | null = null;

export const useBiographyViewModel = () => {
  // Crear o reutilizar el ViewModel
  const viewModelRef = useRef<BiographyViewModel>(
    sharedViewModel || new BiographyViewModel()
  );
  
  if (!sharedViewModel) {
    sharedViewModel = viewModelRef.current;
  }

  // Estado local para forzar re-renders cuando cambie el ViewModel
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Suscribirse a cambios del ViewModel
    const unsubscribe = viewModelRef.current.subscribe(() => {
      forceUpdate({}); // Forzar re-render
    });

    // Cargar biografías al montar
    viewModelRef.current.loadBiographies();

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return viewModelRef.current;
};

// Hook alternativo para crear una instancia local (no compartida)
export const useLocalBiographyViewModel = () => {
  const viewModelRef = useRef(new BiographyViewModel());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = viewModelRef.current.subscribe(() => {
      forceUpdate({});
    });

    viewModelRef.current.loadBiographies();

    return () => {
      unsubscribe();
    };
  }, []);

  return viewModelRef.current;
};