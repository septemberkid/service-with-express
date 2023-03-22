import { populateWhere } from '@util/query';

describe('query-test', () => {
  test('ilike', () => {
    const wheres = populateWhere({
      ilike: {
        'name': wrapper => wrapper('ilmu', 'both'),
        'meta': wrapper => wrapper('meta', 'before'),
      }
    });
    expect(wheres).toEqual({
      name: {
        $ilike: '%ilmu%'
      },
      meta: {
        $ilike: '%meta'
      }
    })
  });
  test('ilike-with-empty-values', () => {
    const wheres = populateWhere({
      ilike: {
        'name': () => '',
        'meta': () => null,
      }
    });
    expect(wheres).toEqual({})
  });
  test('in', () => {
    const wheres = populateWhere({
      in: {
        'name': ['1','2'],
        'id': [1,2]
      }
    });
    expect(wheres).toEqual({
      name: {
        $in: ['1','2'],
      },
      id: {
        $in: [1,2]
      }
    })
  })
})