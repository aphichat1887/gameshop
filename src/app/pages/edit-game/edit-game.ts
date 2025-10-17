import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    Header
  ],
  templateUrl: './edit-game.html',
  styleUrls: ['./edit-game.scss']
})
export class EditGame implements OnInit {
  game: any = {};
  gameId: string = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  message: string = '';
  messageColor: string = 'green';

  constructor(private route: ActivatedRoute, private http: HttpClient, private constants: Constants, private router: Router) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    if (this.gameId) this.loadGameDetail(this.gameId);
  }

  loadGameDetail(id: string) {
    this.http.get<any>(`${this.constants.API_ENDPOINT}/game/${id}`).subscribe({
      next: res => {
        this.game = res;
        this.previewUrl = res.game_image;
      },
      error: err => console.error('โหลดข้อมูลเกมไม่สำเร็จ', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onUpdate(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('game_name', this.game.game_name);
    formData.append('description', this.game.description);
    formData.append('price', this.game.price);


    if (this.selectedFile) {
      formData.append('game_image', this.selectedFile);
    }

    this.http.put(`${this.constants.API_ENDPOINT}/edit-game/${this.gameId}`, formData)
      .subscribe({
        next: () => {
          this.message = 'อัปเดตเกมสำเร็จ';
          this.messageColor = 'green';
          this.router.navigate(['/game-detail', this.gameId]);
        },
        error: err => {
          console.error('อัปเดตเกมไม่สำเร็จ', err);
          this.message = 'อัปเดตเกมไม่สำเร็จ';
          this.messageColor = 'red';
        }
      });
  }

  onDelete(gameId: any) {
    if (!confirm("คุณแน่ใจไหมว่าต้องการลบเกมนี้?")) return;

    this.http.delete(`${this.constants.API_ENDPOINT}/game/${gameId}`).subscribe({
      next: () => {
        this.message = "ลบเกมสำเร็จ";
        this.messageColor = "green";
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.message = "ลบเกมไม่สำเร็จ";
        this.messageColor = "red";
      }
    });
  }

}

