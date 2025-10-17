import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Header } from '../../components/header/header';
import { Constants } from '../../config/constants';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Header, MatButtonModule],
  templateUrl: './history-user.html',
  styleUrls: ['./history-user.scss']
})
export class HistoryUser implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private constants: Constants, private location: Location, private router: Router) { }

  ngOnInit() {
    this.http.get(`${this.constants.API_ENDPOINT}/users`).subscribe({
      next: (res: any) => {
        this.users = res.users.filter((u: any) => u.status === 'user');
      },
      error: (err) => console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ', err)
    });
  }
  goToUserHistory(userId: number) {
    this.router.navigate(['/history', userId]);
  }

  goBack(): void {
    this.location.back();
  }
}
