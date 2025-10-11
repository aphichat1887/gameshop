import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Constants {
    public readonly API_ENDPOINT: string = 'http://localhost:3000';
    //public readonly API_ENDPOINT: string = 'https://gameapi-8wya.onrender.com';
}