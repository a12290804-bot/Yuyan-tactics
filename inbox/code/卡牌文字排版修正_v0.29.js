/* v0.29 卡牌自動縮字：放在 hex/index.html 的 core.js 之後、body 結尾之前。
   不改 cardHtml；用 MutationObserver 抓到新卡就量一次。
   規則：牌名 13→9px（只看寬）；效果 11→9px；還裝不下就加 fit-tall（圖縮短、效果區變高）再 10→8px；8px 仍裝不下才加 fit-cut 淡出，長按照舊看全文。 */
(function(){
  function over(el,w){return w?el.scrollWidth>el.clientWidth+1:el.scrollHeight>el.clientHeight+1;}
  function fitBox(el,max,min,step,w){
    el.style.fontSize=max+'px';
    var s=max;
    while(s>min&&over(el,w)){s-=step;el.style.fontSize=s+'px';}
    return !over(el,w);
  }
  function fitCard(c){
    if(!c||!c.offsetWidth)return; // 還沒顯示的卡等下次
    var cn=c.querySelector('.cn'),cd=c.querySelector('.cd');
    if(c.querySelector('.pnote'))c.classList.add('has-pnote');
    if(cn)fitBox(cn,13,9,0.5,1);
    if(cd){
      c.classList.remove('fit-tall');
      var ok=fitBox(cd,11,9,0.5);
      if(!ok){c.classList.add('fit-tall');ok=fitBox(cd,10,8,0.5);}
      cd.classList.toggle('fit-cut',!ok);
    }
    c.dataset.fit=1;
  }
  function fitAll(root){(root||document).querySelectorAll('.card:not([data-fit])').forEach(fitCard);}
  window.fitCardText=function(){document.querySelectorAll('.card').forEach(function(c){delete c.dataset.fit;});fitAll();};
  var q=0;
  new MutationObserver(function(){if(q)return;q=requestAnimationFrame(function(){q=0;fitAll();});})
    .observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',function(){window.fitCardText();});
  var t2=0;document.addEventListener('click',function(){clearTimeout(t2);t2=setTimeout(fitAll,60);},true);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){window.fitCardText();});
  fitAll();
})();
