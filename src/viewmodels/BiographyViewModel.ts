import { Biography, CreateBiographyDTO } from '../models/Biography';
import { BiographyService } from '../services/BiographyService';

export class BiographyViewModel {
  // Estado observable
  private listeners: Set<() => void> = new Set();
  
  private _biographies: Biography[] = [];
  private _loading: boolean = false;
  private _error: string | null = null;
  private _searchQuery: string = '';

  // Getters (simulan propiedades observables)
  get biographies(): Biography[] {
    return this._biographies;
  }

  get loading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  get filteredBiographies(): Biography[] {
    if (!this._searchQuery.trim()) {
      return this._biographies;
    }
    const query = this._searchQuery.toLowerCase();
    return this._biographies.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.profession.toLowerCase().includes(query)
    );
  }

  get userCreatedBiographies(): Biography[] {
    return this._biographies.filter(b => b.isUserCreated);
  }

  get defaultBiographies(): Biography[] {
    return this._biographies.filter(b => !b.isUserCreated);
  }

  get favoriteBiographies(): Biography[] {
    return this._biographies.filter(b => b.isFavorite);
  }

  get stats(): {
    total: number;
    userCreated: number;
    favorites: number;
    byProfession: Record<string, number>;
  } {
    const stats = {
      total: this._biographies.length,
      userCreated: this.userCreatedBiographies.length,
      favorites: this.favoriteBiographies.length,
      byProfession: {} as Record<string, number>,
    };

    this._biographies.forEach(bio => {
      const prof = bio.profession;
      stats.byProfession[prof] = (stats.byProfession[prof] || 0) + 1;
    });

    return stats;
  }

  // Suscripción para Data Binding
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private setLoading(value: boolean) {
    this._loading = value;
    this.notifyListeners();
  }

  private setError(error: string | null) {
    this._error = error;
    this.notifyListeners();
  }

  private setBiographies(biographies: Biography[]) {
    this._biographies = biographies;
    this.notifyListeners();
  }

  setSearchQuery(query: string) {
    this._searchQuery = query;
    this.notifyListeners();
  }

  // Comandos (Actions)
  async loadBiographies(): Promise<void> {
    console.log('📥 loadBiographies iniciado');
    this.setLoading(true);
    this.setError(null);
    
    try {
      const biographies = await BiographyService.getAllBiographies();
      console.log('✅ Biografías cargadas:', biographies.length);
      this.setBiographies(biographies);
    } catch (error) {
      console.error('❌ Error en loadBiographies:', error);
      this.setError('Error al cargar las biografías');
    } finally {
      this.setLoading(false);
    }
  }

  async getBiographyById(id: string): Promise<Biography | null> {
    console.log('🔍 getBiographyById:', id);
    
    try {
      const biography = await BiographyService.getBiographyById(id);
      console.log('✅ Biografía encontrada:', biography?.name);
      return biography;
    } catch (error) {
      console.error('❌ Error en getBiographyById:', error);
      this.setError('Error al obtener la biografía');
      return null;
    }
  }

  async createBiography(data: CreateBiographyDTO): Promise<boolean> {
    console.log('➕ createBiography iniciado con datos:', data);
    this.setLoading(true);
    this.setError(null);
    
    try {
      const newBio = await BiographyService.createBiography(data);
      console.log('✅ Biografía creada:', newBio.id, newBio.name);
      
      // Recargar biografías
      await this.loadBiographies();
      console.log('✅ Lista recargada, total:', this._biographies.length);
      
      return true;
    } catch (error) {
      console.error('❌ Error en createBiography:', error);
      this.setError('Error al crear la biografía');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async updateBiography(id: string, data: Partial<CreateBiographyDTO>): Promise<boolean> {
    console.log('✏️ updateBiography:', id);
    this.setLoading(true);
    this.setError(null);
    
    try {
      const updated = await BiographyService.updateBiography(id, data);
      if (updated) {
        console.log('✅ Biografía actualizada');
        await this.loadBiographies();
        return true;
      }
      console.log('❌ No se pudo actualizar');
      return false;
    } catch (error) {
      console.error('❌ Error en updateBiography:', error);
      this.setError('Error al actualizar la biografía');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteBiography(id: string): Promise<boolean> {
    console.log('🗑️ deleteBiography iniciado:', id);
    this.setLoading(true);
    this.setError(null);
    
    try {
      const success = await BiographyService.deleteBiography(id);
      console.log('🗑️ Resultado de BiographyService.deleteBiography:', success);
      
      if (success) {
        console.log('✅ Eliminación exitosa, recargando lista...');
        await this.loadBiographies();
        console.log('✅ Lista recargada, biografías actuales:', this._biographies.length);
        return true;
      }
      
      console.log('❌ No se pudo eliminar');
      return false;
    } catch (error) {
      console.error('❌ Error en deleteBiography:', error);
      this.setError('Error al eliminar la biografía');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async searchBiographies(query: string): Promise<Biography[]> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const results = await BiographyService.searchBiographies(query);
      return results;
    } catch (error) {
      this.setError('Error al buscar biografías');
      console.error(error);
      return [];
    } finally {
      this.setLoading(false);
    }
  }

  async toggleFavorite(id: string): Promise<boolean> {
    console.log('❤️ toggleFavorite:', id);
    
    try {
      const biography = this._biographies.find(b => b.id === id);
      if (!biography) {
        console.log('❌ Biografía no encontrada');
        return false;
      }

      const updatedBiographies = this._biographies.map(b =>
        b.id === id ? { ...b, isFavorite: !b.isFavorite, updatedAt: new Date().toISOString() } : b
      );
      
      console.log('✅ Favorito actualizado');
      this.setBiographies(updatedBiographies);
      return true;
    } catch (error) {
      console.error('❌ Error en toggleFavorite:', error);
      this.setError('Error al actualizar favorito');
      return false;
    }
  }

  clearSearch() {
    this.setSearchQuery('');
  }

  clearError() {
    this.setError(null);
  }
}