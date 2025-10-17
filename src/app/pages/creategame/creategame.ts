import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';

@Component({
  standalone: true,
  selector: 'app-creategame',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './creategame.html',
  styleUrls: ['./creategame.scss'],

})
export class Creategame implements OnInit {
  game_name: string = '';
  price: number | null = null;
  category_id: number | null = null;
  description: string = '';
  release_date: string = '';
  selectedFile: File | null = null;

  categories: { category_id: number; category_name: string }[] = [];

  constructor(private http: HttpClient, private constants: Constants,
    private router: Router) { }

  ngOnInit(): void {
    this.http.get<any[]>(`${this.constants.API_ENDPOINT}/categories`).subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error(err),
    });

    const today = new Date();
    this.release_date = today.toISOString().split('T')[0];

  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addGame(): void {
    if (!this.game_name || this.price === null || this.category_id === null) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();
    formData.append('game_name', this.game_name);
    formData.append('price', String(this.price));
    formData.append('category_id', String(this.category_id));
    formData.append('description', this.description);
    formData.append('release_date', this.release_date);

    if (this.selectedFile) {
      formData.append('game_image', this.selectedFile);
    }

    this.http.post(`${this.constants.API_ENDPOINT}/addGame`, formData).subscribe({
      next: (res: any) => {
        alert('เพิ่มเกมสำเร็จ!');
        console.log(res);
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการเพิ่มเกม');
      },
    });
  }


}
