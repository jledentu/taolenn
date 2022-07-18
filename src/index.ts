import Emitter from './Emitter';
import { computePositions } from './layout'

type Options = {
    items?: string | HTMLElement[];
    cols?: number;
    rowHeight?: number;
    gap?: number;
    float?: boolean;
};

const DEFAULT_OPTIONS = {
    items: '*',
    cols: 12,
    rowHeight: 150,
    gap: 5,
    float: false
};

export default class Taolenn extends Emitter {
    #container: Element;
    #items: Element[];
    #options: Required<Options>;
    #width: number;
    #height: number;
    #top: number;
    #right: number;
    #bottom: number;
    #left: number;
    #resizeObserver: ResizeObserver;

    constructor(element: string | Element, options: Options = {}) {
        super();
        const gridElement = typeof element === 'string' ? document.querySelector(element) : element;

        if (!gridElement) {
            throw new Error('Container element not found');
        }

        this.#container = gridElement;
        this.#options = {
            ...DEFAULT_OPTIONS,
            ...options
        };

        this.#initItems();
        this.#layout();

        this.#initResizeObserver();

        this.emit('init');
    }

    #initItems() {
        const itemsOption = this.#options.items;
        if (itemsOption === '*') {
            this.#items = Array.from(this.#container.children);
        } else if (typeof itemsOption === 'string') {
            this.#items = Array.from(this.#container.querySelectorAll(itemsOption));
        }
    }

    #layout() {
        this.#refreshDimensions();
        const layoutItems = computePositions(this.#items, this.#options.cols, this.#options);
        const { rowHeight, gap } = this.#options;
        const columnWidth = this.columnWidth;
        const itemsLength = layoutItems.length;

        for (let i = 0; i < itemsLength; i++) {
            const { element, w, h, x, y } = layoutItems[i];
            const width = w * (columnWidth + gap) - gap;
            const height = h * (rowHeight + gap) - gap;
            const top = y * (rowHeight + gap);
            const left = x * (columnWidth + gap);
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            element.style.top = top + 'px';
            element.style.left = left + 'px';
            
            element.setAttribute('data-x', x);
            element.setAttribute('data-y', y);
            element.setAttribute('data-w', w);
            element.setAttribute('data-h', h);
        }
    }

    #refreshDimensions() {
        const { width, height, top, right, bottom, left } = this.#container.getBoundingClientRect();
        this.#width = width;
        this.#height = height;
        this.#top = top;
        this.#right = right;
        this.#bottom = bottom;
        this.#left = left;
    }

    #initResizeObserver() {
        this.#resizeObserver = new ResizeObserver(() => {
            this.#layout();
        });

        this.#resizeObserver.observe(this.#container);
    }

    get columnWidth() {
        const { cols, gap } = this.#options;
        return Math.round((this.#width - gap * (cols - 1)) / cols);
    }

    mouseToGridCoordinates(clientX, clientY) {
        const {cols, rowHeight, gap} = this.#options;
        const colWidth = this.columnWidth;
    
        let x = Math.round((clientX - gap) / colWidth);
        let y = Math.round((clientY - gap) / rowHeight);
    
        return {x, y};
    };

    destroy() {
        this.#resizeObserver.unobserve(this.#container);
    }
}