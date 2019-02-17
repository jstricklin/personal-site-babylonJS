import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgCanvasComponent } from './bg-canvas.component';

describe('BgCanvasComponent', () => {
  let component: BgCanvasComponent;
  let fixture: ComponentFixture<BgCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
