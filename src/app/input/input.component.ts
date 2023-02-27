import { Component, EventEmitter, Output } from '@angular/core';
import { Paper, Print, Printer } from '../calculator.service';

export interface PrintConfigInput {
  paper: Paper,
  print: Print,
  printer: Printer
}

export const defaultConfig: PrintConfigInput = {
  paper: {width: 340, height: 380, cost: 4.5},
  printer: {costPerPage: 3.5, maxHeight: 200, maxWidth: 200, minHeigth: 100, minWidth: 100},
  print: {width: 60, height: 80}
}

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Output() onCalc = new EventEmitter<PrintConfigInput>();

  model: PrintConfigInput = defaultConfig;

  constructor() {
    const lastConfigString = localStorage.getItem('lastConfig');
    if (lastConfigString !== null) {
      this.model = JSON.parse(lastConfigString) as PrintConfigInput;
    }
  }

  calculate() {
    this.onCalc.emit(this.model);
  }
}
