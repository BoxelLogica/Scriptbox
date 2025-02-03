// LAST EDIT 1/28 3:23

var config =  {
    type: Phaser.AUTO,
    scale:  {
        parent: 'gameContainer',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 480*4,
        height: 270*4    
    },
    physics:  {
        default: 'arcade',
        arcade:  {
            gravity:  { y: 980},
            debug: false        
        }
    },
    pixelArt:true,
    render: {
        antialias: false,
    },
    scene:  {
        preload: preload,
        create: create,
        update: update
    }    
}



// DEFINE META VARIABLES
var game = new Phaser.Game(config)
var centerX = game.scale.width/2
var centerY = game.scale.height/2
// DEFINE PLAYER RELATED VARIABLES
var player
var playerStatus = 'true'
var playerDirection
var playerCostume
var camera
// DEFINE GAME OBJECT VARIABLES
var ground
var arrows
var rectangle
// DEFINE PHYSICS GUN VARIABLES
var physgun
var physLine
var selectedObject
// DEFINE PLAYER MOVEMENT VARIABLES
var walkSpeed = 130
var sprintSpeed = 200
var speedMult = 1
var jumpSpeed = 275
var jumpCount
var airTime



function preload ()  {
    this.load.image('physgun', 
        '/sprites/physgun.png')

    // SOPHIE SPRITESHEET
    this.load.spritesheet('sophie', 
        '/sprites/sophie.png', 
         { frameWidth: 20, frameHeight: 24 }
    )
    // PLAYERTEST SPRITESHEET
    this.load.spritesheet('playerTest', 
        '/sprites/green_test_sprite.png', 
         { frameWidth: 32, frameHeight: 32 }
    )
    // PLAYERTEST MISSINGTEXTURE
    this.load.spritesheet('missingTexture', 
        '/sprites/missingTexture.png', 
         { frameWidth: 32, frameHeight: 32 }
    )
}





function create ()  {
    // SETUP PLAYER
    player = this.physics.add.sprite(centerX, centerY, 'sophie').setOrigin(0.5, 1)
    player.body.width = 20
    player.body.height = 24
    player.body.setDrag(1000, 0)
    playerDirection = 'right'
    playerCostume = 'sophie'
    player.setTexture(playerCostume)
    // SETUP CAMERA
    camera = this.cameras.main
    camera.setZoom(5)
    camera.startFollow(player) 
    camera.setFollowOffset(0, 30) 
    camera.setLerp(.075, .075)
    // SETUP FLOOR
    rectangle = this.add.rectangle(centerX, centerY + 32, 256, 16, 0xA7CEEB)
    this.physics.add.existing(rectangle, true)
    // SETUP PHYSICS GUN
    physLine = this.add.line(0, 0, player.x, player.y, rectangle.x, rectangle.y, 0x4dFFFF, 0.5).setLineWidth(1).setOrigin(0)
    physLine.visible = false


    physgun = this.add.sprite(player.x, player.y, 'physgun').setOrigin(1,1)


    // DEFINE INPUTS
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    arrows = this.input.keyboard.createCursorKeys()

    keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
    keyFOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
    keyFIVE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
    keySIX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
    keySEVEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
    keyEIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT)
    keyNINE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE)
    keyZERO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO)



    // DEFINE ANIMATIONS
    // SOPHIE ANIMS
    this.anims.create({
        key: 'sophieLeft',
        frames: this.anims.generateFrameNames('sophie', { frames: [1, 0] }),
        frameRate: 6,
    })
    this.anims.create({
        key: 'sophieRight',
        frames: this.anims.generateFrameNames('sophie', { frames: [5, 4] }),
        frameRate: 6,
    })
    // PLAYERTEST ANIMS
    this.anims.create({
        key: 'playerTestLeft',
        frames: this.anims.generateFrameNames('playerTest', { frames: [1] }),
        frameRate: 6,
    })
    this.anims.create({
        key: 'playerTestRight',
        frames: this.anims.generateFrameNames('playerTest', { frames: [3] }),
        frameRate: 6,
    })
}










