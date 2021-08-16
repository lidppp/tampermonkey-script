// ==UserScript==
// @name         青书学堂刷视频脚本
// @namespace    lidppp
// @version      1.0.0
// @description  这是一个刷视频的脚本, 解决了其他脚本会跳转至空白页面的问题, 屏蔽长时间观看会导致视频暂停的问题, 添加视频解码失败容错处理
// @author       lidppp
// @match        *://*.qingshuxuetang.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    var url = location.href;
    if (url.indexOf("cw_nodeId") > -1) {
        window.addEventListener("load", function () {
            try {
                uploadStudyRecordBegin();
                var video = document.querySelector("video");
                console.log(video);
                var params = getUrlParmas();
                // 课程ID
                var courseId = params.courseId;
                const arr = [];
                CoursewareXMLParser.parseCourseXML((medias) => {
                    console.log(medias)
                    formatData(medias, arr);

                    // 下一个播放的视频的key
                    var nextvalue = findNextKye(arr, params.cw_nodeId);
                    const {id:nextKey,type} = nextvalue
                    console.log(nextvalue);
                    if (!nextKey) {
                        return;
                    }

                    let nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&cw_nodeId=${nextKey}&category=${params.category}`;
                    console.log(
                        params,
                        "currentId:",
                        params.cw_nodeId,
                        "nextKey:",
                        nextKey,
                        "nextUrl:",
                        nextUrl
                    );
                    if(video){
                        // 设置静音并播放
                        video.muted = true;
                        // 设置视频播放的起点为0, 防止重复刷课直接跳转下一集
                        video.currentTime = 0;
                        // 设置倍速播放 支持以下速率:  0.5-2
                        video.playbackRate = 1;
                        video.autoplay=true;
                        video.play()
                        // 视频播放结束,自动下一条视频
                        video.addEventListener("ended", function () {
                            setTimeout(() => {
                                jumpNextVideo(nextKey,type,nextUrl)
                            }, 5000);
                        });
                    }else{
                        jumpNextVideo(nextKey,type,nextUrl)
                    }



                });
            } catch (e) {
                location.reload();
            }
        });
        getVideoProgress();
    }
})();

function getUrlParmas() {
    var url = location.href; 
    let arr = url.split("?")[1].split("#")[0].split("&");
            const resObj = {};
            arr.forEach(item => {
                let [key, value = ''] = item.split("=")
                resObj[key] = value
            })
            return resObj
}

// 如果video标签长时间未播放则认为视频加载失败,刷新网页
function getVideoProgress() {
    let perTime = 0;
    let flag = 0;
    setInterval(function () {
        try{
            var video = document.querySelector("video");
            var currentTime = video.currentTime.toFixed(0);
            if(perTime == currentTime){
                flag+=1;
                if(flag > 3){
                    location.reload();
                }
            }else{
                perTime = currentTime
                flag=0;
            }
            console.log("当前课件进度:" + currentTime);
        }catch(e){
            location.reload()
        }
    }, 10000);
}

// 防止弹出长时间观看的确定框
function uploadStudyRecordBegin(contentId) {
    CoursewarePlayer.pause = ()=>{}
}

function formatData(data, arr = []) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.mediaUrl) {
            arr.push(item);
        }
        if (item.children.length) {
            formatData(item.children, arr);
        }
    }
    return arr;
}

function findNextKye(arr, key) {
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (item.id === key) {
            let index;
            if (i + 1 < arr.length) {
                index = i + 1;
            } else {
                index = 0;
            }
            return {
                id:arr[index].id,
                type: arr[index].category
            };
        }
    }
}

function jumpNextVideo(nextKey,type,nextUrl){
    if(CoursewareNodesManager && CoursewareNodesManager.onMenuClick){
        CoursewareNodesManager.onMenuClick(nextKey, type);
        return;
    }
    location.replace(nextUrl)
}
