export type Criteria = {
  readonly name: string;
  readonly score: number;
}
export type Person<PA> = {
  readonly id: number;
  readonly name: string;
  readonly criteria_values: Criteria[];
  readonly attrs?: PA
}
export type Rank<PA> = {
  person: Omit<Person<PA>, 'criteria_values'>,
  criteria_values: Criteria[],
  preference_value: number
}
export default class Topsis<PA> {
  private person: Person<PA>[] = []
  constructor(private readonly criteria: Criteria[]) {
  }
  private round(value: number, decimalPlaces: number) {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(value * factorOfTen) / factorOfTen;
  }
  addPerson(id: number, name: string, criteriaValues: Criteria[], attrs: PA = null) {
    if (criteriaValues.length != this.criteria.length)
      throw new Error('Invalid criteria values.')
    this.person.push({
      id,
      name,
      criteria_values: criteriaValues,
      attrs: attrs
    })
  }
  private validate() {
    if (this.criteria.length == 0)
      throw new Error('Criteria can\'t be empty.')
    if (this.person.length == 0)
      throw new Error('Person can\'t be empty.')
  }
  totalPerson(): number {
    return this.person.length;
  }
  totalCriteria(): number {
    return this.criteria.length;
  }
  private getDataMatrix() {
    const rows: Array<number>[] = [];
    for (let i = 0; i < this.person.length; i++) {
      const values: number[] = [];
      for (const criteria of this.person[i].criteria_values) {
        values.push(criteria.score);
      }
      rows.push(values)
    }
    return rows;
  }
  private getCriteriaSquareSummary(dataMatrix: number[][]) {
    const cols: number[] = []
    for (let j = 0; j < dataMatrix[0].length; j++) {
      let sum = 0;
      for (let i = 0; i < dataMatrix.length; i++) {
        sum += Math.pow(dataMatrix[i][j], 2)
      }
      cols.push(Math.sqrt(sum))
    }
    return cols;
  }
  private getNormalizedMatrix() {
    const dataMatrix = this.getDataMatrix()
    const summaries = this.getCriteriaSquareSummary(dataMatrix)
    const normalizedMatrix: Array<number>[] = [];
    for (let i = 0; i < dataMatrix.length; i++) {
      const row = [];
      for (let j = 0; j < dataMatrix[i].length; j++) {
        const value = dataMatrix[i][j]/summaries[j]
        row.push(value)
      }
      normalizedMatrix.push(row)
    }
    return normalizedMatrix;
  }
  private getWeightedNormalizedMatrix() {
    const weightedNormalizedMatrix: Array<number>[] = [];
    const normalizedMatrix = this.getNormalizedMatrix();
    for (let i = 0; i < normalizedMatrix.length; i++) {
      const row = [];
      for (let j = 0; j < normalizedMatrix[i].length; j++) {
        const value = normalizedMatrix[i][j] * (this.criteria)[j].score
        row.push(value)
      }
      weightedNormalizedMatrix.push(row)
    }
    return weightedNormalizedMatrix;
  }
  private getPositiveAndNegativeIdealSolution(): { positive: number[], negative: number[], weightedNormalizedMatrix: number[][]} {
    const positive: number[] = [];
    const negative: number[] = [];
    const weightedNormalizedMatrix = this.getWeightedNormalizedMatrix();
    for (let i = 0; i < weightedNormalizedMatrix[0].length; i++) {
      let max = Number.MIN_SAFE_INTEGER;
      let min = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < weightedNormalizedMatrix.length; j++) {
        if (weightedNormalizedMatrix[j][i] > max)
          max = weightedNormalizedMatrix[j][i]
        if (weightedNormalizedMatrix[j][i] < min)
          min = weightedNormalizedMatrix[j][i]
      }
      positive.push(max)
      negative.push(min)
    }
    return {
      positive,
      negative,
      weightedNormalizedMatrix
    }
  }
  private getPositiveAndNegativeIdealSolutionDistance(): {positive_distance: number[], negative_distance: number[]} {
    const {positive, negative, weightedNormalizedMatrix} = this.getPositiveAndNegativeIdealSolution()
    const positiveDistance: number[] = [];
    const negativeDistance: number[] = [];
    for (let i = 0; i < weightedNormalizedMatrix.length; i++) {
      let positiveSum = 0;
      let negativeSum = 0;
      for (let j = 0; j < weightedNormalizedMatrix[i].length; j++) {
        positiveSum += Math.pow(weightedNormalizedMatrix[i][j] - positive[j], 2)
        negativeSum += Math.pow(weightedNormalizedMatrix[i][j] - negative[j], 2)
      }
      positiveDistance.push(Math.sqrt(positiveSum))
      negativeDistance.push(Math.sqrt(negativeSum))
    }
    return {
      positive_distance: positiveDistance,
      negative_distance: negativeDistance
    }
  }
  private getPreferences() {
    const {positive_distance, negative_distance} = this.getPositiveAndNegativeIdealSolutionDistance()
    const preferences: number[] = []
    for (let i = 0; i < positive_distance.length; i++) {
      const negative = negative_distance[i]
      const positive = positive_distance[i]
      preferences.push(negative/(negative+positive))
    }
    return preferences;
  }
  private generateRank(preferences: number[]): Rank<PA>[] {
    const ranks: Rank<PA>[] = [];
    for (let i = 0; i < this.person.length; i++) {
      const person = this.person[i];
      ranks.push({
        person: {
          id: person.id,
          name: person.name,
          attrs: person.attrs
        },
        criteria_values: person.criteria_values,
        preference_value: preferences[i],
      })
    }
    return ranks;
  }
  getRank(): Rank<PA>[] {
    this.validate();
    const preferences = this.getPreferences()
    const ranks = this.generateRank(preferences);
    ranks.sort((a, b) => b.preference_value - a.preference_value)
    return ranks;
  }
}