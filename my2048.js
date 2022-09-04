// 실제 돔을 조작할 요소들을 선택해서 변수에 담는다.
const $table = document.querySelector('.table');
const $score = document.querySelector('.score');
const $bestScore = document.querySelector('.bestScore');
const $newStartBtn = document.querySelector('.newStart');
const $resetBtn = document.querySelector('.reset');

let board = [];

// 셀을 랜덤으로 생성시키는 함수
const randomCell = () => {
  // 빈셀 찾아서 emptyCells에 담기
  const emptyCells = [];
  board.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      if (!cellData) {
        emptyCells.push([i, j]);
      }
    });
  });
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomCell[0]][randomCell[1]] = 2;
};

// 화면에 실제 랜덤한 숫자를 그려주는 함수
const draw = () => {
  board.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      const $target = $table.children[i].children[j];
      if (cellData > 0) {
        $target.textContent = cellData;
        $target.className = `color-${cellData}`;
      } else {
        $target.textContent = '';
        $target.className = '';
      }
    });
  });
};

const startGame = () => {
  // $table -> $fragment -> $tr -> $td
  const $fragment = document.createDocumentFragment();
  Array.from({ length: 4 }, () => {
    const rowData = [];
    board.push(rowData);
    const $tr = document.createElement('tr');
    Array.from({ length: 4 }, () => {
      rowData.push(0);
      const $td = document.createElement('td');
      $tr.appendChild($td);
    });
    $fragment.appendChild($tr);
  });
  $table.appendChild($fragment);
  randomCell();
  draw();
};

startGame();
board = [
  [0, 2, 4, 2],
  [0, 0, 8, 0],
  [2, 2, 4, 2],
  [0, 16, 0, 4],
];

draw();

// 키보드, 마우스 이벤트를 감지하는 이벤트 처리
const moveCells = (direction) => {
  switch (direction) {
    case 'left': {
      // 기존 데이터를 참조할 수 있게 복사하는 작업
      const newData = [[], [], [], []];
      board.forEach((rowData, i) => {
        rowData.forEach((cellData) => {
          // 빈칸 제외한 셀 데이터를 새로운 배열의 인덱스에 넣어준다.
          if (cellData) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        });
      });
      console.log(newData);
      // 해당 데이터를 원본데이터에 반영하는 작업
      Array.from({ length: 4 }, (rowData, i) => {
        Array.from({ length: 4 }, (cellData, j) => {
          board[i][j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case 'right': {
      const newData = [[], [], [], []];
      board.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (board[i][3 - j]) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === rowData[3 - j]) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[3 - j]);
            }
          }
        });
      });
      console.log(newData);
      Array.from({ length: 4 }, (rowData, i) => {
        Array.from({ length: 4 }, (cellData, j) => {
          board[i][3 - j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case 'up':
      {
        const newData = [[], [], [], []];
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (cellData) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === cellData) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(cellData);
              }
            }
          });
        });
        console.log(newData);
        Array.from({ length: 4 }, (rowData, i) => {
          Array.from({ length: 4 }, (cellData, j) => {
            board[j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
      }
      break;
    case 'down':
      {
        const newData = [[], [], [], []];
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (board[3 - i][j]) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === board[3 - i][j]) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(board[3 - i][j]);
              }
            }
          });
        });
        console.log(newData);
        Array.from({ length: 4 }, (rowData, i) => {
          Array.from({ length: 4 }, (cellData, j) => {
            board[3 - j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
      }
      break;
  }
  draw();
};

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') {
    moveCells('up');
  } else if (event.key === 'ArrowDown') {
    moveCells('down');
  } else if (event.key === 'ArrowLeft') {
    moveCells('left');
  } else if (event.key === 'ArrowRight') {
    moveCells('right');
  }
});

let startCoord; // 시작 좌표

window.addEventListener('mousedown', (event) => {
  startCoord = [event.clientX, event.clientY];
});

window.addEventListener('mouseup', (event) => {
  const endCoord = [event.clientX, event.clientY];
  const diffX = endCoord[0] - startCoord[0];
  const diffY = endCoord[1] - startCoord[1];
  if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells('left');
  } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells('right');
  } else if (diffY > 0 && Math.abs(diffX) < Math.abs(diffY)) {
    moveCells('up');
  } else if (diffY < 0 && Math.abs(diffX) < Math.abs(diffY)) {
    moveCells('down');
  }
});
