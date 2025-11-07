// src/services/BiographyService.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Biography, CreateBiographyDTO, TimelineEvent } from '../models/Biography';

import { SUPABASE_CONFIG } from '../config/supabase';

// Crear cliente de Supabase
const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG.url, 
  SUPABASE_CONFIG.anonKey
);

// Tipos para la base de datos
interface BiographyRow {
  id: string;
  name: string;
  profession: string;
  birth_date: string;
  death_date: string | null;
  image_url: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
  is_user_created: boolean;
  is_favorite: boolean;
}

interface AchievementRow {
  id: number;
  biography_id: string;
  achievement: string;
  position: number;
}

interface TimelineRow {
  id: string;
  biography_id: string;
  year: string;
  event: string;
}

export class BiographyService {
  /**
   * Convierte una fila de la BD a un objeto Biography
   */
  private static async rowToBiography(row: BiographyRow): Promise<Biography> {
    // Obtener logros
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('achievement')
      .eq('biography_id', row.id)
      .order('position');

    const achievements = achievementsData?.map(a => a.achievement) || [];

    // Obtener timeline
    const { data: timelineData } = await supabase
      .from('timeline_events')
      .select('id, year, event')
      .eq('biography_id', row.id)
      .order('year');

    const timeline: TimelineEvent[] = timelineData || [];

    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      birthDate: row.birth_date,
      deathDate: row.death_date || undefined,
      imageUrl: row.image_url || undefined,
      summary: row.summary,
      achievements,
      timeline,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isUserCreated: row.is_user_created,
      isFavorite: row.is_favorite,
    };
  }

  /**
   * Verifica la conexión con Supabase
   */
  static async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('biographies').select('id').limit(1);
      if (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
      }
      console.log('✅ Conexión exitosa con Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }

  /**
   * Inicializa la base de datos (verifica conexión)
   */
  static async initializeDatabase(): Promise<void> {
    try {
      console.log('🔄 Verificando conexión con Supabase...');
      const isConnected = await this.testConnection();
      
      if (!isConnected) {
        throw new Error('No se pudo conectar con Supabase. Verifica tus credenciales.');
      }

      console.log('✅ Conexión establecida con Supabase');
    } catch (error) {
      console.error('❌ Error inicializando:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las biografías
   */
  static async getAllBiographies(): Promise<Biography[]> {
    try {
      console.log('📚 Obteniendo biografías de Supabase...');

      const { data, error } = await supabase
        .from('biographies')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error:', error);
        throw error;
      }

      if (!data) {
        console.log('⚠️ No hay datos');
        return [];
      }

      // Convertir cada fila a Biography
      const biographies = await Promise.all(
        data.map(row => this.rowToBiography(row as BiographyRow))
      );

      console.log('✅ Biografías obtenidas:', biographies.length);
      return biographies;
    } catch (error) {
      console.error('❌ Error obteniendo biografías:', error);
      return [];
    }
  }

  /**
   * Obtiene una biografía por ID
   */
  static async getBiographyById(id: string): Promise<Biography | null> {
    try {
      console.log('🔍 Buscando biografía:', id);

      const { data, error } = await supabase
        .from('biographies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error:', error);
        return null;
      }

      if (!data) {
        console.log('❌ Biografía no encontrada');
        return null;
      }

      const biography = await this.rowToBiography(data as BiographyRow);
      console.log('✅ Biografía encontrada:', biography.name);
      return biography;
    } catch (error) {
      console.error('❌ Error obteniendo biografía:', error);
      return null;
    }
  }

  /**
   * Crea una nueva biografía
   */
  static async createBiography(data: CreateBiographyDTO): Promise<Biography> {
    try {
      console.log('➕ Creando biografía:', data.name);

      const newId = `user-${Date.now()}`;
      const now = new Date().toISOString();

      // 1. Insertar biografía
      const { error: bioError } = await supabase
        .from('biographies')
        .insert({
          id: newId,
          name: data.name,
          profession: data.profession,
          birth_date: data.birthDate,
          death_date: data.deathDate || null,
          image_url: data.imageUrl || null,
          summary: data.summary,
          created_at: now,
          updated_at: now,
          is_user_created: true,
          is_favorite: false,
        });

      if (bioError) {
        console.error('❌ Error insertando biografía:', bioError);
        throw bioError;
      }

      // 2. Insertar logros
      const achievementsData = data.achievements.map((achievement, index) => ({
        biography_id: newId,
        achievement,
        position: index,
      }));

      const { error: achError } = await supabase
        .from('achievements')
        .insert(achievementsData);

      if (achError) {
        console.error('❌ Error insertando logros:', achError);
        throw achError;
      }

      // 3. Insertar timeline
      const timelineData = data.timeline.map(event => ({
        id: event.id,
        biography_id: newId,
        year: event.year,
        event: event.event,
      }));

      const { error: timeError } = await supabase
        .from('timeline_events')
        .insert(timelineData);

      if (timeError) {
        console.error('❌ Error insertando timeline:', timeError);
        throw timeError;
      }

      console.log('✅ Biografía creada exitosamente:', newId);

      // Obtener y retornar la biografía completa
      const newBiography = await this.getBiographyById(newId);
      if (!newBiography) {
        throw new Error('Error al recuperar la biografía creada');
      }

      return newBiography;
    } catch (error) {
      console.error('❌ Error creando biografía:', error);
      throw error;
    }
  }

  /**
   * Actualiza una biografía
   */
  static async updateBiography(
    id: string,
    data: Partial<CreateBiographyDTO>
  ): Promise<Biography | null> {
    try {
      console.log('✏️ Actualizando biografía:', id);

      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.name) updates.name = data.name;
      if (data.profession) updates.profession = data.profession;
      if (data.birthDate) updates.birth_date = data.birthDate;
      if (data.deathDate !== undefined) updates.death_date = data.deathDate;
      if (data.imageUrl !== undefined) updates.image_url = data.imageUrl;
      if (data.summary) updates.summary = data.summary;

      // Actualizar biografía
      const { error: bioError } = await supabase
        .from('biographies')
        .update(updates)
        .eq('id', id);

      if (bioError) {
        console.error('❌ Error actualizando biografía:', bioError);
        throw bioError;
      }

      // Actualizar logros si se proporcionan
      if (data.achievements) {
        // Eliminar logros existentes
        await supabase.from('achievements').delete().eq('biography_id', id);

        // Insertar nuevos logros
        const achievementsData = data.achievements.map((achievement, index) => ({
          biography_id: id,
          achievement,
          position: index,
        }));

        await supabase.from('achievements').insert(achievementsData);
      }

      // Actualizar timeline si se proporciona
      if (data.timeline) {
        // Eliminar eventos existentes
        await supabase.from('timeline_events').delete().eq('biography_id', id);

        // Insertar nuevos eventos
        const timelineData = data.timeline.map(event => ({
          id: event.id,
          biography_id: id,
          year: event.year,
          event: event.event,
        }));

        await supabase.from('timeline_events').insert(timelineData);
      }

      console.log('✅ Biografía actualizada');
      return await this.getBiographyById(id);
    } catch (error) {
      console.error('❌ Error actualizando biografía:', error);
      return null;
    }
  }

  /**
   * Elimina una biografía
   */
  static async deleteBiography(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Eliminando biografía:', id);

      // Verificar si es creada por usuario
      const bio = await this.getBiographyById(id);
      if (!bio) {
        console.log('❌ Biografía no encontrada');
        return false;
      }

      if (!bio.isUserCreated) {
        console.log('⚠️ No se puede eliminar biografía predeterminada');
        return false;
      }

      // PostgreSQL con ON DELETE CASCADE eliminará automáticamente
      // los registros relacionados en achievements y timeline_events
      const { error } = await supabase
        .from('biographies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando:', error);
        throw error;
      }

      console.log('✅ Biografía eliminada');
      return true;
    } catch (error) {
      console.error('❌ Error eliminando biografía:', error);
      return false;
    }
  }

  /**
   * Busca biografías
   */
  static async searchBiographies(query: string): Promise<Biography[]> {
    try {
      console.log('🔍 Buscando:', query);

      // Usar ilike para búsqueda case-insensitive en PostgreSQL
      const { data, error } = await supabase
        .from('biographies')
        .select('*')
        .or(`name.ilike.%${query}%,profession.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('name');

      if (error) {
        console.error('❌ Error buscando:', error);
        throw error;
      }

      if (!data) return [];

      const biographies = await Promise.all(
        data.map(row => this.rowToBiography(row as BiographyRow))
      );

      console.log('✅ Resultados encontrados:', biographies.length);
      return biographies;
    } catch (error) {
      console.error('❌ Error buscando biografías:', error);
      return [];
    }
  }

  /**
   * Toggle favorito
   */
  static async toggleFavorite(id: string): Promise<boolean> {
    try {
      console.log('❤️ Toggle favorito:', id);

      const bio = await this.getBiographyById(id);
      if (!bio) return false;

      const newFavoriteStatus = !bio.isFavorite;

      const { error } = await supabase
        .from('biographies')
        .update({
          is_favorite: newFavoriteStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error actualizando favorito:', error);
        throw error;
      }

      console.log('✅ Favorito actualizado:', newFavoriteStatus);
      return newFavoriteStatus;
    } catch (error) {
      console.error('❌ Error toggle favorito:', error);
      throw error;
    }
  }

  /**
   * Obtiene biografías favoritas
   */
  static async getFavoriteBiographies(): Promise<Biography[]> {
    try {
      const { data, error } = await supabase
        .from('biographies')
        .select('*')
        .eq('is_favorite', true)
        .order('name');

      if (error) throw error;
      if (!data) return [];

      return await Promise.all(
        data.map(row => this.rowToBiography(row as BiographyRow))
      );
    } catch (error) {
      console.error('❌ Error obteniendo favoritos:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas
   */
  static async getStatistics(): Promise<{
    total: number;
    userCreated: number;
    favorites: number;
    byProfession: Record<string, number>;
  }> {
    try {
      // Total de biografías
      const { count: total } = await supabase
        .from('biographies')
        .select('*', { count: 'exact', head: true });

      // Biografías creadas por usuario
      const { count: userCreated } = await supabase
        .from('biographies')
        .select('*', { count: 'exact', head: true })
        .eq('is_user_created', true);

      // Favoritos
      const { count: favorites } = await supabase
        .from('biographies')
        .select('*', { count: 'exact', head: true })
        .eq('is_favorite', true);

      // Por profesión
      const { data: professionData } = await supabase
        .from('biographies')
        .select('profession');

      const byProfession: Record<string, number> = {};
      professionData?.forEach(row => {
        byProfession[row.profession] = (byProfession[row.profession] || 0) + 1;
      });

      return {
        total: total || 0,
        userCreated: userCreated || 0,
        favorites: favorites || 0,
        byProfession,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        total: 0,
        userCreated: 0,
        favorites: 0,
        byProfession: {},
      };
    }
  }
}