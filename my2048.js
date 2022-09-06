const $table = document.querySelector('.table');
const $score = document.querySelector('.score');
const $bestScore = document.querySelector('.bestScore');
const $modal = document.querySelector('.modal');
const $stateControl = document.querySelector('.stateControl');
const $modalText = document.querySelector('.modalText');
const $buttonWrap = document.querySelector('.buttonWrap');

const $$newGameBtn = document.querySelectorAll('.newGame');
const $$returnBtn = document.querySelectorAll('.return');

let board = [];
let startCoord;
let history = [];

const randomCell = () => {
  const emptyCells = [];
  board.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      if (!cellData) {
        emptyCells.push([i, j]);
      }
    });
  });
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const randomNumber = Math.floor(Math.random() * (3 - 1) + 1) * 2;
  board[randomCell[0]][randomCell[1]] = randomNumber;
};

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

const modalhandler = (info) => {
  if (info === 'start') {
    $modal.classList.add('invisible');
  } else {
    $modal.classList.remove('invisible');
  }
};

const startGame = () => {
  // $table -> $fragment -> $tr -> $td
  modalhandler('start');
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

const restart = () => {
  modalhandler('start');
  history = [];
  board.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      board[i][j] = 0;
    });
  });
  $score.textContent = 0;
  randomCell();
  draw();
};

startGame();

// 패배를 판정하는 함수 (요소 안에 합쳐질 부분이 있는지 확인)
const checkIsCombine = () => {
  // left, up, right, bottom
  const dx = [-1, 0, 1, 0];
  const dy = [0, 1, 0, -1];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        let nx = i + dx[k];
        let ny = j + dy[k];
        if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4 && board[nx][ny] === board[i][j]) {
          return false;
        }
      }
    }
  }
  return true;
};

const moveCells = (direction) => {
  // 과거 데이터(table, score) 정보를 객체 형태로 담아 배열로 저장
  history.push({
    table: JSON.parse(JSON.stringify(board)), // deep copy [d1, d2, d3, ..., dn]
    score: $score.textContent,
  });

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
            // 이전 셀과 현재 셀이 같다면 스코어 반영
            if (prevData === cellData) {
              const score = parseInt($score.textContent);
              const bestScore = parseInt($bestScore.textContent);
              $score.textContent = score + currentRow[currentRow.length - 1] * 2;
              if (bestScore <= score) {
                $bestScore.textContent = score + currentRow[currentRow.length - 1] * 2;
              }
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        });
      });
      // 이동한 데이터를 원본 데이터에 반영
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
              const score = parseInt($score.textContent);
              const bestScore = parseInt($bestScore.textContent);
              $score.textContent = score + currentRow[currentRow.length - 1] * 2;
              if (bestScore <= score) {
                $bestScore.textContent = score + currentRow[currentRow.length - 1] * 2;
              }
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[3 - j]);
            }
          }
        });
      });
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
                const score = parseInt($score.textContent);
                const bestScore = parseInt($bestScore.textContent);
                $score.textContent = score + currentRow[currentRow.length - 1] * 2;
                if (bestScore <= score) {
                  $bestScore.textContent = score + currentRow[currentRow.length - 1] * 2;
                }
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(cellData);
              }
            }
          });
        });
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
                const score = parseInt($score.textContent);
                const bestScore = parseInt($bestScore.textContent);
                $score.textContent = score + currentRow[currentRow.length - 1] * 2;
                if (bestScore <= score) {
                  $bestScore.textContent = score + currentRow[currentRow.length - 1] * 2;
                }
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(board[3 - i][j]);
              }
            }
          });
        });
        Array.from({ length: 4 }, (rowData, i) => {
          Array.from({ length: 4 }, (cellData, j) => {
            board[3 - j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
      }
      break;
  }

  // 이전 history 테이블 데이터와 현재 진행중인 테이블 데이터가 같은지 비교
  const _history = JSON.parse(JSON.stringify(history));
  const _prevData = _history.pop();
  if (_prevData !== undefined) {
    if (JSON.stringify(_prevData.table) === JSON.stringify(board)) history.pop();
  }

  // 승패 처리 및 프로세스 진행
  if (board.flat().includes(2048)) {
    draw();
    [0, 1].forEach((node) => $stateControl.children[node].setAttribute('disabled', 'false'));
    $modalText.textContent = 'YOU WIN';
    $buttonWrap.children[1].classList.add('invisible');
    $modal.classList.remove('invisible');
  } else if (!board.flat().includes(0) && checkIsCombine()) {
    [0, 1].forEach((node) => $stateControl.children[node].setAttribute('disabled', 'false'));
    $modalText.textContent = 'GAME OVER';
    $buttonWrap.children[1].classList.remove('invisible');
    $modal.classList.remove('invisible');
  } else {
    if (board.flat().includes(0)) {
      randomCell();
    }
    draw();
  }
};

// 이벤트 핸들러
window.addEventListener('keyup', (event) => {
  if ($modal.classList.contains('invisible')) {
    if (event.key === 'ArrowUp') {
      moveCells('up');
    } else if (event.key === 'ArrowDown') {
      moveCells('down');
    } else if (event.key === 'ArrowLeft') {
      moveCells('left');
    } else if (event.key === 'ArrowRight') {
      moveCells('right');
    }
  }
});

$table.addEventListener('mousedown', (event) => {
  startCoord = [event.clientX, event.clientY];
});

$table.addEventListener('mouseup', (event) => {
  const endCoord = [event.clientX, event.clientY];
  const diffX = endCoord[0] - startCoord[0];
  const diffY = endCoord[1] - startCoord[1];
  if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells('left');
  } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells('right');
  } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells('up');
  } else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells('down');
  }
});

$$newGameBtn.forEach((element) => {
  element.addEventListener('click', () => {
    [0, 1].forEach((node) => $stateControl.children[node].removeAttribute('disabled'));
    restart();
  });
});

$$returnBtn.forEach((element) => {
  element.addEventListener('click', () => {
    if ($modalText.textContent === 'GAME OVER')
      [0, 1].forEach((node) => $stateControl.children[node].removeAttribute('disabled'));
    if (!$modal.classList.contains('invisible')) modalhandler('start');
    const prevData = history.pop();
    if (!prevData) return;
    $score.textContent = prevData.score;
    board = prevData.table;
    draw();
  });
});
