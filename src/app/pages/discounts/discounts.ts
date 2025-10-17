import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ เพิ่มบรรทัดนี้
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-discounts',
  imports: [Header , CommonModule, HttpClientModule, FormsModule], // ✅ เพิ่ม FormsModule ที่นี่
  templateUrl: './discounts.html',
  styleUrl: './discounts.scss'
})
export class Discounts {
  discount_code = '';
  discount_amount = 0;
  discount_type = 'flat';
  usage_limit = 1;

  constructor(private http: HttpClient, private constants: Constants) {}

  addDiscount() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.post(`${this.constants.API_ENDPOINT}/discounts`, {
      discount_code: this.discount_code,
      discount_amount: this.discount_amount,
      discount_type: this.discount_type,
      usage_limit: this.usage_limit,
      created_by: user.user_id
    }).subscribe(() => alert('เพิ่มโค้ดสำเร็จ'));
  }
}
