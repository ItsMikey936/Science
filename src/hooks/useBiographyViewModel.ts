import { useEffect, useState, useRef } from 'react';
import { BiographyViewModel } from '../viewmodels/BiographyViewModel';

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