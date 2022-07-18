type LayoutItem = {
    element: HTMLElement;
    x: number;
    y: number;
    w: number;
    h: number;
}

export function computePositions(items, numberColumns, options): LayoutItem[] {
    const layoutItems: LayoutItem[] = items.map((element) => {
        return {
            element,
            x: parseInt(element.getAttribute('data-x')),
            y: parseInt(element.getAttribute('data-y')),
            w: parseInt(element.getAttribute('data-w')),
            h: parseInt(element.getAttribute('data-h'))
        };
    });

    // Order items by x / y
    const sortedItems = sortItemsByPosition(layoutItems);
    const cols = [];

    // Push to bottom colliding elements
    const positionedItems = sortedItems.map(item => avoidCollision(cols, item, options));

    // If float: false, remove vertical gaps
    return positionedItems;
}

function sortItemsByPosition(items) {
    return items.sort(function (a, b) {
      if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
        return 1;
      } else if (a.y === b.y && a.x === b.x) {
        // Without this, we can get different sort results in IE vs. Chrome/FF
        return 0;
      }
      return -1;
    });
}

function avoidCollision(cols, item, options = {}) {
    const { x, y, w, h, i } = item;
    let minRow = 0;
    for (let i = x; i < x + w; i++) {
        minRow = Math.max(minRow, cols[i] || 0);
    }
  
    const newY = item.y >= minRow ? item.y : minRow;
  
    for (let i = x; i < x + w; i++) {
        cols[i] = newY + h;
    }
  
    return {
        ...item,
        y: options.float && item.y >= minRow ? item.y : minRow
    };
}

/**
 * Translate x and y coordinates from pixels to grid units.
 * @param  {Number} top  Top position (relative to parent) in pixels.
 * @param  {Number} left Left position (relative to parent) in pixels.
 * @return {Object} x and y in grid units.
 */
// TODO check if this function needs change in order to support rtl.
function calcXY(top, left) {
    const colWidth = this.calcColWidth();

    // left = colWidth * x + margin * (x + 1)
    // l = cx + m(x+1)
    // l = cx + mx + m
    // l - m = cx + mx
    // l - m = x(c + m)
    // (l - m) / (c + m) = x
    // x = (left - margin) / (coldWidth + margin)
    let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
    let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

    // Capping
    x = Math.max(Math.min(x, this.cols - this.innerW), 0);
    y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);

    return {x, y};
};