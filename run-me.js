;(function (window) {
  'use-strict';

  function CollisionBox(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  };

  function boxCompare(tRexBox, obstacleBox) {
    var crashed = false;
    var tRexBoxX = tRexBox.x;
    var tRexBoxY = tRexBox.y;

    var obstacleBoxX = obstacleBox.x;
    var obstacleBoxY = obstacleBox.y;

    // Axis-Aligned Bounding Box method.
    if (tRexBox.x < obstacleBoxX + obstacleBox.width &&
      tRexBox.x + tRexBox.width > obstacleBoxX &&
      tRexBox.y < obstacleBox.y + obstacleBox.height &&
      tRexBox.height + tRexBox.y > obstacleBox.y) {
      crashed = true;
    }

    return crashed;
  };

  function createAdjustedCollisionBox(box, adjustment) {
    return new CollisionBox(
      box.x + adjustment.x,
      box.y + adjustment.y,
      box.width,
      box.height);
  };

  function shouldJump(obstacle, tRex, distance) {
    var boxes = {
      DUCKING: [
        new CollisionBox(1, 18, 55, 25)
      ],
      RUNNING: [
        new CollisionBox(22, 0, 17, 16),
        new CollisionBox(1, 18, 30, 9),
        new CollisionBox(10, 35, 14, 8),
        new CollisionBox(1, 24, 29, 5),
        new CollisionBox(5, 30, 21, 4),
        new CollisionBox(9, 34, 15, 4)
      ]
    };

    var obstacleBoxXPos = Runner.defaultDimensions.WIDTH + obstacle.xPos;

    var tRexBox = new CollisionBox(
      tRex.xPos + 1,
      tRex.yPos + 1,
      tRex.config.WIDTH + distance,
      tRex.config.HEIGHT - 2);

    var obstacleBox = new CollisionBox(
      obstacle.xPos + 1,
      obstacle.yPos + 1,
      obstacle.typeConfig.width * obstacle.size - 2,
      obstacle.typeConfig.height - 2);

    return boxCompare(tRexBox, obstacleBox);
  };


  var IS_IOS = window.navigator.userAgent.indexOf('CriOS') > -1 ||
    window.navigator.userAgent == 'UIWebViewForStaticFileContent';

  function getTimeStamp() {
    return IS_IOS ? new Date().getTime() : performance.now();
  }


  function updateHook(callback) {
    var now = getTimeStamp();
    var deltaTime = now - (this.time || now);
    this.runningTime += deltaTime;
    var hasObstacles = this.runningTime > this.config.CLEAR_TIME && this.horizon.obstacles[0] != undefined;

    var trexShouldJump = hasObstacles && shouldJump(this.horizon.obstacles[0], this.tRex, 100);
    if (trexShouldJump) {
      this.tRex.startJump(this.currentSpeed);
    }

    return callback();
  }

  runner = window.runner || Runner(undefined, undefined);
  runner.update = updateHook.bind(runner, runner.update.bind(runner));
  
  window.runner = runner;
})(window);
