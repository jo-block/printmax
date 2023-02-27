import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CalculatorService, Layout, Paper, PaperLayout, Print, Printer } from './calculator.service';
import { defaultConfig, PrintConfigInput } from './input/input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('paperCanvas', {static: false}) paperCanvas?: ElementRef;

  costPerPrint: number = 0;
  printsPerPrinting: number = 0;
  printsPerPaper: number = 0;

  public context?: CanvasRenderingContext2D;

  constructor(private calculatorService: CalculatorService) {
  }

  ngAfterViewInit(): void {
    if (this.paperCanvas !== undefined) {
      this.context = this.paperCanvas.nativeElement.getContext('2d');
      this.context?.scale(2, 2);
      this.context!.fillStyle = '#a2ff89';
    }

    const lastConfigString = localStorage.getItem('lastConfig');
    if (lastConfigString !== null) {
      const lastConfig = JSON.parse(lastConfigString) as PrintConfigInput;
      this.onCalculation(lastConfig);
    } else {
      this.onCalculation(defaultConfig);
    }
  }

  onCalculation(config: PrintConfigInput) {
    let layout: PaperLayout | undefined = this.calculatorService.calculateLayout(config);
    console.log('render new layout:', layout);

    if (layout !== undefined) {
      this.calcInfo(layout, config.printer);
      this.render(layout);
      localStorage.setItem('lastConfig', JSON.stringify(config));
    }
  }

  calcInfo(layout: PaperLayout, printer: Printer) {
    this.costPerPrint = this.calculatorService.calculateCostPerPrint(layout, printer);
    this.printsPerPaper = this.calculatorService.printsPerPaper(layout);
  }

  render(layout: PaperLayout) {
    this.context?.clearRect(0, 0, 1000, 1000);
    this.renderPaperLayout(layout);
    this.renderPaper(layout.paper);
  }

  renderPaper(paper: Paper) {
    this.context!.strokeStyle = 'blue';
    this.context!.strokeRect(0, 0, paper.width, paper.height);
  }

  renderPaperLayout(paperLayout: PaperLayout) {
    const layoutWidth = this.calculatorService.widthOf(paperLayout.layout);
    const layoutHeight = this.calculatorService.heightOf(paperLayout.layout);

    for (let i = 0; i < paperLayout.verticalColumns + paperLayout.horizontalColumns; i++) {
      if (i < paperLayout.verticalColumns) {
        for (let j = 0; j < paperLayout.verticalRowCount; j++) {
          this.renderLayoutVertical(i*layoutWidth, j*layoutHeight, paperLayout.layout);
          this.context!.strokeStyle = 'red';
          this.context!.strokeRect(i*layoutWidth, j*layoutHeight, layoutWidth, layoutHeight);
        }
      } else {
        for (let j = 0; j < paperLayout.horizontalRowCount; j++) {
          const x = (paperLayout.verticalColumns * layoutWidth) + ((i - paperLayout.verticalColumns) * layoutHeight);
          this.renderLayoutHorizontal(x, j*layoutWidth, paperLayout.layout);
          this.context!.strokeStyle = 'red';
          this.context!.strokeRect(x, j*layoutWidth, layoutHeight, layoutWidth);
        }
      }
    }
  }

  renderLayoutVertical(x: number, y: number, layout: Layout) {
    this.context!.strokeStyle = 'green';
    for (let i = 0; i < layout.verticalColumns + layout.horizontalColumns; i++) {
      if (i < layout.verticalColumns) {
        for (let j = 0; j < layout.verticalRowCount; j++) {
          this.context!.fillRect(x + (i*layout.print.width), y + (j*layout.print.height), layout.print.width, layout.print.height);
          this.context!.strokeRect(x + (i*layout.print.width), y + (j*layout.print.height), layout.print.width, layout.print.height);
        }
      } else {
        for (let j = 0; j < layout.horizontalRowCount; j++) {
          const xx = x + (layout.verticalColumns * layout.print.width) + ((i - layout.verticalColumns) * layout.print.height);
          this.context!.fillRect(xx, y + (j*layout.print.width), layout.print.height, layout.print.width);
          this.context!.strokeRect(xx, y + (j*layout.print.width), layout.print.height, layout.print.width);
        }
      }
    }
  }

  renderLayoutHorizontal(x: number, y: number, layout: Layout) {
    this.context!.strokeStyle = 'green';
    for (let i = 0; i < layout.verticalColumns + layout.horizontalColumns; i++) {
      if (i < layout.verticalColumns) {
        for (let j = 0; j < layout.verticalRowCount; j++) {
          this.context!.fillRect(x + (j*layout.print.height), y + (i*layout.print.width), layout.print.height, layout.print.width);
          this.context!.strokeRect(x + (j*layout.print.height), y + (i*layout.print.width), layout.print.height, layout.print.width);
        }
      } else {
        for (let j = 0; j < layout.horizontalRowCount; j++) {
          const yy = y + (layout.verticalColumns * layout.print.width) + ((i - layout.verticalColumns) * layout.print.height);
          this.context!.fillRect(x + (j*layout.print.width), yy, layout.print.width, layout.print.height);
          this.context!.strokeRect(x + (j*layout.print.width), yy, layout.print.width, layout.print.height);
        }
      }
    }
  }

}
