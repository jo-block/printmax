import { Injectable } from '@angular/core';
import { allSummandTuples, possibleSummand } from './mathHelper';

export interface Paper {
  width: number,
  height: number,
  cost: number
}

export interface Print {
  width: number,
  height: number
}

export interface Printer {
  maxWidth: number,
  minWidth: number,
  maxHeight: number,
  minHeigth: number,
  costPerPage: number
}

export interface Layout {
  horizontalRows: number,
  horizontalCount: number,
  verticalRows: number,
  verticalCount: number,
  width: number,
  height: number
}

export interface LayoutRow {
  paper: Paper,
  count: number
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  paper: Paper = {width: 17, height: 19, cost: 4.5};
  printer: Printer = {costPerPage: 3.5, maxHeight: 10, maxWidth: 10, minHeigth: 5, minWidth: 5};

  print: Print = {width: 4, height: 3};

  prints = 1000;

  constructor() {
    this.allOptions()
  }

  public calculateLayout() {

  }

  private allOptions() {
    let possibleLayouts = allSummandTuples(this.print.width, this.print.height, this.printer.maxWidth, this.printer.minWidth)
      .map(e => {
        this.calculatePossibleLayoutWithCost(e.a, e.b);
        return {};
      });
  }

  private calculatePossibleLayoutWithCost(widthRowCount: number, heightRowCount: number) {
    let width = widthRowCount * this.print.width + heightRowCount * this.print.height;
    let heightOptions = possibleSummand(this.print.width, this.print.height, this.printer.maxHeight, this.printer.minHeigth);

    let layoutsWithDifferentHeights: {cost: number, height: number}[] = [];

    heightOptions.forEach(height => {
      let widthPrintsOnLayout = widthRowCount * Math.floor(height / this.print.height);
      let heightPrintsOnLayout = heightRowCount * Math.floor(height / this.print.width);
      let printsOnLayout = widthPrintsOnLayout + heightPrintsOnLayout;
      let layoutsOnPaperWidth =  Math.floor(this.paper.width / width) * Math.floor(this.paper.height / height);
      let layoutsOnPaperHeight = Math.floor(this.paper.width / height) * Math.floor(this.paper.height / width);
      let layoutsOnPaper = layoutsOnPaperWidth > layoutsOnPaperHeight ? layoutsOnPaperWidth : layoutsOnPaperHeight;
      let printsOnPaper = printsOnLayout * layoutsOnPaper;
      let cost = Math.ceil(this.prints / printsOnPaper) * (this.paper.cost + (layoutsOnPaper * this.printer.costPerPage));

      layoutsWithDifferentHeights.push({cost, height});
    });

    let height = layoutsWithDifferentHeights
      .sort((e1, e2) => e1.cost - e2.cost)
      .at(0);

    console.log(width, height)
  }

  private bestLayoutOnPaper(layoutWidth: number, layoutHeight: number) {
    let layoutsOnPaperWidth =  Math.floor(this.paper.width / layoutWidth) * Math.floor(this.paper.height / layoutHeight);
    let layoutsOnPaperHeight = Math.floor(this.paper.width / layoutHeight) * Math.floor(this.paper.height / layoutWidth);
    let layoutsOnPaper = layoutsOnPaperWidth > layoutsOnPaperHeight ? layoutsOnPaperWidth : layoutsOnPaperHeight;
  }

}
