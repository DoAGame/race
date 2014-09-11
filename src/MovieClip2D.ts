/**
 * Created by dujizhong on 2014/9/10.
 */

class MovieClip2D extends  egret.DisplayObjectContainer
{
    private mTextureNames:Array<string>;
    private mTextures:Array<egret.Texture>;
    private mBitmap:egret.Bitmap;
    private mCurrentFrame:number;
    private mTotalFrame:number;
    private mFrameRate:number = 30;

    public constructor(sheet:string, textureNames:Array<string>)
    {
        super();
        this.mTextureNames = textureNames;
        this.mBitmap = new egret.Bitmap();
        this.mTextures = [];
        var len:number = textureNames.length;
        for(var i:number=0; i < len; ++i)
        {
            var texture:egret.Texture = RES.getRes(sheet + "." + this.mTextureNames[i]);
            this.mTextures[i] = texture;
        }
        this.mTotalFrame = len;

        this.addChild(this.mBitmap);
        this.currentFrame = 1;
    }

    public play():void
    {
        this.doPlay();
    }

    public gotoAndPlay(frame:number):void
    {
        this.currentFrame = frame;
        this.doPlay();
    }

    public stop():void
    {
        this.doStop();
    }

    public get frameRate():number
    {
        return this.mFrameRate;
    }

    public set frameRate(value:number)
    {
        this.mFrameRate = value;
    }

    public set currentFrame(frame:number)
    {
        if(frame > this.mTotalFrame) return;
        this.mBitmap.texture = this.mTextures[frame-1];
        this.mCurrentFrame = frame;
    }

    public get currentFrame():number
    {
        return this.mCurrentFrame;
    }

    private doStop():void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.frameHandle, this);
    }

    private doPlay():void
    {
        this.addEventListener(egret.Event.ENTER_FRAME, this.frameHandle, this);
    }

    private mLastFrame:number=0;
    private frameHandle(e:egret.Event):void
    {
        var now:number = egret.getTimer();
        if(now - this.mLastFrame < (1000 / this.mFrameRate)) return;
        this.mLastFrame = now;

        this.currentFrame = (this.currentFrame+1) > this.mTotalFrame ? 1 : (this.currentFrame+1);
    }
}
