class CrosswordSolver {
    constructor(words, size = 15) {
        this.words = words.map(w => w.toUpperCase());
        this.size = size;

        this.grid = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => " ")
        );

        this.bestGrid = null;
        this.bestScore = -1;
        this.bestPositions = [];

        // Precompute intersections
        this.intersections = this._computeIntersections();
    }

    _computeIntersections() {
        const inter = {};
        for (let w1 of this.words) {
            for (let w2 of this.words) {
                if (w1 === w2) continue;
                const key = `${w1}|${w2}`;
                inter[key] = [];

                for (let i = 0; i < w1.length; i++) {
                    for (let j = 0; j < w2.length; j++) {
                        if (w1[i] === w2[j]) {
                            inter[key].push([i, j]);
                        }
                    }
                }
            }
        }
        return inter;
    }

    _canPlace(word, row, col, direction) {
        const n = word.length;
        for (let i = 0; i < n; i++) {
            const r = row + (direction === "V" ? i : 0);
            const c = col + (direction === "H" ? i : 0);

            if (r < 0 || r >= this.size || c < 0 || c >= this.size) return false;

            const cur = this.grid[r][c];
            if (cur !== " " && cur !== word[i]) return false;
        }
        return true;
    }

    _place(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const r = row + (direction === "V" ? i : 0);
            const c = col + (direction === "H" ? i : 0);
            this.grid[r][c] = word[i];
        }
    }

    _remove(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const r = row + (direction === "V" ? i : 0);
            const c = col + (direction === "H" ? i : 0);

            this.grid[r][c] = " ";

            // Rebuild any overlapping letters from other placed words
            for (let [w, rr, cc, d] of this.placed) {
                for (let k = 0; k < w.length; k++) {
                    const rr2 = rr + (d === "V" ? k : 0);
                    const cc2 = cc + (d === "H" ? k : 0);
                    if (rr2 === r && cc2 === c) {
                        this.grid[r][c] = w[k];
                    }
                }
            }
        }
    }

    _scoreGrid() {
        let score = 0;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] !== " ") {
                    let count = 0;
                    for (let [dr, dc] of [
                        [-1, 0],
                        [1, 0],
                        [0, -1],
                        [0, 1]
                    ]) {
                        const rr = r + dr;
                        const cc = c + dc;
                        if (
                            rr >= 0 && rr < this.size &&
                            cc >= 0 && cc < this.size &&
                            this.grid[rr][cc] !== " "
                        ) {
                            count++;
                        }
                    }
                    if (count >= 2) score++;
                }
            }
        }

        return score;
    }

    solve() {
        this.placed = [];

        const first = this.words[0];
        const startRow = Math.floor(this.size / 2);
        const startCol = Math.floor((this.size - first.length) / 2);

        this._place(first, startRow, startCol, "H");
        this.placed.push([first, startRow, startCol, "H"]);
        this._search(this.words.slice(1));

        return [this.bestGrid, this.bestPositions, this.bestScore];
    }

    _search(remaining) {
        if (remaining.length === 0) {
            const score = this._scoreGrid();
            if (score > this.bestScore) {
                this.bestScore = score;
                this.bestGrid = this.grid.map(row => [...row]);
                this.bestPositions = [...this.placed];
            }
            return;
        }

        const word = remaining[0];
        let placedAny = false;

        for (let existing of this.placed) {
            const [w2, r2, c2, d2] = existing;

            const key = `${word}|${w2}`;
            const intersections = this.intersections[key] || [];

            for (let [i1, i2] of intersections) {
                let row, col, direction;

                if (d2 === "H") {
                    direction = "V";
                    row = r2 - i1;
                    col = c2 + i2;
                } else {
                    direction = "H";
                    row = r2 + i2;
                    col = c2 - i1;
                }

                if (this._canPlace(word, row, col, direction)) {
                    this._place(word, row, col, direction);
                    this.placed.push([word, row, col, direction]);

                    this._search(remaining.slice(1));

                    this.placed.pop();
                    this._remove(word, row, col, direction);

                    placedAny = true;
                }
            }
        }

        // Fallback random placement
        if (!placedAny) {
            for (let tries = 0; tries < 100; tries++) {
                const direction = Math.random() < 0.5 ? "H" : "V";
                const row = Math.floor(Math.random() * (this.size - (direction === "V" ? word.length : 1)));
                const col = Math.floor(Math.random() * (this.size - (direction === "H" ? word.length : 1)));

                if (this._canPlace(word, row, col, direction)) {
                    this._place(word, row, col, direction);
                    this.placed.push([word, row, col, direction]);

                    this._search(remaining.slice(1));

                    this.placed.pop();
                    this._remove(word, row, col, direction);
                    break;
                }
            }
        }
    }
}

// Factory function
function createCrossword(words, gridSize = 15) {
    const solver = new CrosswordSolver(words, gridSize);
    const [grid, positions, score] = solver.solve();
    return { grid, positions, score };
}

function gridToDisplay(grid) {
    return grid.map(row => row.map(cell => (cell === " " ? "" : cell)));
}

export { createCrossword };