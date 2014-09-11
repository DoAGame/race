/**
* Created by dujizhong on 2014/9/10.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene(parent) {
        _super.call(this);
        this.TRACK_BOUND = 0.1333;
        this.TRACK_UP_BOUND = 0.2567;
        this.ENEMY_INTERVAL = 1000;
        this.ENEMY_SPEED = 3000;
        this.mTrack = 2;
        this.mOldTime = 0;
        this.mParent = parent;
        this.init();
    }
    GameScene.prototype.init = function () {
        this.mEnemyList = [];
        this.mBg = Util.createBitmapByName("bg");
        this.addChild(this.mBg);

        this.mRoad = new MovieClip2D("scene", ["sc1", "sc2", "sc3"]);
        this.mRoad.scaleX = this.mRoad.scaleY = Util.stage_width / this.mRoad.width;
        this.mRoad.y = Util.stage_height - this.mRoad.height * this.mRoad.scaleX;
        this.addChild(this.mRoad);

        this.mBg.scaleX = this.mBg.scaleY = this.mRoad.scaleX;
        this.mBg.y = this.mRoad.y - this.mBg.height * this.mBg.scaleY + 260;

        this.mHero = new MovieClip2D("sprite", ["hare1", "hare2"]);
        this.mHero.anchorX = this.mHero.anchorY = 0.5;
        this.mHero.scaleX = this.mHero.scaleY = this.mRoad.scaleX;
        this.mHero.y = Util.stage_height - this.mHero.height / 2 * this.mHero.scaleX;
        this.mHero.x = Util.stage_width / 2;
        this.addChild(this.mHero);
    };

    GameScene.prototype.startGame = function () {
        this.mRoad.play();
        this.mHero.play();
        this.addEventListener(egret.Event.ENTER_FRAME, this.checkEnemy, this);
    };

    GameScene.prototype.checkEnemy = function () {
        var now = egret.getTimer();
        if (now - this.mOldTime < this.ENEMY_INTERVAL)
            return;
        this.mOldTime = now;

        var index = Math.floor(Math.random() * 1000 % 4);
        var track = Math.floor(Math.random() * 100000 % 3 + 1);
        if (index) {
            this.createEnemy(index, track);
        }
    };

    GameScene.prototype.createEnemy = function (index, track) {
        var enemy;
        switch (index) {
            case 1:
                enemy = new MovieClip2D("sprite", ["ruhua1", "ruhua2"]);
                break;
            case 2:
                enemy = new MovieClip2D("sprite", ["bajie1", "bajie2"]);
                break;
            case 3:
                enemy = new MovieClip2D("sprite", ["coin"]);
                break;
        }
        enemy.scaleX = enemy.scaleY = this.mRoad.scaleX;
        enemy.anchorX = 0.5;
        enemy.anchorY = 0.5;
        enemy.y = Util.stage_height - 540 * this.mRoad.scaleX;
        enemy.x = this.getTrackOffset(enemy, track, true);
        enemy.play();
        this.addChild(enemy);
        this.mEnemyList.push(enemy);
        var tw = egret.Tween.get(enemy);
        tw.to({ x: this.getTrackOffset(enemy, track), y: Util.stage_height + enemy.height / 2 }, this.ENEMY_SPEED);
    };

    GameScene.prototype.move = function (value) {
        if (this.mTrack + value > 3 || this.mTrack + value < 1)
            return;
        this.mTrack += value;
        var toX = this.getTrackOffset(this.mHero, this.mTrack);

        egret.Tween.removeTweens(this.mHero);
        var tw = egret.Tween.get(this.mHero);
        tw.to({ x: toX }, 100);
    };

    GameScene.prototype.getTrackOffset = function (shower, track, up) {
        if (typeof up === "undefined") { up = false; }
        var toX = 0;
        var bound = up ? this.TRACK_UP_BOUND : this.TRACK_BOUND;
        if (track == 1) {
            toX = Util.stage_width * bound;
        } else if (track == 2) {
            toX = Util.stage_width / 2;
        } else if (track == 3) {
            toX = Util.stage_width * (1 - bound);
        }

        return toX;
    };
    return GameScene;
})(egret.Sprite);
GameScene.prototype.__class__ = "GameScene";
//# sourceMappingURL=GameScene.js.map
