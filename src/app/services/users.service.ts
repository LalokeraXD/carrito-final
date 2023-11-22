import { Injectable } from '@angular/core';
import { Login } from '../models/login.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: Login[] = [];


  constructor() {

    this.users.push({
      user: "admin",
      password: "12345"
    });
  }

  authenticate(username: string, password: string): boolean {
    const user = this.users.find(u => u.user === username && u.password === password);
    return user !== undefined;
  }
}
