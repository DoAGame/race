/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    private mRoadBound:number = 0.0934;
    private mMainUI:MainUI;
    private mReadyUI:ReadyUI;
    private mGameScene:GameScene;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        Util.stage_width = this.stage.stageWidth;
        Util.stage_height = this.stage.stageHeight;
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private createGameScene():void
    {
        this.mMainUI = new MainUI(this.onStart, this);
        this.addChild(this.mMainUI);
    }

    public onStart():void
    {
        if(this.mMainUI != null)
        {
            this.mMainUI.parent.removeChild(this.mMainUI);
        }
        this.mReadyUI = new ReadyUI(this.startGame, this);
        this.addChild(this.mReadyUI);
        this.mReadyUI.ready();
    }

    public startGame():void
    {
        if(this.mReadyUI && this.mReadyUI.parent)
        {
            this.mReadyUI.clear();
            this.removeChild(this.mReadyUI);
        }
        this.mGameScene = new GameScene(this);
        this.addChild(this.mGameScene);
        this.mGameScene.startGame();

        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);

    }

    private touchStart:number=0;
    private touchTimer:egret.Timer;
    private touchStartPoint:egret.Point;
    private touchBegin(e:egret.TouchEvent):void
    {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.touchStart = egret.getTimer();
        this.touchStartPoint = new egret.Point(e.stageX, e.stageY);
//        if(this.touchTimer == null)
//        {
//            this.touchTimer = new egret.Timer(100, 1);
//            this.touchTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComplete, this);
//        }
    }

    private touchEnd(e:egret.TouchEvent):void
    {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        if(e.stageX == this.touchStartPoint.x)
        {
            if(e.stageX > Util.stage_width/2)
            {
                this.mGameScene.move(1);
            }else{
                this.mGameScene.move(-1);
            }
        }else if(e.stageX > this.touchStartPoint.x){
            this.mGameScene.move(1);
        }else{
            this.mGameScene.move(-1);
        }
    }

//    private timerComplete(e:egret.TimerEvent):void
//    {
//        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
//        this.removeEventListener(egret.TouchEvent.TOUCH_OVER, this.touchOver, this);
//
//    }
}