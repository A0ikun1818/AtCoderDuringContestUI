// ==UserScript==
// @name         AtCoder During Contest UI
// @namespace    http://tampermonkey.net/
// @version      2024-07-30-01
// @description  try to take over the world!
// @author       A0ikun1818
// @match        https://atcoder.jp/contests/*
// @exclude      https://atcoder.jp/contests/*/standings/virtual
// @exclude      https://atcoder.jp/contests/*/editorial
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @updateURL    https://github.com/A0ikun1818/AtCoderDuringContestUI/raw/main/AtCoderDuringContestUI.user.js
// @downloadURL  https://github.com/A0ikun1818/AtCoderDuringContestUI/raw/main/AtCoderDuringContestUI.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let path = location.pathname.toString().split('/');
    let contestId = (path.length>=3 ? path[2] : null);
    let durationTimes = document.querySelectorAll('a[href*="timeanddate"]');
    let endTime = (durationTimes.length == 0 ? new Date(9999,12,31) : durationTimes[durationTimes.length - 1]);

    // console.log(contestId);
    if(endTime > new Date()) return;// コンテスト中は本スクリプトを機能させない
    // すべての提出→自分の提出
    let subs = document.querySelectorAll('a[href$="submissions"]');
    for(let sub of subs){
        if(sub.querySelector("span.glyphicon-globe") != null || sub.innerText.toString().match(/(全|すべ)ての提出/)){
            // すべての提出
            sub.remove();
        }else{
            sub.href += "/me";
        }
    }

    {
        // バーチャル順位表タブ削除
        let style = document.createElement('style');
        style.id = "atcoder-virtual-hidden";
        style.classList.add("atcoder-during-contest-ui");
        style.type = "text/css";
        style.innerHTML = ""+
            "li:has(>a[href*='virtual']), li:has(>a[href*='extended']){\n"+
            "    display: none !important;\n"+
            "}\n";
        document.querySelector('html').appendChild(style);
    }
    {
        // 解説タブ・ボタン削除
        let style = document.createElement('style');
        style.id = "atcoder-editorial-hidden";
        style.classList.add("atcoder-during-contest-ui");
        style.type = "text/css";
        style.innerHTML = ""+
            "li:has(a[href*='editorial']), a[href*='editorial']{\n"+
            "    display: none !important;\n"+
            "}\n";
        document.querySelector('html').appendChild(style);
    }
    {
        // 注意書き表示
        let insertZone = document.getElementById("task-statement");
        console.log(durationTimes);
        if(endTime != null){
            let endDate = new Date(endTime.innerText);

            let rule = '<a href="/contests/'+contestId+'/rules">ルール</a>';
            let kiji = '<a href="/posts/262">記事</a>';
            let dateString = endDate.toString();

            let msg = "<p>" + dateString + " まで、問題の内容・感想・解法などをSNSに投稿することは"+rule+"に違反する行為です。</p>"
            + "<p>どのような投稿がルールに違反するかはこちらの"+kiji+"もお読みください。</p>"
            + '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                + '    <span aria-hidden="true">&times;</span>'
            + '  </button>';
            let msgWindow = document.createElement('div');
            msgWindow.classList.add("alert","alert-warning","alert-dismissible","show");
            msgWindow.classList.add("atcoder-during-contest-ui");
            msgWindow.role = "alert";
            msgWindow.innerHTML = msg;

            let msg2 = "<p>このコンテストでは、生成AI対策のため、問題文を直接生成AIなどのプログラムに与えることを禁止しております。詳しくは以下のルールをご確認ください。</p>"
            +'<p><a href="/posts/1246" style="color:inherit"><strong>AtCoder生成AI対策ルール</strong></a></p>'
                        + '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                + '    <span aria-hidden="true">&times;</span>'
            + '  </button>';

            let msgWindow2 = document.createElement('div');
            msgWindow2.classList.add("alert","alert-warning","alert-dismissible","show");
            msgWindow2.classList.add("atcoder-during-contest-ui");
            msgWindow2.role = "alert";
            msgWindow2.innerHTML = msg2;

            // ABC357以降では、生成AIに関する注意事項も表示する
            if(contestId.match(/abc[0-9]{3}/)!=null && contestId>="abc357") insertZone.prepend(msgWindow2);
            // AHCでは注意書きを出さない
            if(contestId.match(/(a[brg]c[0-9]{3}|[a-z]{4,9}[0-9]{4})/)!=null) insertZone.prepend(msgWindow);

            // 停止ボタン生成
            {
                let stopButton = document.createElement('button');
                stopButton.innerHTML = "Stop During Mode";
                stopButton.classList.add("btn","btn-warning","btn-sm","atcoder-during-contest-ui");
                stopButton.addEventListener('click', function(){
                    let allScriptElements = document.querySelectorAll('.atcoder-during-contest-ui');
                    for(let e of allScriptElements){
                        e.remove();
                    }
                });
                // 配置場所
                let stopButtonInsertZone = document.querySelector("div.editor-buttons, div[data-a2a-title]");
                stopButtonInsertZone.appendChild(stopButton);
            }
        }
    }
})();
