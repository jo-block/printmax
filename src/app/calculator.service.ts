import { Injectable } from '@angular/core';
import { allSummandTuplesBetweenMinMax, possibleSummand } from './mathHelper';
import { PrintConfigInput } from './input/input.component';

// vertical
//
//   width
// -------- h
// |      | e
// |      | i
// |      | g
// |      | h
// -------- t
//

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
  horizontalColumns: number,
  horizontalRowCount: number,
  verticalColumns: number,
  verticalRowCount: number,
  print: Print
}

export interface PaperLayout {
  horizontalColumns: number,
  horizontalRowCount: number,
  verticalColumns: number,
  verticalRowCount: number,
  layout: Layout,
  paper: Paper
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  calculateLayout(config: PrintConfigInput): PaperLayout | undefined {
    // alle möglichen Durck-Breiten auf die ein ganzahliges Vielfaches eines Drucks passt mit aufteilung in horizontale und vertikale Anordnung der Drucke
    let possibleVerticalHorizontalTuples: {a: number, b: number, sum: number}[] =
      allSummandTuplesBetweenMinMax(config.print.width, config.print.height, config.printer.maxWidth, config.printer.minWidth);

    // alle möglichen Druck-Höhen auf die ein ganzahliges Vielfaches eines Drucks passt (ohne Aufteilung in horizontale und vertikale Anordnung, da innherhalb einer Spalte nicht gewechselt wird)
    let heightOptions: number[] =
      Array.from(possibleSummand(config.print.width, config.print.height, config.printer.maxHeight, config.printer.minHeigth).values());

    let possibleLayouts: Layout[] = possibleVerticalHorizontalTuples
      .flatMap(tuple => heightOptions
        .map(height => this.calculatePrintLayout(config.print, tuple.a, tuple.b, height)));

    let bestLayout = possibleLayouts
      .map(l => this.calculatePaperLayout(l, config.paper, config.printer))
      .filter((value): value is PaperLayout => !!value)
      .sort((l1, l2) => this.calculateCostPerPrint(l1, config.printer) - this.calculateCostPerPrint(l2, config.printer))
      .at(0);

    return bestLayout;
  }

  private calculatePrintLayout(print: Print, verticalColumns: number, horizontalColumns: number, height: number): Layout {
    let verticalRowCount = Math.floor(height / print.height);
    let horizontalRowCount = Math.floor(height / print.width);

    return {
      verticalColumns,
      verticalRowCount,
      horizontalColumns,
      horizontalRowCount,
      print
    };
  }

  calculatePaperLayout(layout: Layout, paper: Paper, printer: Printer): PaperLayout | undefined {
    const layoutWidth = this.widthOf(layout);
    const layoutHeight = this.heightOf(layout);

    // alle möglichen Druck-Layout Aufteilungen in horizontale und vertikale Anordnung der Layouts auf der Papier Breite
    const possibleVerticalHorizontalTuples: {a: number, b: number, sum: number}[] =
      allSummandTuplesBetweenMinMax(layoutWidth, layoutHeight, paper.width, 0);

    const possibleLayouts: PaperLayout[] = possibleVerticalHorizontalTuples.map(tuple => {
      let verticalRowCount = Math.floor(paper.height / layoutHeight);
      let horizontalRowCount = Math.floor(paper.height / layoutWidth);

      return {
        verticalColumns: tuple.a,
        verticalRowCount,
        horizontalColumns: tuple.b,
        horizontalRowCount,
        layout,
        paper
      };
    })

    const bestLayout = possibleLayouts
      .sort((l1, l2) => this.calculateCostPerPrint(l1, printer) - this.calculateCostPerPrint(l2, printer))
      .at(0);

    return bestLayout;
  }

  calculateCostPerPrint(paperLayout: PaperLayout, printer: Printer) {
    const layoutsPerPaper = (paperLayout.verticalColumns * paperLayout.verticalRowCount) + (paperLayout.horizontalColumns * paperLayout.horizontalRowCount);
    const prints = this.printsPerPaper(paperLayout);
    const cost = +paperLayout.paper.cost + (+printer.costPerPage * layoutsPerPaper);

    return cost / prints;
  }

  printsPerPaper(paperLayout: PaperLayout): number {
    const layoutsPerPaper = (paperLayout.verticalColumns * paperLayout.verticalRowCount) + (paperLayout.horizontalColumns * paperLayout.horizontalRowCount);
    const printsPerLayout = this.printsOf(paperLayout.layout);
    return layoutsPerPaper * printsPerLayout;
  }

  public widthOf(layout: Layout): number {
    return (layout.horizontalColumns * layout.print.height) + (layout.verticalColumns * layout.print.width);
  }

  public heightOf(layout: Layout): number {
    const horizontalColumnHeight = layout.horizontalRowCount * layout.print.width;
    const verticalColumnHeight = layout.verticalRowCount * layout.print.height;

    return horizontalColumnHeight > verticalColumnHeight ? horizontalColumnHeight : verticalColumnHeight;
  }

  private printsOf(layout: Layout): number {
    return (layout.verticalColumns * layout.verticalRowCount) + (layout.horizontalColumns * layout.horizontalRowCount);
  }

}
