/**
* Created by dujizhong on 2014/9/10.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MovieClip2D = (function (_super) {
    __extends(MovieClip2D, _super);
    function MovieClip2D(sheet, textureNames) {
        _super.call(this);
        this.mFrameRate = 30;
        this.mLastFrame = 0;
        this.mTextureNames = textureNames;
        this.mBitmap = new egret.Bitmap();
        this.mTextures = [];
        var len = textureNames.length;
        for (var i = 0; i < len; ++i) {
            var texture = RES.getRes(sheet + "." + this.mTextureNames[i]);
            this.mTextures[i] = texture;
        }
        this.mTotalFrame = len;

        this.addChild(this.mBitmap);
        this.currentFrame = 1;
    }
    MovieClip2D.prototype.play = function () {
        this.doPlay();
    };

    MovieClip2D.prototype.gotoAndPlay = function (frame) {
        this.currentFrame = frame;
        this.doPlay();
    };

    MovieClip2D.prototype.stop = function () {
        this.doStop();
    };

    Object.defineProperty(MovieClip2D.prototype, "frameRate", {
        get: function () {
            return this.mFrameRate;
        },
        set: function (value) {
            this.mFrameRate = value;
        },
        enumerable: true,
        configurable: true
    });



    Object.defineProperty(MovieClip2D.prototype, "currentFrame", {
        get: function () {
            return this.mCurrentFrame;
        },
        set: function (frame) {
            if (frame > this.mTotalFrame)
                return;
            this.mBitmap.texture = this.mTextures[frame - 1];
            this.mCurrentFrame = frame;
        },
        enumerable: true,
        configurable: true
    });

    MovieClip2D.prototype.doStop = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.frameHandle, this);
    };

    MovieClip2D.prototype.doPlay = function () {
        this.addEventListener(egret.Event.ENTER_FRAME, this.frameHandle, this);
    };

    MovieClip2D.prototype.frameHandle = function (e) {
        var now = egret.getTimer();
        if (now - this.mLastFrame < (1000 / this.mFrameRate))
            return;
        this.mLastFrame = now;

        this.currentFrame = (this.currentFrame + 1) > this.mTotalFrame ? 1 : (this.currentFrame + 1);
    };
    return MovieClip2D;
})(egret.DisplayObjectContainer);
MovieClip2D.prototype.__class__ = "MovieClip2D";
//# sourceMappingURL=MovieClip2D.js.map
