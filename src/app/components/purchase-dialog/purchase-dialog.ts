import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-purchase-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>ยืนยันการซื้อเกม</h2>

    <mat-dialog-content>
      <p>คุณต้องการซื้อเกม "{{ gameName }}" ราคา {{ gamePrice | number }} บาท ใช่หรือไม่?</p>
      
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>เลือกโค้ดส่วนลด</mat-label>
        <mat-select [(value)]="selectedDiscountCode" (selectionChange)="calculateFinalPrice()">
          <mat-option value="">ไม่มีส่วนลด</mat-option>
          <mat-option *ngFor="let d of discounts" [value]="d.discount_code">
            {{ d.discount_code }} - 
            {{ d.discount_type === 'flat' ? d.discount_amount + ' บาท' : d.discount_amount*100 + '%' }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      
      <p *ngIf="finalPrice !== null">ราคาหลังส่วนลด: {{ finalPrice | number }} บาท</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">ยกเลิก</button>
      <button mat-flat-button color="primary" (click)="confirmPurchase()">ยืนยัน</button>
    </mat-dialog-actions>
  `
})
export class PurchaseDialogComponent implements OnInit {
  gameName: string = '';
  gamePrice: number = 0;
  discounts: any[] = [];
  selectedDiscountCode: string = '';
  finalPrice: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.gameName = this.data.game.game_name;
    this.gamePrice = this.data.game.price;
    this.discounts = this.data.discounts || [];
    this.finalPrice = this.gamePrice;
  }

  calculateFinalPrice() {
    const discount = this.discounts.find(d => d.discount_code === this.selectedDiscountCode);
    let price = this.gamePrice;
    if (discount) {
      if (discount.discount_type === 'flat') price -= discount.discount_amount;
      else if (discount.discount_type === 'percent') price *= (1 - discount.discount_amount);
      if (price < 0) price = 0;
    }
    this.finalPrice = price;
  }

  confirmPurchase() {
    this.dialogRef.close({ confirmed: true, discountCode: this.selectedDiscountCode });
  }

  close(result: boolean) {
    this.dialogRef.close({ confirmed: result });
  }
}