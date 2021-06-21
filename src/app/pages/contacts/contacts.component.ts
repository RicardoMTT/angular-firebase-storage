import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  employees$: Observable<any[]>;

  constructor(private usersService: UsersService) {
    this.employees$ = this.usersService.getEmployees();
  }

  ngOnInit(): void {}
}
