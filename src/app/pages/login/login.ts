import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-login',
  imports: [Header, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  message: string = "";
  messageColor: string = "red";

  constructor(private constants: Constants) { }

  ngOnInit(): void {
    const user = localStorage.getItem("user");
    if (user) {
      window.location.href = "/main";
    }
  }

  async onLogin(event: Event) {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!email || !password) {
      this.message = "กรุณากรอก Email และ Password";
      this.messageColor = "red";
      return;
    }

    try {
      const res = await fetch(`${this.constants.API_ENDPOINT}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        this.message = "เข้าสู่ระบบสำเร็จ!";
        this.messageColor = "green";
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/main";
      } else {
        this.message = data.message || "มีข้อผิดพลาด";
        this.messageColor = "red";
      }

    } catch (error) {
      this.message = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
      this.messageColor = "red";
      console.error(error);
    }
  }
}
