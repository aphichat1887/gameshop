import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '../../config/constants';
import { TopUpDialogComponent } from '../top-up-dialog/top-up-dialog';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  username: string = "";
  status: string = '';
  profileImage: string = "";
  wallet_balance: number = 0;

  constructor(private router: Router, private dialog: MatDialog, private constants: Constants) { }

  ngOnInit(): void {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      this.username = userData.username;
      this.status = userData.status || '';
      this.profileImage = userData.profile_image
        ? userData.profile_image
        : "assets/default-avatar.png";
      this.wallet_balance = userData.wallet_balance || 0;
    }
  }

  openTopUpDialog() {
    const dialogRef = this.dialog.open(TopUpDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(amount => {
      if (amount) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.user_id) return;

        fetch(`${this.constants.API_ENDPOINT}/topup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.user_id,
            amount: amount
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.new_balance !== undefined) {
              this.wallet_balance = data.new_balance;

              // อัปเดตใน localStorage ด้วย
              user.wallet_balance = data.new_balance;
              localStorage.setItem('user', JSON.stringify(user));

              alert(`เติมเงินสำเร็จ +${amount} บาท`);
            } else {
              alert(data.message || 'เกิดข้อผิดพลาด');
            }
          })
          .catch(err => {
            console.error(err);
            alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
          });
      }
    });
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }

  goToProfile() {
    this.router.navigate(['/edit-profile']);
  }

  createGame() {
    this.router.navigate(['/creategame']);
  }

  goToUserHistory() {
    this.router.navigate(['/history-user']);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}