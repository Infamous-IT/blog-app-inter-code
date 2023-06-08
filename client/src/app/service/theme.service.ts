import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'currentTheme';
  public currentTheme: string = 'light';

  constructor() {
    const storedTheme = localStorage.getItem(this.themeKey);
    if (storedTheme) {
      this.currentTheme = storedTheme;
      this.setTheme(this.currentTheme);
    }
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(this.currentTheme);
    localStorage.setItem(this.themeKey, this.currentTheme);
  }

  public setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
