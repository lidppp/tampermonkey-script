// ==UserScript==
// @name         扑飞漫画去广告,增加加历史记录,改下拉式播放
// @namespace    BlueFire
// @version      1.0.7
// @description  改成下拉式播放,左方向键回到目前漫画最后看的那一章,右方向键切换下一章,解除右键菜单屏蔽,删除弹出的广告,本插件是改写自nanfang大佬的扑飞漫画解除网页限制,并没有找到nanfang大佬的联系方式,如果nanfang大佬觉得不妥的话发邮件给我(1512282028@qq.com),我会下架这个插件
// @author       lidppp
// @match        *://www.pufei8.com/manhua/*
// @match        *://www.pufei.cc/manhua/*
// @match        *://www.pufei.org/manhua/*
// @grant        none
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @run-at       document-end
// ==/UserScript==
(function() {
     $(document).ready(function(){
         var imgserver = 'http://res.img.fffimage.com/';
         if(document.getElementById("viewimages")){
             // document.getElementById("viewimages").innerHTML = "<img src=\"" + imgserver + "" + photosr[i] + "\" onerror=\"setimgerror()\" onload=\"loadnextimg(this)\" onClick=\"gonext()\" alt=\"单击进入下一页\" id=\"viewimg\" style=\"cursor:hand;cursor:pointer;\"><br><img src=\"\" id=\"nextimg\" style=\"display:none;\">";
             //  pageStr=$("viewpagename").innerHTML;
             //page_num=parseInt(pageStr.substring(1));
             let str="";
             let url = "http://res.img.scbrxhwl.com/"
             for(let i=1;i<photosr.length;i++){
                 str+="<img src=\"" + url + photosr[i] + "\" style=\"margin:0px;padding:0px;\" onerror=\"setimgerror()\" onload=\"loadnextimg(this)\" id=\"viewimg\"  onClick=\"{             $j.post('/e/extend/ret_page/index.php',{id:viewid},function(data){if(JSON.parse(data).url!=null){window.localStorage.setItem(comicname,JSON.parse(data).url);window.location=JSON.parse(data).url;}else{alert('已经最后一章了，不要太着急看，看完就没了！！！')}})}\"  style=\"cursor:hand;cursor:pointer;\"><br><img src=\"\" id=\"nextimg\" style=\"display:none;\">";
             }
             document.getElementById("viewimages").innerHTML=str;
             let picNav=document.getElementsByClassName("picNav");
             for(let i=0;i<picNav.length;i++){
                 picNav[i].innerHTML="";
             }
             /*下方为我添加的代码*/
             let n = 0
             function RemAD(){
                 var inv = setInterval(()=>{
                     n++
                     var dom1 = document.querySelector("#hm_cpm_show");
                     var dom2 = document.querySelector("#HMRichBox");
                     if(dom1){
                         dom1.parentNode.removeChild(dom1)
                     }
                     if(dom2){
                         dom2.parentNode.removeChild(dom2)
                     }
                     if(!dom1&& !dom2 && n>10){
                         clearInterval(inv)
                     }
                 },100)
             }
             RemAD()
            // $j.post('/e/extend/ret_page/index.php',{id:viewid},function(data){if(JSON.parse(data).url!=null){alert('这是最后一页了，点击“确定”进入下一话！');window.location=JSON.parse(data).url;}else{alert('已经最后一章了，不要太着急看，看完就没了！！！')}})
         }
         document.oncontextmenu = null;
         document.onkeydown = function(e){
             if(e.keyCode==39){
             $j.post('/e/extend/ret_page/index.php',{id:viewid},function(data){if(JSON.parse(data).url!=null){console.log(JSON.parse(data));window.localStorage.setItem(comicname,JSON.parse(data).url);window.location=JSON.parse(data).url;}else{alert('已经最后一章了，不要太着急看，看完就没了！！！')}})
             }
             else if(event.keyCode==37)
             {
                 window.location = window.location.origin+window.localStorage.getItem(comicname);  // 向左跳转历史记录
				// location=prevpage;//向左
             }
         }
     })
})();