function update () {
    // ADD COLLISIONS
    this.physics.add.collider(player, ground)
    this.physics.add.collider(player, rectangle)

    // PLAYER DEATH
    if (playerStatus === 'dead') {
        player.angle = -90
        // playerStatus = 'alive'
        // restart()
        // player.angle = 0
        // airTime = 0
        return
    }




    // MOVE RIGHT
    if (keyA.isDown) {
        player.body.velocity.x = -getMoveSpeed() * speedMult
        playerDirection = 'left'
    }
    // MOVE LEFT
    else if (keyD.isDown) {
        player.body.velocity.x = getMoveSpeed() * speedMult
        playerDirection = 'right'
    }
    // STOP MOVING
    else {
        player.body.acceleration.x = 0
        player.angle = 0
    }
    // JUMP
    if (Phaser.Input.Keyboard.JustDown(keyW) && airTime > 0) {
        player.setVelocityY(-jumpSpeed)
        airTime = 0
    }
    // CROUCH
    if (keyS.isDown) {
        player.scaleY = 0.5
    } else {
        player.scaleY = 1
    }
    // ON FLOOR ACTIONS
    if (player.body.touching.down) {    
        airTime = 40
    }
    // IN AIR ACTIONS
    if (!player.body.touching.down) {
        airTime--
    }
    // ADJUST ANGLE RELATIVE TO VELOCITY
    player.angle = player.body.velocity.x / 15
    // RESET POSITION
    if (Phaser.Input.Keyboard.JustDown(keyR)) {
        restart()
    }
    // UPDATE PHYSICS GUN
    physLine.setTo(
        Number(player.x),
        Number(player.y),
        Number(rectangle.x),
        Number(rectangle.y)
    )



    if (keyONE.isDown) {
        playerCostume = 'sophie'
        player.setTexture(playerCostume)
    }
    if (keyTWO.isDown) {
        playerCostume = 'playerTest'
        player.setTexture(playerCostume)
    }
    if (keyTHREE.isDown) {
        playerCostume = 'missingTexture'
        player.setTexture(playerCostume)
    }

    if (Phaser.Input.Keyboard.JustDown(keyK)) {
        playerStatus = 'dead'
    }

    // ACTIVELY CONTROL ANIMATIONS
    animationHandler()
    weaponHandler()
    speedHandler()
}





function animationHandler() {
    // RIGHT ANIMATION
    if (playerDirection === 'right') {
        if (player.body.velocity.x > 0) {
            player.anims.play(`${playerCostume}Right`, true)
            if (!player.body.touching.down) {
                player.setFrame(5)
            }
        }
        else {
            player.setFrame(4)
            if (!player.body.touching.down) {
                player.setFrame(5)
            }
        }
    }
    // LEFT ANIMATION
    if (playerDirection === 'left') {
        if (player.body.velocity.x < 0) {
            player.anims.play(`${playerCostume}Left`, true)
            if (!player.body.touching.down) {
                player.setFrame(1)
            }
        }
        else {
            player.setFrame(0)
            if (!player.body.touching.down) {
                player.setFrame(1)
            }
        }
    }
}

function weaponHandler() {
    var aimX = 0
    var aimY = 0

    if (arrows.up.isDown) {aimY = -1}
    if (arrows.down.isDown) {aimY = 1}
    if (arrows.left.isDown) {aimX = -1}
    if (arrows.right.isDown) {aimX = 1}

    if (aimX !== 0 || aimY !== 0) {
        var aimAngle = Math.atan2(aimX, -aimY)
        physgun.rotation = aimAngle
    }

    physgun.x = player.x
    physgun.y = player.y


    camera.setFollowOffset(-aimX * 20, -aimY * 20 + 30) 

}

function speedHandler() {
    if (player.body.touching.down) {
        if (keyS.isDown) {
            speedMult = 0.5
        }
        else {
            speedMult = 1
        }
    }
    
    else if (!player.body.touching.down) {
        speedMult = 1
    }
}

function getMoveSpeed() {
    if (keySHIFT.isDown) {
        return sprintSpeed
    }
    else {
        return walkSpeed
    }
}

function restart() {
    player.x = centerX
    player.y = centerY
    player.body.velocity.x = 0
    player.body.velocity.y = 0
}