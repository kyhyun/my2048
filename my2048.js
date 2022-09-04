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
