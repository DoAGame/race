/**
 * Created by dujizhong on 2014/9/10.
 */

class GameScene extends egret.Sprite
{
    private TRACK_BOUND:number = 0.1333;
    private TRACK_UP_BOUND:number = 0.2567;
    private ENEMY_INTERVAL:number = 1000;
    private ENEMY_SPEED:number = 3000;
    private mParent:any;
    private mBg:egret.Bitmap;
    public mRoad:MovieClip2D;
    private mHero:MovieClip2D;
    private mTrack:number=2; //当前赛道，2为中间赛道，共3赛道
    private mEnemyList:Array<MovieClip2D>;
    private mOldTime:number = 0;

    public constructor(parent:any)
    {
        super();
        this.mParent = parent;
        this.init();
    }

    private init():void
    {
        this.mEnemyList = [];
        this.mBg = Util.createBitmapByName("bg");
        this.addChild(this.mBg);

        this.mRoad = new MovieClip2D("scene", ["sc1", "sc2", "sc3"]);
        this.mRoad.scaleX = this.mRoad.scaleY = Util.stage_width / this.mRoad.width;
        this.mRoad.y = Util.stage_height - this.mRoad.height * this.mRoad.scaleX;
        this.addChild(this.mRoad);

        this.mBg.scaleX = this.mBg.scaleY = this.mRoad.scaleX;
        this.mBg.y = this.mRoad.y - this.mBg.height*this.mBg.scaleY + 260;

        this.mHero = new MovieClip2D("sprite", ["hare1", "hare2"]);
        this.mHero.anchorX = this.mHero.anchorY = 0.5;
        this.mHero.scaleX = this.mHero.scaleY = this.mRoad.scaleX;
        this.mHero.y = Util.stage_height - this.mHero.height/2*this.mHero.scaleX;
        this.mHero.x = Util.stage_width / 2;
        this.addChild(this.mHero);
    }

    public startGame():void
    {
        this.mRoad.play();
        this.mHero.play();
        this.addEventListener(egret.Event.ENTER_FRAME, this.checkEnemy, this);
    }

    private checkEnemy():void
    {
        var now:number = egret.getTimer();
        if(now - this.mOldTime < this.ENEMY_INTERVAL) return;
        this.mOldTime = now;

        var index:number = Math.floor(Math.random() * 1000 % 4);
        var track:number = Math.floor(Math.random() * 100000 % 3 + 1);
        if(index)
        {
            this.createEnemy(index, track);
        }
    }

    private createEnemy(index:number, track:number):void
    {
        var enemy:MovieClip2D;
        switch(index)
        {
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
        tw.to({x:this.getTrackOffset(enemy, track), y:Util.stage_height + enemy.height/2}, this.ENEMY_SPEED);
    }

    public move(value:number):void
    {
        if(this.mTrack + value > 3 || this.mTrack + value < 1) return;
        this.mTrack += value;
        var toX:number=this.getTrackOffset(this.mHero, this.mTrack);

        egret.Tween.removeTweens(this.mHero);
        var tw = egret.Tween.get(this.mHero);
        tw.to({x:toX}, 100);
    }

    private getTrackOffset(shower:egret.DisplayObject, track:number, up:boolean=false):number
    {
        var toX:number = 0;
        var bound:number = up ? this.TRACK_UP_BOUND : this.TRACK_BOUND;
        if(track == 1)
        {
            toX = Util.stage_width * bound;
        }else if(track == 2)
        {
            toX = Util.stage_width/2;
        }else if(track == 3)
        {
            toX = Util.stage_width * (1-bound);
        }

        return toX;
    }
}
