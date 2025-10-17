import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Header, HttpClientModule, FormsModule],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class Main implements OnInit {
  username: string = "";
  status: string = '';
  profileImage: string = "";
  games: any[] = [];
  filteredGames: any[] = [];

  categories: any[] = [];
  searchText: string = '';
  selectedCategory: string = '';

  constructor(private router: Router, private http: HttpClient, private constants: Constants) { }

  ngOnInit(): void {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      this.username = userData.username;
      this.status = userData.status || '';
      this.profileImage = userData.profile_image
        ? userData.profile_image
        : "assets/default-avatar.png";
    }

    this.loadGames();
    this.loadCategories();
  }

  goToEditProfile() {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      this.router.navigate(['/edit-profile'], { state: { user: userData } });
    }
  }

  loadGames() {
    this.http.get<any[]>(`${this.constants.API_ENDPOINT}/games`).subscribe({
      next: (res) => {
        this.games = res;
        this.filteredGames = res;
      },
      error: (err) => console.error('โหลดเกมไม่สำเร็จ', err),
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${this.constants.API_ENDPOINT}/categories`).subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('โหลดหมวดหมู่ไม่สำเร็จ', err),
    });
  }

  searchGames() {
    this.filteredGames = this.games.filter(game => {
      const matchesName = game.game_name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory ? game.category_id == this.selectedCategory : true;
      return matchesName && matchesCategory;
    });
  }
  goToGameDetail(gameId: number) {

    this.router.navigate(['/game-detail', gameId]);
  }
  logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }
}
