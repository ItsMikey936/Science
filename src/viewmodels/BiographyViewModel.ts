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
  async loadBiographies() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const biographies = await BiographyService.getAllBiographies();
      this.setBiographies(biographies);
    } catch (error) {
      this.setError('Error al cargar las biografías');
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  async getBiographyById(id: string): Promise<Biography | null> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const biography = await BiographyService.getBiographyById(id);
      return biography;
    } catch (error) {
      this.setError('Error al obtener la biografía');
      console.error(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async createBiography(data: CreateBiographyDTO): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await BiographyService.createBiography(data);
      await this.loadBiographies(); // Recargar la lista
      return true;
    } catch (error) {
      this.setError('Error al crear la biografía');
      console.error(error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async updateBiography(id: string, data: Partial<CreateBiographyDTO>): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const updated = await BiographyService.updateBiography(id, data);
      if (updated) {
        await this.loadBiographies();
        return true;
      }
      return false;
    } catch (error) {
      this.setError('Error al actualizar la biografía');
      console.error(error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteBiography(id: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const success = await BiographyService.deleteBiography(id);
      if (success) {
        await this.loadBiographies();
      }
      return success;
    } catch (error) {
      this.setError('Error al eliminar la biografía');
      console.error(error);
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
    try {
      const biography = this._biographies.find(b => b.id === id);
      if (!biography) return false;

      const updatedBiographies = this._biographies.map(b =>
        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
      );
      
      this.setBiographies(updatedBiographies);
      return true;
    } catch (error) {
      this.setError('Error al actualizar favorito');
      console.error(error);
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