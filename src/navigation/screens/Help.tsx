import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '¿Cómo creo una nueva biografía?',
    answer: 'Toca el botón "+" en la pantalla principal. Completa todos los campos obligatorios (nombre, profesión, fecha de nacimiento, resumen, logros y línea de tiempo) y presiona "Crear Biografía".',
  },
  {
    question: '¿Cómo marco una biografía como favorita?',
    answer: 'En la pantalla de detalles de cualquier biografía, toca el ícono de corazón en la esquina superior derecha. También puedes marcar favoritos desde la pestaña de Favoritos.',
  },
  {
    question: '¿Puedo editar biografías predeterminadas?',
    answer: 'No, las biografías predeterminadas no pueden ser editadas o eliminadas. Solo puedes modificar las biografías que tú has creado.',
  },
  {
    question: '¿Cómo elimino una biografía?',
    answer: 'Mantén presionada una biografía que hayas creado en la lista principal y selecciona "Eliminar" en el menú que aparece.',
  },
  {
    question: '¿Dónde se guardan mis datos?',
    answer: 'Todos tus datos se guardan localmente en tu dispositivo. No se envía ninguna información a servidores externos.',
  },
  {
    question: '¿Qué información debo incluir en la línea de tiempo?',
    answer: 'Incluye los eventos más importantes de la vida del científico, con el año y una descripción breve. Se ordenarán automáticamente por año.',
  },
];

export default function Help() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❓ Ayuda</Text>
        <Text style={styles.subtitle}>
          Preguntas frecuentes sobre la app
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guía Rápida</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideNumber}>
            <Text style={styles.guideNumberText}>1</Text>
          </View>
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>Explora biografías</Text>
            <Text style={styles.guideText}>
              Navega por la lista de científicos destacados y toca cualquiera para ver su información completa.
            </Text>
          </View>
        </View>

        <View style={styles.guideItem}>
          <View style={styles.guideNumber}>
            <Text style={styles.guideNumberText}>2</Text>
          </View>
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>Crea tus propias biografías</Text>
            <Text style={styles.guideText}>
              Usa el botón "+" para agregar biografías de tus científicos favoritos.
            </Text>
          </View>
        </View>

        <View style={styles.guideItem}>
          <View style={styles.guideNumber}>
            <Text style={styles.guideNumberText}>3</Text>
          </View>
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>Marca favoritos</Text>
            <Text style={styles.guideText}>
              Toca el corazón para guardar tus biografías favoritas y acceder a ellas fácilmente.
            </Text>
          </View>
        </View>

        <View style={styles.guideItem}>
          <View style={styles.guideNumber}>
            <Text style={styles.guideNumberText}>4</Text>
          </View>
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>Revisa estadísticas</Text>
            <Text style={styles.guideText}>
              Visita la pestaña de Estadísticas para ver análisis de tu colección.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        
        {faqData.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => toggleItem(index)}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqIcon}>
                {expandedIndex === index ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consejos</Text>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Usa búsqueda para encontrar biografías rápidamente por nombre o profesión.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🎯</Text>
          <Text style={styles.tipText}>
            Mantén presionada una biografía creada por ti para ver opciones de eliminación.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>📸</Text>
          <Text style={styles.tipText}>
            Puedes agregar imágenes usando URLs de internet (https://...).
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>⏱️</Text>
          <Text style={styles.tipText}>
            Los eventos en la línea de tiempo se ordenan automáticamente por año.
          </Text>
        </View>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>¿Necesitas más ayuda?</Text>
        <Text style={styles.contactText}>
          Si tienes más preguntas o encuentras algún problema, no dudes en contactarnos.
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
  header: {
    backgroundColor: '#4CAF50',
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
    color: '#C8E6C9',
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
  guideItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  guideNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guideNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  guideText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 16,
  },
  faqIcon: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 8,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});