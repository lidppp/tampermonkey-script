// ==UserScript==
// @name         青书学堂课程作业答题快捷搜索辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  青书学堂课程作业快捷答题网络搜索辅助 | 作者 @lidppp 的青书学堂懒人考试脚本(无法搜索有图片的题目)优化版本
// @author       jliuchen
// @match        *://*.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?domain=qingshuxuetang.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

      if(location.href.toLowerCase().indexOf("exampaper") === -1){
        return;
      }
      window.onload = function () {
        let iframe;
        const otherATagSrcNum = 3;
        // window.timeSpend = 99999;
        // window.timeSpend = 99999;
        let parentBox = document.querySelector(".wrapper");
        let container = parentBox.querySelector(".container");
        parentBox.style.width = "48%";
        parentBox.style.margin = "0";
        container.style.width = "100%";
        const testList = container.querySelectorAll(".test-heading");
        for (let i = 0; i < testList.length; i++) {
          testList[i].style.position = "relative";
          let searchStr = testList[i].querySelector("h4").innerText;
          testList[i].addEventListener("click", function (e) {
            bindClick(testList[i].querySelector("h4"),true);
          });
          // 题目全称搜索（包含题号等括号）
          //createATag(testList[i], searchStr);
          // 题目仅名称搜索（不含题号与分值等括号）
          createATag(testList[i], searchStr.substring(searchStr.indexOf(')') + 1, searchStr.lastIndexOf('(')));
        }

        creatIframe(window, "");
        function bindClick(e,isTestClick) {
          if (iframe) {
            if (isTestClick){
              // 题目全称搜索（包含题号等括号）
              //iframe.src = creatBaiduSrc(e.innerText);
              // 题目仅名称搜索（不含题号与分值等括号）
              iframe.src = creatBaiduSrc(e.innerText.substring(e.innerText.indexOf(')') + 1, e.innerText.lastIndexOf('(')));
            }else {
              iframe.src = e;
            }

          }
        }

        function creatIframe(win, search, type) {
          let doc = win.document;
          let style = doc.createElement("style");
          style.innerText = `
          .search-baidu-iframe{
            position: fixed;
            right: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          .searchBox{
            position: absolute;
            right: 0;
            bottom: -20px;
          }
          .searchBox a,.searchBox span{
            margin-right: 5px;
            cursor: pointer;
          }
          .tips{
            position: fixed;
            right: 0;
            top: 0;
            color:red;
            z-index:10;
          }
          `;
          doc.body.appendChild(style);
          /*
          let div = doc.createElement("div")
          div.innerText="点击左侧题目可以在右侧自动搜索,\n两个链接直接跳转到对应搜题网站搜索结果,\n本提示一分钟后自动删除"
          div.classList.add("tips")
          doc.body.appendChild(div);
          setTimeout(()=>{
            div.parentNode.removeChild(div)
          },1000*60)
          */

          iframe = doc.createElement("iframe");
          iframe.src = creatBaiduSrc(search);
          iframe.classList.add("search-baidu-iframe");
          iframe.frameborder = 0;
          doc.body.appendChild(iframe);
        }
        function creatBaiduSrc(str) {
          if (!str) {
            return "https://cn.bing.com/";
          }
          return (
            "https://cn.bing.com/search?q=" + encodeURIComponent(str)
          );
        }

        function creatSrc(search, type) {
          switch (type) {
            case 0:
              return {
                src: `https://www.jiansouti.com/search.php?q=${encodeURI(
                  search
                )}&f=_all&m=yes&syn=yes&s=relevance`,
                text: "简搜题",
              };
            case 1:
              return {
                src: `https://www.xilvedu.cn/search.aspx?key=${escape(search)}`,
                text: "作业无忧",
              };
            case 2:
              return {
                src: `https://www.asklib.com/s/${search}`,
                text: "问答库"
              }
          }
        }

        function createATag(dom, text) {
          let div = document.createElement("div");
          div.classList.add("searchBox");
          for (let i = 0; i < otherATagSrcNum; i++) {
            let a = document.createElement("span");
            let src = creatSrc(text, i);
            // a.href = src.src;
            a.innerText = src.text;
            // a.target = "_blank";
            a.onclick = function (e){
              e.stopPropagation()
              e.preventDefault();
              bindClick(src.src)
            }
            div.appendChild(a);
          }
          dom.appendChild(div);
        }
      };

      // 如果不需要锁死倒计时, 下方三行代码注释掉即可
      // 这里修改倒计时  单位是秒
      // 目前是 20分钟(60秒*20) + 不超过5分钟的随机数,需要的话自行修改, 因为我不确定每个考试是不是固定两个小时
      // let timeSpend = 60*20 + Math.floor(Math.random()*5)*60
      // setInterval(()=>{
      //   window.timeSpend = timeSpend;
      // },1000)
    
    // 屏蔽无法粘贴
    if (CKEDITOR){
        setTimeout(()=>{
            let keys = Object.keys(CKEDITOR.instances)
            for (let i = 0; i < keys.length; i++) {
                CKEDITOR.instances[keys[i]].destroy();

                CKEDITOR.replace(keys[i], {
                    uploadUrl: 'https://www.qingshuxuetang.com/Svc/UploadImg',
                    filebrowserUploadUrl: 'https://www.qingshuxuetang.com/Svc/UploadFile',
                    customConfig: 'config.cust.question.js',
                    height: 80
                });
            }
        },5000)
    }
})();
