import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { Header } from '../../components/header/header';
import { Constants } from '../../config/constants';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  // Make sure to import MatButtonModule here for the back button
  imports: [CommonModule, HttpClientModule, Header, MatButtonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss']
})
export class History implements OnInit {
  username: string = '';
  
  // These will hold the filtered data for display
  purchasedGames: any[] = [];
  topUpHistory: any[] = [];

  constructor(private http: HttpClient, private constants: Constants, private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
  // 1️⃣ ตรวจสอบ route param ก่อน
  let userId = this.route.snapshot.paramMap.get('userId');

  // 2️⃣ ถ้าไม่มี param ให้ใช้ userId ของตัวเองจาก localStorage
  if (!userId) {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      userId = userData.user_id;
    }
  }

  if (!userId) {
    console.error('ไม่พบ userId');
    return;
  }

  // Fetch transactions
  this.http.get(`${this.constants.API_ENDPOINT}/transactions/${userId}`)
    .subscribe({
      next: (res: any) => {
        this.topUpHistory = res.topUps || [];
        this.purchasedGames = res.purchases || [];
      },
      error: (err) => console.error('โหลดประวัติไม่สำเร็จ', err)
    });

  // Fetch username
  this.http.get(`${this.constants.API_ENDPOINT}/user/${userId}`)
    .subscribe({
      next: (res: any) => this.username = res.user.username,
      error: (err) => console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้', err)
    });
}

  goBack(): void {
    this.location.back();
  }
}
