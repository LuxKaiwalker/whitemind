import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialMdComponent } from './tutorial-md.component';

describe('TutorialMdComponent', () => {
  let component: TutorialMdComponent;
  let fixture: ComponentFixture<TutorialMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialMdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
