# MY2048

<div align='center'>
  <img width="480" alt="image" src="https://user-images.githubusercontent.com/77887712/188801195-68fb74e9-58f6-4e39-a2ed-c0cefb21f071.png">
  <br><br>
  <div align='center'>
    <img src='https://img.shields.io/badge/html5-red.svg'/>
    <img src="https://img.shields.io/badge/CSS3-skyblue.svg" />
    <img src="https://img.shields.io/badge/javascript-ES2015-yellow.svg" />
  </div>
</div>

## 개요

바닐라 자바스크립트로 프로젝트를 한 적이 오래된 것 같아서 감을 잊지 않으려고 미니 프로젝트로 2048 게임을 만들어봤다.

## 프로젝트 소개

**[MY2048 시작하기](kyhyun.github.io/my2048/)**

> 애니메이션 동작이 없는 버전의 2048 게임 입니다.
> 
> 키보드 방향키, 마우스 드래그를 하면 숫자가 2와 4 중에 랜덤으로 4 x 4 배열 칸에서 빈 칸의 무작위로 생성됩니다.

## 주요 기능

### 1) 타일 생성

- 숫자가 생성되는 조건은 다음과 같은 경우로 나뉜다.
  - 게임이 시작됐을 때
  - 사용자가 방향을 조작하여 숫자 타일이 이동하게 됐을 때
- 생성되는 숫자는 2와 4 중에 하나로 그 경우의 수는 같은 확률로 내장된 random 함수로 구현했다.
  - 원작 게임에서는 특정 구간을 지나게 되면 숫자 4가 발생할 확률이 10~20% 정도 였지만 본 게임 기능에서는 빠른 게임 진행 및 난이도를 위해 위 조건을 처리하지는 않았다.

### 2) 타일 이동 / 결합하기

#### 이동하기

- 이 프로젝트에서 가장 핵심이 되는 기능으로 타일의 이동에 대한 감지는 키보드와 마우스, 터치 이벤트를 이용해서 받았다.
- 원본 테이블 데이터와 빈 4 x 4 테이블 데이터를 준비해서 입력된 방향에 따라 배열이 다중 반복문을 통해 순회, 역순회 등을 수행하고 수행된 결과를 담은 테이블 데이터 내용을 원본 테이블 데이터에 인덱스마다 접근해서 값을 할당해주고 그 결과를 화면에 보여준다.

#### 결합하기

- 숫자들이 이동하는 과정에서 같은 숫자의 원소를 만난다면 합쳐져 하나의 블록으로 되며, 안의 원소 값은 두 블록 숫자의 합이다.
- 타일을 이동시키는 함수 안에서 인접한 방향에 있는 원소와 결합하도록 처리했다.
- 한 축에 있는 배열을 모두 합칠 수 있기 때문에 값을 합칠 때, 음수로 값을 합치고 그 값을 원본 테이블에 반영할 때, abs 내장함수를 이용해서 음수를 지워 결합하는 기능을 구현했다.

### 3) 이전 상태로 되돌리기 / 다시하기

#### 이전 상태로 되돌리기

- 원본 데이터를 생성할 때, 이전 히스토리를 가지고 있는 사본 배열을 이용해서 테이블 데이터와 스코어 데이터를 객체 배열의 형태로 담았다.
- 재시작하는 버튼으로 클릭 이벤트가 발생하면 해당 데이터가 비어있지 않는 조건으로 사본 배열의 데이터를 제거하고 결과를 화면에 표시함으로써 이전 상태 되돌리기를 구현했다.
- 다시 시작 할 때, 사본 배열의 데이터도 같이 초기화 해줌으로써 이전 데이터 결과를 가져오지 않도록 처리했다.

#### 다시하기

- 테이블 데이터에 담긴 값들을 모두 0으로 넣어주고, 사본 배열의 데이터도 초기화한다.
- 이후 타일을 생성하는 함수를 통해 화면에 리셋된 결과를 보여준다.

### 4) 게임 승리 / 패배 조건

- 두 이벤트 중 하나가 발생하면 모달을 가리고 있던 클래스를 지움으로써 화면에 게임 결과 화면을 출력하도록 했다.
- 승리가 되는 조건은 원본 배열에 모든 인덱스를 순회해서 2048을 찾은 경우다.

  - 조건을 만족하면 승리 모달과 함께 게임을 다시하기로 재시작 할 수 있다.

- 패배하는 경우는 다음과 같은 조건을 만족할 때 발생한다.
  - 테이블의 숫자가 모두 가득 차있을 때
  - 숫자를 이동시켜 합칠 수 있는 숫자가 더 이상 없을 때
  - 조건을 만족하면 패배 모달과 함께 다시하기와 이전 상태 되돌리기를 할 수 있다.

### 5) 점수 처리

- 각 테이블의 인덱스가 가진 숫자가 더해질 때마다 스코어에 누적 합산된다.
  - 타일을 이동시킬 때 결합되는 타일 간의 합을 점수로 반영한다.
  - 다시하기 혹은 이전 상태 되돌리기를 할 때, 합산된 점수를 반환한다.
- 최고 스코어는 현재 스코어의 값과 같거나 클 때 함께 증가하며 다시하기에도 초기화되지 않도록 했다.
