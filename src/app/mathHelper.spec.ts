import { CalculatorService } from './calculator.service';
import { TestBed } from '@angular/core/testing';
import { allSummandTuplesBetweenMinMax } from './mathHelper';

describe('MathHelper', () => {

  it('possibleSummand', () => {
    let a = allSummandTuplesBetweenMinMax(3, 4, 17, 5);
    console.warn(a);

    expect(a.size === 20);
  });

});
