import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Dev {
	id: number;
	name: string;
	skills: any[];
	img: string;
}

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private database: SQLiteObject;
	private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

	developers = new BehaviorSubject([]);
	products = new BehaviorSubject([]);

	constructor(
		private plt: Platform,
		private sqlitePorter: SQLitePorter,
		private sqlite: SQLite,
		private http: HttpClient
	) {
		this.plt.ready().then(() => {
			this.sqlite.create({
				name: 'developers.db',
				location: 'default'
			});
		});
	}

	seedDatabase() {
		this.http.get('assets/seed.sql', { responseType: 'text'})
		.subscribe(sql => {
			this.sqlitePorter.importSqlToDb(this.database, sql)
				.then(_ => {
					this.loadDevelopers();
					this.loadProducts();
					this.dbReady.next(true);
				})
				.catch(e => console.error(e));
		});
	}

	getDatabaseState() {
		return this.dbReady.asObservable();
	}

	getDevs(): Observable<Dev[]> {
		return this.developers.asObservable();
	}

	getProducts(): Observable<any[]> {
		return this.products.asObservable();
	}

	loadDevelopers() {
		return this.database.executeSql('SELECT * FROM developer', []).then(data => {
			const developers: Dev[] = [];

			if (data.rows.length > 0) {
				for (let i = 0; i < data.rows.length; i++) {
					let skills = [];
					if (data.rows.item(i).skills !== '') {
						skills = JSON.parse(data.rows.item(i).skills);
					}

					developers.push({
						id: data.rows.item(i).id,
						name: data.rows.item(i).name,
						skills,
						img: data.rows.item(i).img
					});
				}
			}
			this.developers.next(developers);
		});
	}

	addDeveloper(name, skills, img) {
		const data = [name, JSON.stringify(skills), img];
		return this.database.executeSql('INSERT INTO developer (name, skills, img) VALUES (? ? ?)', data).then(data => {
			this.loadDevelopers();
		});
	}

	getDeveloper(id): Promise<Dev> {
		return this.database.executeSql('SELECT * FROM developer WHERE id = ?', [id]).then(data => {
			let skills = [];
			if (data.rows.item[0].skills !== '') {
				skills = JSON.parse(data.rows.item[0].skills);
			}

		 return {
				id: data.rows.item(0).is,
				name: data.rows.item(0).name,
				skills,
				img: data.rows.item[0].img
			};
		});
	}

	deleteDeveloper(id) {
		return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
			this.loadDevelopers();
			this.loadProducts();
		});
	}

	updateDeveloper(dev: Dev) {
		const data = [dev.name, JSON.stringify(dev.skills), dev.img];
		return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data).then(data => {
			this.loadDevelopers();
		});
	}

	loadProducts() {
// tslint:disable-next-line: max-line-length
		const query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
		return this.database.executeSql(query, []).then(data => {
			const products = [];
			if (data.rows.length > 0) {
				for (let i = 0; i < data.rows.length; i++) {
					products.push({
						name: data.rows.item(i).name,
						id: data.rows.item(i).id,
						creator: data.rows.item(i).creator,
					});
				}
			}
			this.products.next(products);
		});
	}

	addProduct(name, creator) {
		const data = [name, creator];
		return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (? ?)', data).then(data => {
			this.loadProducts();
		});
	}

}
