// todo optimieren
// sucht alle ganzzahligen Lösungen für min <= a*x+b*y <= max
export function allSummandTuples(x: number, y: number, max: number, min: number) {
  let possibilities: {a: number, b: number, sum: number}[] = [];

  for (let a = 0; a <= max/x; a++) {
    for (let b = 0; b <= max/y; b++) {
      if (min <= a*x+b*y && a*x+b*y <= max) {
        possibilities.push({a, b, sum: a*x+b*y});
      }
    }
  }

  return possibilities;
}

export function possibleSummand(x: number, y: number, max: number, min: number) {
  let possibilities = new Set<number>;

  for (let a = 0; a <= max/x; a++) {
    if (min <= a*x && a*x <= max) {
      possibilities.add(a*x);
    }
  }
  for (let b = 0; b <= max/y; b++) {
    if (min <= b*y && b*y <= max) {
      possibilities.add(b*y);
    }
  }

  return possibilities;
}
