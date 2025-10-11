import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Constants } from '../../config/constants';
import { Header } from '../../components/header/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editprofile',
  imports: [
    FormsModule,
    Header,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './editprofile.html',
  styleUrls: ['./editprofile.scss']
})
export class Editprofile {
  user: any = {};
  selectedFile: File | null = null;
  message: string = '';
  messageColor: string = 'red';
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private constants: Constants) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.previewUrl = this.user.profile_image;
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onUpdate(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('phone_number', this.user.phone_number || '');
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
    if (passwordInput) {
      formData.append('password', passwordInput);
    }
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    try {
      const res = await fetch(`${this.constants.API_ENDPOINT}/edit-profile/${this.user.user_id}`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        this.message = 'แก้ไขโปรไฟล์สำเร็จ!';
        this.messageColor = 'green';
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        this.message = data.message || 'มีข้อผิดพลาด';
        this.messageColor = 'red';
      }
    } catch (error) {
      this.message = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      this.messageColor = 'red';
      console.error(error);
    }
  }
}
