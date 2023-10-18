//물체를 쌓기-위 물체의 범위에 벗어나면 떨어지기
//물체가 쌓이거나 아이템을 먹으면 점수 추가
//떨어지면은 생명하나 차감
//시간 카운트다운
//생명이 다 차감되거나 시간이 끝나면 게임 오버와 스코어 보여주기, 다시하기 버튼
//다시하기 하면 기존 세팅으로 되돌리기

//-----------------------------------------------------

//기본 세팅
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 0 },
              debug: false
          }
    },
    scene: {
          preload: preload,
          create: create,
          update:update
    }
};
var game = new Phaser.Game(config);
  
//캐릭터
var players;
var speed = 4;
var player;
var newFox;

//점수
var score = 0;
var scoreText;
var scoreItem;
var scoreB;

//목숨
var lives = 3;

//카운트
let count = 0;
var timeLimit = 60; // 시간 제한 (초)
var timeItem;
var timeB;

//시간
var timerText;

//충돌 판정용
var collisionOccurred = false;

//카메라 움직임
var cameraY = false;


// 게임 리소스(캐릭터 이미지,배경)
function preload() {
  this.load.setBaseURL('/assets/');
  //배경
  this.load.image('sky', 'background.png');
  //캐릭터
  this.load.image('fox', 'fox.png');
  //시계
  this.load.image('time', 'time.png');
  //추가점수
  this.load.image('score', 'score.png');
}

// 게임 오브젝트 초기 세팅
function create() {
  // 캐릭터 쌓기용
  players = this.physics.add.group();
  scoreItem = this.physics.add.group();
  timeItem = this.physics.add.group();

  
  //배경 이미지(배경,기본 캐릭터1)
  var backgroundImage = this.add.image(0, 0, 'sky');
  backgroundImage.setOrigin(0, 0.45); 
  
  var fox = this.physics.add.image(0, 0, 'fox').setImmovable(true);
  fox.setOrigin(-4, -3.3); 
  fox.setScale(0.3); 

  //움직이는 여우 기본 세팅
  player = this.physics.add.sprite(400, 500, 'fox');
  player.setOrigin(-1.5, -1); 
  player.setScale(0.3); 
  //마우스 클릭 가능하게 세팅하기
  player.setInteractive();
  //클릭시 정지 후 던지기
  player.on('pointerdown', clickPlayer,this);

  //UI
  scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#fff' });
  scoreText.setScrollFactor(0);
  livesText = this.add.text(1000, 16, `Lives: ${lives}`, { fontSize: '32px', fill: '#fff' });
  livesText.setScrollFactor(0);
  timerText = this.add.text(500, 16, `Time: ${timeLimit}`, { fontSize: '32px', fill: '#fff' });
  timerText.setScrollFactor(0);
  timerEvent = this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, repeat: timeLimit });

  //기본 충돌 적용
  this.physics.add.collider(fox, players, onCollision, null, this);
}
function updateTimer() {
  timeLimit--; // 시간 감소
  timerText.setText('Time: ' + timeLimit); // UI 업데이트
  if (timeLimit <= 0) {
      timerText.setText('Time: 0');
  }
}
function onCollision(fox,players) {
  if (!collisionOccurred) {
    // 충돌 시 카운트,점수 증가
    count += 1;
    score += 100;
    collisionOccurred = true;
    players.body.collideWorldBounds = false;
    fox.body.collideWorldBounds = false;
  }
}

// 게임 상태를 업데이트(게임 로직)
function update() {
  // 캐릭터가 자동으로 좌우로 움직임
  player.x += speed;
  // 화면 경계에 닿으면 방향을 바꿈
  if (player.x >= config.width - player.x/2|| player.x <=  -config.width/10) {
    // 방향 전환 
     speed *= -1;}
  //던진 후 내려오기
  var lastObject = players.children.entries[players.children.entries.length-1];
  var underObject = players.children.entries[players.children.entries.length-2];
  if (lastObject) {
    if(lastObject.y <= 200-(count*130)){
      lastObject.setVelocityY(1000);
      scoreText.setText('Score: ' + score);
      this.physics.add.collider(lastObject, underObject,(lastObject,underObject)=>{
          lastObject.setVelocityY(0);
          underObject.setImmovable(false);
          if (!collisionOccurred) {
            // 충돌 시 카운트,점수 증가
            count++;
            score += 100;
            collisionOccurred = true;

          }
          if (!cameraY) {
            //쌓일때 카메라 이동
            cameraY = true;
            this.cameras.main.scrollY -= 140;
            player.y -= 140;
            speed = Math.abs(speed) + 1;
          }
      });
    }
  }
  //떨어진 물체 제거
  players.getChildren().forEach(function(newFox) {
    if (newFox.y > game.config.height) {
      newFox.destroy();
      lives--;
      livesText.setText('Lives: ' + lives);
    }
  });

}
//클릭 후 정지 후 던지기 함수
function clickPlayer(pointer){
  collisionOccurred = false;
  cameraY = false;
  newFox = players.create(pointer.x, player.y, 'fox');
  newFox.setScale(0.3);
  newFox.setVelocityY(-1000);

  //움직이는 여우 비활성화
  player.setVisible(false);
  setTimeout(function() {
    player.setVisible(true);
  }, 1000);
}

//아이템 생성
