import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/constants/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  tokenGoogle: string;
  clientID: string;

  constructor(private navigation: Router) {
    this.tokenGoogle = '';
    this.clientID = config.CLIENT_ID_GOOGLE;
  }

  ngOnInit() {
    document.getElementById('g_id_onload')?.setAttribute('data-client_id', this.clientID);
    this.tokenGoogle = sessionStorage.getItem(config.SESSION_STORAGE.TOKEN_GOOGLE) || '';
    if(this.tokenGoogle !== ''){
      this.navigation.navigate(['/home']);
    }
  }

  logOut() {
    sessionStorage.clear();
    location.replace('/login');
  }

}
