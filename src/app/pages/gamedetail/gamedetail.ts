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
  game: any = null;
  gameId: string = '';
  status: string = '';
  alreadyPurchased: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private constants: Constants, private router: Router,
    private dialog: MatDialog, private location: Location) { }

  ngOnInit() {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      this.status = userData.status || '';

      const gameId = this.route.snapshot.paramMap.get('id');
      if (gameId) {
        this.http.get(`${this.constants.API_ENDPOINT}/game/${gameId}`).subscribe({
          next: (res: any) => {
            this.game = res;


            this.http.get(`${this.constants.API_ENDPOINT}/check-purchase/${userData.user_id}/${gameId}`)
              .subscribe({
                next: (check: any) => this.alreadyPurchased = check.purchased,
                error: err => console.error('ตรวจสอบการซื้อเกมไม่สำเร็จ', err)
              });
          },
          error: (err) => console.error('โหลดรายละเอียดเกมไม่สำเร็จ', err)
        });
      }
    }
  }

  loadGameDetail(id: string) {
    this.http.get<any>(`${this.constants.API_ENDPOINT}/game/${id}`).subscribe({
      next: res => {
        this.game = res;
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

  // ดึงส่วนลดที่ยังไม่ใช้
  this.http.get(`${this.constants.API_ENDPOINT}/discounts/available/${user.user_id}`)
    .subscribe({
      next: (availableDiscounts) => {
        const dialogRef = this.dialog.open(PurchaseDialogComponent, {
          width: '400px',
          data: { game, discounts: availableDiscounts } // ส่งส่วนลดไปที่ dialog
        });

        dialogRef.afterClosed().subscribe(result => {
          if (!result || !result.confirmed) return;

          fetch(`${this.constants.API_ENDPOINT}/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.user_id,
              game_id: game.game_id,
              discount_code: result.discountCode
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.new_balance !== undefined) {
              user.wallet_balance = data.new_balance;
              localStorage.setItem('user', JSON.stringify(user));
              alert(`ซื้อเกมสำเร็จ! ยอดเงินคงเหลือ: ${data.new_balance} บาท`);
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
      },
      error: err => {
        console.error('ไม่สามารถโหลดส่วนลดได้', err);
        alert('ไม่สามารถโหลดส่วนลดได้ตอนนี้');
      }
    });
}

  goBack(): void {
    this.location.back();
  }
  addToCart(game: any) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.user_id) {
    alert('กรุณาเข้าสู่ระบบก่อนเพิ่มเกมในตะกร้า');
    return;
  }

  // ✅ ถ้าซื้อแล้ว ให้บอกและหยุดทำงานเลย
  if (this.alreadyPurchased) {
    alert('คุณได้ซื้อเกมนี้แล้ว ไม่สามารถเพิ่มลงในตะกร้าได้');
    return;
  }

  // ✅ ดึงตะกร้าปัจจุบัน
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // ✅ ตรวจสอบว่าเกมนี้มีในตะกร้าอยู่แล้วหรือไม่
  const exists = cart.some((item: any) => item.game_id === game.game_id);
  if (exists) {
    alert('เกมนี้อยู่ในตะกร้าแล้ว');
    return;
  }

  // ✅ เพิ่มเกมใหม่เข้าไป
  cart.push({
    game_id: game.game_id,
    game_name: game.game_name,
    price: game.price,
    game_image: game.game_image
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('เพิ่มเกมลงตะกร้าเรียบร้อย!');
}

}