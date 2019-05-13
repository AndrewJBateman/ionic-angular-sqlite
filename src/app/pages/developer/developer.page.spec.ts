import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperPage } from './developer.page';

describe('DeveloperPage', () => {
  let component: DeveloperPage;
  let fixture: ComponentFixture<DeveloperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
