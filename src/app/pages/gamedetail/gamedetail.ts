import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Constants } from '../../config/constants';
import { Header } from '../../components/header/header';
import { PurchaseDialogComponent } from '../../components/purchase-dialog/purchase-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gamedetail',

  imports: [CommonModule, HttpClientModule, Header, MatIconModule, MatButtonModule],
  templateUrl: './gamedetail.html',
  styleUrls: ['./gamedetail.scss']
})
export class Gamedetail implements OnInit {
  game: any = null; // เก็บข้อมูลเกม
  gameId: string = '';
  status: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private constants: Constants, private router: Router,
    private dialog: MatDialog, private location: Location) { }

  ngOnInit() {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      this.status = userData.status || '';
    }
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.http.get(`${this.constants.API_ENDPOINT}/game/${gameId}`).subscribe({
        next: (res: any) => this.game = res,
        error: (err) => console.error('โหลดรายละเอียดเกมไม่สำเร็จ', err)
      });
    }
  }

  loadGameDetail(id: string) {
    this.http.get<any>(`${this.constants.API_ENDPOINT}/game/${id}`).subscribe({
      next: res => {
        this.game = res; // สมมติ API คืนข้อมูลเกมตรง ๆ
      },
      error: err => {
        console.error('โหลดข้อมูลเกมไม่สำเร็จ', err);
      }
    });
  }
  goToEditGame(gameId: any) {
    console.log('ไปหน้า edit-game', gameId);
    this.router.navigate(['/edit-game', gameId]);
  }

  buyGame(game: any) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.user_id) {
      alert('กรุณาเข้าสู่ระบบก่อนซื้อเกม');
      return;
    }

    // เปิด dialog ยืนยันการซื้อ
    const dialogRef = this.dialog.open(PurchaseDialogComponent, {
      width: '400px'
    });

    const instance = dialogRef.componentInstance;
    instance.gameName = game.game_name;
    instance.gamePrice = game.price;

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      // ซื้อเกมจริง
      fetch(`${this.constants.API_ENDPOINT}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, game_id: game.game_id })
      })
        .then(res => res.json())
        .then(data => {
          if (data.new_balance !== undefined) {
            // อัปเดต localStorage
            user.wallet_balance = data.new_balance;
            localStorage.setItem('user', JSON.stringify(user));

            alert(`ซื้อเกมสำเร็จ! ยอดเงินคงเหลือ: ${data.new_balance} บาท`);

            // redirect กลับ main page
            this.router.navigate(['/main']);
          } else {
            alert(data.message || 'เกิดข้อผิดพลาด');
          }
        })
        .catch(err => {
          console.error(err);
          alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        });
    });
  }

  goBack(): void {
    this.location.back();
  }

}
