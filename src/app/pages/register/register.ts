import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Constants } from '../../config/constants';


@Component({
  selector: 'app-register',
  imports: [RouterModule, Header, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  message: string = "";
  messageColor: string = "red";
  previewUrl: string | ArrayBuffer | null = null;


  constructor(private router: Router, private constants: Constants) { }


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", (document.getElementById("username") as HTMLInputElement).value);
    formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
    formData.append("phone_number", (document.getElementById("phone_number") as HTMLInputElement).value);
    formData.append("password", (document.getElementById("password") as HTMLInputElement).value);

    const fileInput = document.getElementById("profile_image") as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append("profile_image", fileInput.files[0]);
    }

    const res = await fetch(`${this.constants.API_ENDPOINT}/register`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log(data);
    if (data.success) {
      this.router.navigate(['/']);
    } else {
      this.message = data.message || "Register failed.";
      this.messageColor = "red";
    }
  }

}