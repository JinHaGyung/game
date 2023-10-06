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
              debug: true
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

//점수
var score = 0;
var scoreText;

//목숨
var lives = 3;


// 게임 리소스(캐릭터 이미지,배경)
function preload() {
  this.load.setBaseURL('/assets/');
  //배경
  this.load.image('sky', 'background.png');
  //캐릭터
  this.load.image('fox', 'fox.png');
}

// 게임 오브젝트 초기 세팅
function create() {
  // 캐릭터 쌓기용
  players = this.physics.add.group();

  //배경 이미지(배경,기본 캐릭터1)
  var backgroundImage = this.add.image(0, 0, 'sky');
  backgroundImage.setOrigin(0, 0.45); 
  var fox = this.physics.add.image(0, 0, 'fox');
  fox.setOrigin(-4, -3.3); 
  fox.setScale(0.3); 

  //캐릭터 기본 세팅
  player = this.physics.add.sprite(400, 500, 'fox');
  player.setOrigin(-1.5, -1); 
  player.setScale(0.3); 
  //마우스 클릭 가능하게 세팅하기
  player.setInteractive();
  
  //클릭시 정지 후 던지기
  player.on('pointerdown', clickPlayer);
  //점수
  scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#fff' });
}

  // 게임 상태를 업데이트(게임 로직)
function update() {
  // 캐릭터가 자동으로 좌우로 움직임
  player.x += speed;
  // 화면 경계에 닿으면 방향을 바꿈
  if (player.x >= config.width - player.x/2|| player.x <=  -config.width/10) {
     speed *= -1; // 방향 전환
  }
  //던진 후 내려오기
  if (player.y <= -50) {
    console.log("도달")
    player.setVelocityY(500);   
  }
  // 카메라의 y 좌표를 스크롤하면서 이미지를 올려다보게 함
  //this.cameras.main.scrollY -= 1; // 스크롤 속도 및 방향을 조절할 수 있음
}

//클릭 후 정지 후 던지기 함수
function clickPlayer(){
  speed = 0;
  player.setVelocityY(-500);

  var newPlayer = players.create(400, 500, 'fox').setCollideWorldBounds(true);
  newPlayer.setOrigin(-1.5, -1.7); 
  newPlayer.setScale(0.3); 
  newPlayer.setInteractive(); // 클릭 가능하게 설정

  console.log(players.children)

}
