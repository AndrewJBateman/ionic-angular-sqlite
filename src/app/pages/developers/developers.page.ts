import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-developers',
// tslint:disable-next-line: indent
  templateUrl: './developers.page.html',
	styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {

	constructor(private db: DatabaseService) { }

	ngOnInit() {
		this.db.getDatabaseState().subscribe(ready => {
			if (ready) {

			}
	});

}
