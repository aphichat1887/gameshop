import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-purchase-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>ยืนยันการซื้อเกม</h2>

    <mat-dialog-content>
      <p>คุณต้องการซื้อเกม "{{ gameName }}" ราคา {{ gamePrice }} บาท ใช่หรือไม่?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">ยกเลิก</button>
      <button mat-flat-button color="primary" (click)="close(true)">ยืนยัน</button>
    </mat-dialog-actions>
  `
})
export class PurchaseDialogComponent {
  gameName: string = '';
  gamePrice: number = 0;

  constructor(private dialogRef: MatDialogRef<PurchaseDialogComponent>) { }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}