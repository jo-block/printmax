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

  canvasWidth: number = 100;
  canvasHeight: number = 100;
  renderScaling: number = 1.0;

  public context?: CanvasRenderingContext2D;

  constructor(private calculatorService: CalculatorService) {
  }

  ngAfterViewInit(): void {
    if (this.paperCanvas !== undefined) {
      const rect = this.paperCanvas.nativeElement.parentNode.getBoundingClientRect();
      this.paperCanvas.nativeElement.width = rect.width;
      this.paperCanvas.nativeElement.height = rect.height;
      this.canvasWidth = rect.width;
      console.log('canvasWidth', this.canvasWidth);
      this.canvasHeight = rect.height;
      console.log('canvasHeight', this.canvasHeight);

      this.context = this.paperCanvas.nativeElement.getContext('2d');
      this.context?.scale(1, 1);
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
    } else {
      this.context?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
  }

  calcInfo(layout: PaperLayout, printer: Printer) {
    this.costPerPrint = this.calculatorService.calculateCostPerPrint(layout, printer);
    this.printsPerPaper = this.calculatorService.printsPerPaper(layout);
  }

  render(layout: PaperLayout) {
    const renderScalingWidth = this.canvasWidth / layout.paper.width;
    const renderScalingHeight = this.canvasHeight / layout.paper.height;
    this.renderScaling = renderScalingWidth < renderScalingHeight ? renderScalingWidth : renderScalingHeight;

    console.log("renderScalingWidth", renderScalingWidth);
    console.log("renderScalingHeight", renderScalingHeight);
    console.log("this.renderScaling", this.renderScaling);

    this.context?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.renderPaperLayout(layout);
    this.renderPaper(layout.paper);
  }

  renderPaper(paper: Paper) {
    this.context!.strokeStyle = 'blue';
    this.context!.strokeRect(
      0,
      0,
      paper.width*this.renderScaling,
      paper.height*this.renderScaling);
  }

  renderPaperLayout(paperLayout: PaperLayout) {
    const layoutWidth = this.calculatorService.widthOf(paperLayout.layout);
    const layoutHeight = this.calculatorService.heightOf(paperLayout.layout);

    for (let i = 0; i < paperLayout.verticalColumns + paperLayout.horizontalColumns; i++) {
      if (i < paperLayout.verticalColumns) {
        for (let j = 0; j < paperLayout.verticalRowCount; j++) {
          this.renderLayoutVertical(i*layoutWidth, j*layoutHeight, paperLayout.layout);
          this.context!.strokeStyle = 'red';
          this.context!.strokeRect(
            i*layoutWidth*this.renderScaling,
            j*layoutHeight*this.renderScaling,
            layoutWidth*this.renderScaling,
            layoutHeight*this.renderScaling);
        }
      } else {
        for (let j = 0; j < paperLayout.horizontalRowCount; j++) {
          const x = (paperLayout.verticalColumns * layoutWidth) + ((i - paperLayout.verticalColumns) * layoutHeight);
          this.renderLayoutHorizontal(x, j*layoutWidth, paperLayout.layout);
          this.context!.strokeStyle = 'red';
          this.context!.strokeRect(
            x*this.renderScaling,
            j*layoutWidth*this.renderScaling,
            layoutHeight*this.renderScaling,
            layoutWidth*this.renderScaling);
        }
      }
    }
  }

  renderLayoutVertical(x: number, y: number, layout: Layout) {
    this.context!.strokeStyle = 'green';
    for (let i = 0; i < layout.verticalColumns + layout.horizontalColumns; i++) {
      if (i < layout.verticalColumns) {
        for (let j = 0; j < layout.verticalRowCount; j++) {
          this.context!.fillRect(
            (x + (i*layout.print.width))*this.renderScaling,
            (y + (j*layout.print.height))*this.renderScaling,
            layout.print.width*this.renderScaling,
            layout.print.height*this.renderScaling);
          this.context!.strokeRect(
            (x + (i*layout.print.width))*this.renderScaling,
            (y + (j*layout.print.height))*this.renderScaling,
            layout.print.width*this.renderScaling,
            layout.print.height*this.renderScaling);
        }
      } else {
        for (let j = 0; j < layout.horizontalRowCount; j++) {
          const xx = x + (layout.verticalColumns * layout.print.width) + ((i - layout.verticalColumns) * layout.print.height);
          this.context!.fillRect(
            xx*this.renderScaling,
            (y + (j*layout.print.width))*this.renderScaling,
            layout.print.height*this.renderScaling,
            layout.print.width*this.renderScaling);
          this.context!.strokeRect(
            xx*this.renderScaling,
            (y + (j*layout.print.width))*this.renderScaling,
            layout.print.height*this.renderScaling,
            layout.print.width*this.renderScaling);
        }
      }
    }
  }

  renderLayoutHorizontal(x: number, y: number, layout: Layout) {
    this.context!.strokeStyle = 'green';
    for (let i = 0; i < layout.verticalColumns + layout.horizontalColumns; i++) {
      if (i < layout.verticalColumns) {
        for (let j = 0; j < layout.verticalRowCount; j++) {
          this.context!.fillRect(
            (x + (j*layout.print.height))*this.renderScaling,
            (y + (i*layout.print.width))*this.renderScaling,
            layout.print.height*this.renderScaling,
            layout.print.width*this.renderScaling);
          this.context!.strokeRect(
            (x + (j*layout.print.height))*this.renderScaling,
            (y + (i*layout.print.width))*this.renderScaling,
            layout.print.height*this.renderScaling,
            layout.print.width*this.renderScaling);
        }
      } else {
        for (let j = 0; j < layout.horizontalRowCount; j++) {
          const yy = y + (layout.verticalColumns * layout.print.width) + ((i - layout.verticalColumns) * layout.print.height);
          this.context!.fillRect(
            (x + (j*layout.print.width))*this.renderScaling,
            yy*this.renderScaling,
            layout.print.width*this.renderScaling,
            layout.print.height*this.renderScaling);
          this.context!.strokeRect(
            (x + (j*layout.print.width))*this.renderScaling,
            yy*this.renderScaling,
            layout.print.width*this.renderScaling,
            layout.print.height*this.renderScaling);
        }
      }
    }
  }

}
