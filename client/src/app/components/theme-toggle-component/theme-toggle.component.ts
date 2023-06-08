import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {
  isDarkTheme: boolean;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    this.updateTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', this.isDarkTheme.toString());
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.isDarkTheme) {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }
}

