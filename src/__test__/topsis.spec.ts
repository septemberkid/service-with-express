import Topsis, { Criteria } from '@core/topsis';

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

  const topsis = new Topsis<{nim: string}>(criteria)
  topsis.addPerson(1,'Natalia', [
    {name: 'K1', score: 3.83}, {name: 'K2', score: 114}, {name: 'K3', score: 60}, {name: 'K4', score: 4},
    {name: 'K5', score: 4}, {name: 'K6', score: 4}, {name: 'K7', score: 4}, {name: 'K8', score: 4},
  ], {nim: '000001',})
  topsis.addPerson(2,'Aditya F', [
    {name: 'K1', score: 3.79}, {name: 'K2', score: 111}, {name: 'K3', score: 80}, {name: 'K4', score: 3.33},
    {name: 'K5', score: 4}, {name: 'K6', score: 5}, {name: 'K7', score: 3.67}, {name: 'K8', score: 4},
  ], {nim: '000002'})
  topsis.addPerson(3,'David', [
    {name: 'K1', score: 3.73}, {name: 'K2', score: 114}, {name: 'K3', score: 50}, {name: 'K4', score: 4},
    {name: 'K5', score: 4}, {name: 'K6', score: 4}, {name: 'K7', score: 3.67}, {name: 'K8', score: 4},
  ], {nim: '000003'})
  topsis.addPerson(4, 'Rosma', [
    {name: 'K1', score: 3.61}, {name: 'K2', score: 108}, {name: 'K3', score: 80}, {name: 'K4', score: 3},
    {name: 'K5', score: 4}, {name: 'K6', score: 5}, {name: 'K7', score: 3.67}, {name: 'K8', score: 3.67},
  ], {nim: '000004'})
  topsis.addPerson(5, 'Sema', [
    {name: 'K1', score: 2.35}, {name: 'K2', score: 136}, {name: 'K3', score: 50}, {name: 'K4', score: 3.67},
    {name: 'K5', score: 2.33}, {name: 'K6', score: 3}, {name: 'K7', score: 3.67}, {name: 'K8', score: 4},
  ], {nim: '000005'})
  topsis.addPerson(6, 'Des Wence', [
    {name: 'K1', score: 2.61}, {name: 'K2', score: 138}, {name: 'K3', score: 50}, {name: 'K4', score: 4},
    {name: 'K5', score: 1}, {name: 'K6', score: 3}, {name: 'K7', score: 2.67}, {name: 'K8', score: 1.33},
  ], {nim: '000006'})
  it('validate data', () => {
    expect(topsis.totalCriteria()).toEqual(8)
    expect(topsis.totalPerson()).toEqual(6)
  })
  it('should match with rank', () => {
    const ranks = topsis.getRank();
    expect(ranks[0].person).toEqual({attrs: {nim: '000002'}, id: 2, name: 'Aditya F'})
    expect(ranks[1].person).toEqual({attrs: {nim: '000004'}, id: 4, name: 'Rosma'})
    expect(ranks[2].person).toEqual({attrs: {nim: '000001'}, id: 1, name: 'Natalia'})
    expect(ranks[3].person).toEqual({attrs: {nim: '000003'}, id: 3, name: 'David'})
    expect(ranks[4].person).toEqual({attrs: {nim: '000005'}, id: 5, name: 'Sema'})
    expect(ranks[5].person).toEqual({attrs: {nim: '000006'}, id: 6, name: 'Des Wence'})
  });
})