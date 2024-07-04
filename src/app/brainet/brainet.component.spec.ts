import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainetComponent } from './brainet.component';

describe('BrainetComponent', () => {
  let component: BrainetComponent;
  let fixture: ComponentFixture<BrainetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
