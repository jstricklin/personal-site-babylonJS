import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @Output('changeTheme') changeTheme = new EventEmitter<string>();
    @Input() selectedTheme: string;

  constructor() { }

  ngOnInit() {
      this.selectedTheme = 'color';
  }

    setTheme(theme: string) {
        this.changeTheme.emit(theme);
    }

}
