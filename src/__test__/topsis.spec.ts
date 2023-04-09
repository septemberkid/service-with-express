import Topsis, { Criteria, Person } from '@core/topsis';

describe('topsis', () => {
  const criteria: Criteria[] = [];
  criteria.push({name: 'K1', score: 0.033819086228285})
  criteria.push({name: 'K2', score: 0.184802000913143})
  criteria.push({name: 'K3', score: 0.232137495501076})
  criteria.push({name: 'K4', score: 0.151324580396684})
  criteria.push({name: 'K5', score: 0.0821974188547088})
  criteria.push({name: 'K6', score: 0.0821974188547088})
  criteria.push({name: 'K7', score: 0.0821974188547088})
  criteria.push({name: 'K8', score: 0.151324580396684})

  const topsis = new Topsis(criteria)
  topsis.addPerson('Natalia', [3.83, 114, 60, 4, 4, 4, 4, 4])
  topsis.addPerson('Aditya F', [3.79, 111, 80, 3.33, 4, 5, 3.67, 4])
  topsis.addPerson('David', [3.73, 114, 50, 4, 4, 4, 3.67, 4])
  topsis.addPerson('Rosma', [3.61, 108, 80, 3, 4, 5, 3.67, 3.67])
  topsis.addPerson('Sema', [2.35, 136, 50, 3.67, 2.33, 3, 3.67, 4])
  topsis.addPerson('Des Wence', [2.61, 138, 50, 4, 1, 3, 2.67, 1.33])
  it('validate data', () => {
    expect(topsis.totalCriteria()).toEqual(8)
    expect(topsis.totalPerson()).toEqual(6)
  })
  it('should match with rank', () => {
    const ranks = topsis.getRank();
    expect(ranks[0].person).toEqual({id: 2, name: 'Aditya F'})
    expect(ranks[1].person).toEqual({id: 4, name: 'Rosma'})
    expect(ranks[2].person).toEqual({id: 1, name: 'Natalia'})
    expect(ranks[3].person).toEqual({id: 3, name: 'David'})
    expect(ranks[4].person).toEqual({id: 5, name: 'Sema'})
    expect(ranks[5].person).toEqual({id: 6, name: 'Des Wence'})
  });
})