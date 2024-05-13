let numSelected = null;
let tileSelected = null;

let errors = 0;

let board = [
  "--74916-5",
  "2---6-3-9",
  "-----7-1-",
  "-586----4",
  "--3----9-",
  "--62--187",
  "9-4-7---2",
  "67-83----",
  "81--45---",
];

let solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

window.onload = function () {
  setGame();
};

function setGame() {
  //3amal sherit elarkam elly ta7t   Digits 1:9
  for (let i = 1; i <= 9; i++) {
    //<div id="1" class="number">1</div>
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  //le takseem shakl board w 3amal elmorab3at  Board 9x9
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      if (board[r][c] != "-") {
        tile.innerText = board[r][c];
        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}

//3lashan lma akhtar rakam men elshreet yetlwan bellono elbony
function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

//3lashan lma akhtar rakam men elshreet yetktab fe board
function selectTile() {
  if (numSelected) {
    if (this.innerText != "") {
      return;
    }

    // "0-0" "0-1" .. "3-1"  logic el le3ba e3tmad 3la id law elrakam sa7 ydfo fel tile beta3 board law ghalt yezawed error 1
    let coords = this.id.split("-"); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == numSelected.id) {
      this.innerText = numSelected.id;
    } else {
      errors += 1;
      document.getElementById("errors").innerText = errors;
    }
  }
}

// Solve with DFS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function solveWithDFS() {
  window.alert("Start Solving With DFS");
  const isEmpty = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          return [i, j];
        }
      }
    }
    return null;
  };

  const isValid = (board, row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const solveSudoku = (board) => {
    const emptyCell = isEmpty(board);
    if (!emptyCell) {
      return true; // Sudoku solved successfully
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      const numStr = num.toString();
      if (isValid(board, row, col, numStr)) {
        board[row] =
          board[row].substring(0, col) + numStr + board[row].substring(col + 1);
        if (solveSudoku(board)) {
          return true;
        }
        board[row] =
          board[row].substring(0, col) + "-" + board[row].substring(col + 1); // Backtrack
      }
    }

    return false; // No solution found
  };

  // Make a copy of the original board to not modify the original
  let copyBoard = board.map((row) => row.slice());

  if (solveSudoku(copyBoard)) {
    // Update the board with the solved Sudoku
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "-") {
          document.getElementById(r + "-" + c).innerText = copyBoard[r][c];
        }
      }
    }
    alert("Sudoku solved!");
  } else {
    alert("No solution found!");
  }
}

// Attach the function to the button
let dfsButton = document.querySelector(".dfs");
dfsButton.addEventListener("click", solveWithDFS);

// Solve With BFS Function////////////////////////////////////////////////////////////////////////////////////////////////////////////
function solveWithBFS() {
  window.alert("Start Solving With BFS");
  const isValid = (board, row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const isFull = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          return false;
        }
      }
    }
    return true;
  };

  const solveSudoku = (board) => {
    let queue = [];
    queue.push(board);

    while (queue.length > 0) {
      let current = queue.shift();
      let emptyCell = null;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (current[i][j] === "-") {
            emptyCell = [i, j];
            break;
          }
        }
        if (emptyCell) break;
      }
      if (!emptyCell) return current; // Solution found

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
        const numStr = num.toString();
        if (isValid(current, row, col, numStr)) {
          let newBoard = current.map((row) => row.slice());
          newBoard[row] =
            newBoard[row].substring(0, col) +
            numStr +
            newBoard[row].substring(col + 1);
          queue.push(newBoard);
        }
      }
    }

    return null; // No solution found
  };

  // Make a copy of the original board to not modify the original
  let copyBoard = board.map((row) => row.slice());

  let solution = solveSudoku(copyBoard);
  if (solution) {
    // Update the board with the solved Sudoku
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "-") {
          document.getElementById(r + "-" + c).innerText = solution[r][c];
        }
      }
    }
    alert("Sudoku solved!");
  } else {
    alert("No solution found!");
  }
}

// Attach the function to the button

let bfsButton = document.querySelector(".bfs");
bfsButton.addEventListener("click", solveWithBFS);

// Solve Wit IDS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function solveWithIDS() {
  window.alert("Start Solving with IDS");
  const isValid = (board, row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const isFull = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          return false;
        }
      }
    }
    return true;
  };

  const depthLimitedSearch = (board, depth) => {
    if (depth === 0) return null; // Reached the depth limit

    let emptyCell = null;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          emptyCell = [i, j];
          break;
        }
      }
      if (emptyCell) break;
    }
    if (!emptyCell) return board; // Solution found

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      const numStr = num.toString();
      if (isValid(board, row, col, numStr)) {
        let newBoard = board.map((row) => row.slice());
        newBoard[row] =
          newBoard[row].substring(0, col) +
          numStr +
          newBoard[row].substring(col + 1);
        let result = depthLimitedSearch(newBoard, depth - 1);
        if (result) return result;
      }
    }

    return null; // No solution found
  };

  // Make a copy of the original board to not modify the original
  let copyBoard = board.map((row) => row.slice());

  let depth = 1;
  let solution = null;
  while (!solution) {
    solution = depthLimitedSearch(copyBoard, depth);
    depth++;
  }

  if (solution) {
    // Update the board with the solved Sudoku
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "-") {
          document.getElementById(r + "-" + c).innerText = solution[r][c];
        }
      }
    }
    alert("Sudoku solved!");
  } else {
    alert("No solution found!");
  }
}

// Attach the function to the button
let idsButton = document.querySelector(".ids");
idsButton.addEventListener("click", solveWithIDS);

// Solve Wit A*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function solveWithAStar() {
  window.alert("Start Solving With A*");
  const isValid = (board, row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const heuristic = (board) => {
    // A simple heuristic: count the number of empty cells
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          count++;
        }
      }
    }
    return count;
  };

  const isFull = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "-") {
          return false;
        }
      }
    }
    return true;
  };

  const solveSudoku = (board) => {
    const queue = [];
    queue.push({ board: board, cost: heuristic(board) });

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const current = queue.shift().board;
      let emptyCell = null;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (current[i][j] === "-") {
            emptyCell = [i, j];
            break;
          }
        }
        if (emptyCell) break;
      }
      if (!emptyCell) return current; // Solution found

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
        const numStr = num.toString();
        if (isValid(current, row, col, numStr)) {
          let newBoard = current.map((row) => row.slice());
          newBoard[row] =
            newBoard[row].substring(0, col) +
            numStr +
            newBoard[row].substring(col + 1);
          queue.push({ board: newBoard, cost: heuristic(newBoard) });
        }
      }
    }

    return null; // No solution found
  };

  // Make a copy of the original board to not modify the original
  let copyBoard = board.map((row) => row.slice());

  let solution = solveSudoku(copyBoard);
  if (solution) {
    // Update the board with the solved Sudoku
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "-") {
          document.getElementById(r + "-" + c).innerText = solution[r][c];
        }
      }
    }
    alert("Sudoku solved!");
  } else {
    alert("No solution found!");
  }
}

// Attach the function to the button
let aStartButton = document.querySelector(".a-star");
aStartButton.addEventListener("click", solveWithAStar);
