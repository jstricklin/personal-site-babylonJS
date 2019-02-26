import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'babylon-personal';
    theme = '';
    setTheme(e) {
        this.theme = e;
    }
}
