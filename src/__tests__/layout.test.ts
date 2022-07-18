import { computePositions } from '../layout';

const items = [{
    index: 0,
    x: 1,
    y: 0,
    w: 2,
    h: 4
}, {
    index: 1,
    x: 4,
    y: 1,
    w: 3,
    h: 2
}, {
    index: 2,
    x: 2,
    y: 5,
    w: 1,
    h: 1
}, {
    index: 3,
    x: 7,
    y: 4,
    w: 2,
    h: 1
}];

describe('computePositions', () => {
    it('should', () => {
        expect(computePositions(items)).toMatchInlineSnapshot(`
Array [
  Object {
    "h": 4,
    "index": 0,
    "w": 2,
    "x": 1,
    "y": 0,
  },
  Object {
    "h": 2,
    "index": 1,
    "w": 3,
    "x": 4,
    "y": 0,
  },
  Object {
    "h": 1,
    "index": 3,
    "w": 2,
    "x": 7,
    "y": 0,
  },
  Object {
    "h": 1,
    "index": 2,
    "w": 1,
    "x": 2,
    "y": 4,
  },
]
`);
    });
});