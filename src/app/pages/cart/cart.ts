import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Constants } from '../../config/constants';
import { Header } from '../../components/header/header';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    Header,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart implements OnInit {
  cart: any[] = [];
  totalPrice: number = 0;
  discountCode: string = '';
  discounts: any[] = [];
  discountApplied: boolean = false;
  discountValue: number = 0;
  finalPrice: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private constants: Constants
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadDiscounts();
    this.calculateTotal();
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]').map(
      (g: any) => ({
        ...g,
        price: Number(g.price) || 0, // 👈 แปลงให้แน่ใจว่าเป็นตัวเลข
      })
    );

    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cart.reduce((sum, game) => sum + game.price, 0);
  }

  removeFromCart(gameId: number) {
  this.cart = this.cart.filter(g => g.game_id !== gameId);
  localStorage.setItem('cart', JSON.stringify(this.cart));
  this.calculateTotal();

  // อัปเดต finalPrice ถ้ามีส่วนลด
  if (this.discountApplied) {
    this.finalPrice = Math.max(this.totalPrice - this.discountValue, 0);
  }
}

  clearCart() {
  localStorage.removeItem('cart');
  this.cart = [];
  this.totalPrice = 0;
  this.finalPrice = 0;
  this.discountApplied = false;
  this.discountValue = 0;
}

  loadDiscounts() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.user_id) return;

  this.http.get(`${this.constants.API_ENDPOINT}/discounts/available/${user.user_id}`)
    .subscribe({
      next: (res: any) => {
        this.discounts = res;
      },
      error: (err) => {
        console.error('Error loading available discounts:', err);
        this.discounts = [];
      }
    });
}

  applyDiscount() {
  if (!this.discountCode) return;

  const discount = this.discounts.find(d => d.discount_code === this.discountCode);
  if (!discount) {
    alert('โค้ดส่วนลดไม่ถูกต้อง');
    this.discountApplied = false;
    this.discountValue = 0;
    this.finalPrice = this.totalPrice;
    return;
  }

  if (discount.discount_type === 'percent') {
    this.discountValue = this.totalPrice * discount.discount_amount;
  } else if (discount.discount_type === 'flat') {
    this.discountValue = discount.discount_amount;
  }

  this.finalPrice = Math.max(this.totalPrice - this.discountValue, 0);
  this.discountApplied = true;

  setTimeout(() => {
    alert(`ใช้โค้ด ${discount.discount_code} สำเร็จ!`);
  });
}

  purchaseAll() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.user_id) return alert('กรุณาเข้าสู่ระบบ');

  const cartToPurchase = [...this.cart];

  let completed = 0;
  const errors: string[] = [];

  for (const game of cartToPurchase) {
    fetch(`${this.constants.API_ENDPOINT}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.user_id,
        game_id: game.game_id,
        discount_code: this.discountApplied ? this.discountCode : null,
      }),
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          // ✅ แยก error ของ backend
          if (data.message) alert(data.message);
          else alert('ไม่สามารถตรวจสอบโค้ดส่วนลดได้ตอนนี้');
          throw new Error(data.message || 'Purchase error');
        }

        // อัปเดต wallet
        if (data.new_balance !== undefined) {
          user.wallet_balance = data.new_balance;
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('walletUpdated'));
        }

        completed++;
        if (completed === cartToPurchase.length) {
          alert('ซื้อเกมสำเร็จทั้งหมด!');
          this.clearCart();
          this.router.navigate(['/main']);
        }
      })
      .catch(err => {
        console.error(err);
        errors.push(game.game_name);
        completed++;
        if (completed === cartToPurchase.length) {
          alert(`ซื้อเกมบางรายการไม่สำเร็จ: ${errors.join(', ')}`);
        }
      });
  }
}

  goBack() {
    this.router.navigate(['/main']);
  }
}
