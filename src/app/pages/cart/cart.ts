import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Constants } from '../../config/constants';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, Header],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
  cart: any[] = [];
  totalPrice: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
      .map((g: any) => ({
        ...g,
        price: Number(g.price) || 0  // 👈 แปลงให้แน่ใจว่าเป็นตัวเลข
      }));

    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cart.reduce((sum, game) => sum + game.price, 0);
  }

  removeFromCart(gameId: number) {
    this.cart = this.cart.filter(g => g.game_id !== gameId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotal();
  }

  clearCart() {
    localStorage.removeItem('cart');
    this.cart = [];
    this.totalPrice = 0;
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}