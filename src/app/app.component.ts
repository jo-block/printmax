import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('paperCanvas', {static: false}) paperCanvas?: ElementRef;

  public context?: CanvasRenderingContext2D;

  constructor(calculatorService: CalculatorService) {

  }

  ngAfterViewInit(): void {
    if (this.paperCanvas !== undefined) {
      this.context = this.paperCanvas.nativeElement.getContext('2d');

      this.context!.font = "30px Arial";
      this.context!.fillText("Hello World", 10, 50);
      this.context!.strokeRect(100, 100, 100, 100);
    }
  }

}
