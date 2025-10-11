import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-top-up-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule
  ],
  template: `
    <h2 mat-dialog-title>เติมเงินเข้ากระเป๋า</h2>

    <mat-dialog-content>
      <p>กรุณาเลือกหรือกรอกจำนวนเงินที่ต้องการเติม</p>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>จำนวนเงิน</mat-label>
        <mat-select [(ngModel)]="selectedAmount">
          <mat-option *ngFor="let amount of presetAmounts" [value]="amount">
            {{ amount | number }} บาท
          </mat-option>
        </mat-select>
      </mat-form-field>

      <p class="text-center">หรือกรอกเอง:</p>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>จำนวนเงิน (บาท)</mat-label>
        <input matInput type="number" [(ngModel)]="customAmount" placeholder="เช่น 1000" />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>ยกเลิก</button>
      <button mat-flat-button color="primary" (click)="confirmTopUp()">ยืนยัน</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-full { width: 100%; }
    mat-dialog-content { display: flex; flex-direction: column; gap: 10px; }
  `]
})
export class TopUpDialogComponent {
  presetAmounts = [100, 300, 500, 1000];
  selectedAmount?: number;
  customAmount?: number;

  constructor(private dialogRef: MatDialogRef<TopUpDialogComponent>) { }

  confirmTopUp() {
    const amount = this.customAmount || this.selectedAmount;
    if (!amount || amount <= 0) {
      alert('กรุณาระบุจำนวนเงินให้ถูกต้อง');
      return;
    }
    this.dialogRef.close(amount);
  }
}