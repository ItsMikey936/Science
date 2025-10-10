import { Biography, CreateBiographyDTO } from '../models/Biography';

// Almacenamiento en memoria
let biographiesStore: Biography[] = [];

export class BiographyService {
  // Biografías predefinidas
  private static defaultBiographies: Biography[] = [
    {
      id: '1',
      name: 'Marie Curie',
      profession: 'Física y Química',
      birthDate: '1867-11-07',
      deathDate: '1934-07-04',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/330px-Marie_Curie_c1920.jpg',
      summary: 'Pionera en el campo de la radioactividad, primera persona en ganar dos Premios Nobel en diferentes disciplinas científicas.',
      achievements: [
        'Primera mujer en ganar un Premio Nobel',
        'Primera persona en ganar dos Premios Nobel',
        'Descubrimiento del Radio y Polonio',
        'Desarrollo de la teoría de la radioactividad'
      ],
      timeline: [
        { id: 't1', year: '1891', event: 'Se mudó a París para estudiar en la Sorbona' },
        { id: 't2', year: '1903', event: 'Ganó el Premio Nobel de Física' },
        { id: 't3', year: '1911', event: 'Ganó el Premio Nobel de Química' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserCreated: false,
      isFavorite: false
    },
    {
      id: '2',
      name: 'Albert Einstein',
      profession: 'Físico Teórico',
      birthDate: '1879-03-14',
      deathDate: '1955-04-18',
      summary: 'Desarrolló la teoría de la relatividad, uno de los pilares de la física moderna.',
      achievements: [
        'Teoría de la Relatividad Especial y General',
        'Explicación del efecto fotoeléctrico',
        'Premio Nobel de Física 1921',
        'Ecuación E=mc²'
      ],
      timeline: [
        { id: 't4', year: '1905', event: 'Publicó cuatro artículos revolucionarios (Annus Mirabilis)' },
        { id: 't5', year: '1915', event: 'Completó la Teoría General de la Relatividad' },
        { id: 't6', year: '1921', event: 'Ganó el Premio Nobel de Física' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserCreated: false,
      isFavorite: false
    },
    {
      id: '3',
      name: 'Rosalind Franklin',
      profession: 'Química y Cristalógrafa',
      birthDate: '1920-07-25',
      deathDate: '1958-04-16',
      summary: 'Contribuyó al entendimiento de las estructuras moleculares del ADN, ARN, virus, carbón y grafito.',
      achievements: [
        'Fotografía 51 del ADN',
        'Investigación pionera en cristalografía de rayos X',
        'Contribuciones clave a la estructura del ADN',
        'Estudios sobre virus del tabaco y polio'
      ],
      timeline: [
        { id: 't7', year: '1951', event: 'Comenzó a trabajar en el King\'s College de Londres' },
        { id: 't8', year: '1952', event: 'Capturó la famosa Fotografía 51 del ADN' },
        { id: 't9', year: '1953', event: 'Watson y Crick publicaron la estructura del ADN basándose en su trabajo' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserCreated: false,
      isFavorite: false
    }
  ];

  static async getAllBiographies(): Promise<Biography[]> {
    try {
      console.log('📚 getAllBiographies - Store actual:', biographiesStore.length);
      
      // Si el almacenamiento está vacío, inicializar con biografías predeterminadas
      if (biographiesStore.length === 0) {
        console.log('📦 Inicializando con biografías predeterminadas');
        biographiesStore = [...this.defaultBiographies];
      }
      
      console.log('✅ Retornando', biographiesStore.length, 'biografías');
      return [...biographiesStore]; // Retornar copia
    } catch (error) {
      console.error('❌ Error al obtener biografías:', error);
      return [...this.defaultBiographies];
    }
  }

  static async getBiographyById(id: string): Promise<Biography | null> {
    try {
      const biographies = await this.getAllBiographies();
      const found = biographies.find(b => b.id === id) || null;
      console.log('🔍 getBiographyById:', id, found ? '✅ Encontrado' : '❌ No encontrado');
      return found;
    } catch (error) {
      console.error('❌ Error al obtener biografía:', error);
      return null;
    }
  }

  static async createBiography(data: CreateBiographyDTO): Promise<Biography> {
    try {
      console.log('➕ createBiography - Datos recibidos:', data.name);
      
      const biographies = await this.getAllBiographies();
      const newId = `user-${Date.now()}`;
      
      const newBiography: Biography = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isUserCreated: true,
        isFavorite: false
      };
      
      console.log('✅ Nueva biografía creada con ID:', newId);
      biographiesStore = [...biographies, newBiography];
      console.log('✅ Store actualizado, total:', biographiesStore.length);
      
      return newBiography;
    } catch (error) {
      console.error('❌ Error al crear biografía:', error);
      throw error;
    }
  }

  static async updateBiography(id: string, data: Partial<CreateBiographyDTO>): Promise<Biography | null> {
    try {
      console.log('✏️ updateBiography:', id);
      const biographies = await this.getAllBiographies();
      const index = biographies.findIndex(b => b.id === id);
      
      if (index === -1) {
        console.log('❌ Biografía no encontrada');
        return null;
      }
      
      const updatedBiography = {
        ...biographies[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      biographiesStore = [
        ...biographies.slice(0, index),
        updatedBiography,
        ...biographies.slice(index + 1)
      ];
      
      console.log('✅ Biografía actualizada');
      return updatedBiography;
    } catch (error) {
      console.error('❌ Error al actualizar biografía:', error);
      return null;
    }
  }

  static async deleteBiography(id: string): Promise<boolean> {
    try {
      console.log('🗑️ deleteBiography - ID:', id);
      
      const biographies = await this.getAllBiographies();
      const bioToDelete = biographies.find(b => b.id === id);
      
      if (!bioToDelete) {
        console.log('❌ Biografía no encontrada');
        return false;
      }
      
      console.log('🔍 Biografía encontrada:', bioToDelete.name);
      console.log('🔍 isUserCreated:', bioToDelete.isUserCreated);
      
      // Solo permitir eliminar biografías creadas por el usuario
      if (!bioToDelete.isUserCreated) {
        console.log('⚠️ No se puede eliminar biografía predeterminada');
        return false;
      }
      
      const lengthBefore = biographiesStore.length;
      biographiesStore = biographies.filter(b => b.id !== id);
      console.log(`✅ Biografía eliminada. Antes: ${lengthBefore}, Después: ${biographiesStore.length}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar biografía:', error);
      return false;
    }
  }

  static async searchBiographies(query: string): Promise<Biography[]> {
    try {
      const biographies = await this.getAllBiographies();
      const lowercaseQuery = query.toLowerCase();
      
      return biographies.filter(b => 
        b.name.toLowerCase().includes(lowercaseQuery) ||
        b.profession.toLowerCase().includes(lowercaseQuery) ||
        b.summary.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('❌ Error al buscar biografías:', error);
      return [];
    }
  }

  // Método adicional para resetear los datos (útil para desarrollo)
  static async resetToDefault(): Promise<void> {
    console.log('🔄 Reseteando a datos predeterminados');
    biographiesStore = [...this.defaultBiographies];
  }
}