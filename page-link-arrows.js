/* A consistent ↗ cue for links that navigate to a page or document.
   Keep in-page anchors, branding and controls without destinations unchanged. */
(()=>{
  'use strict';
  const selector='a[href]:not(.brand):not(.skip-link)';
  const arrowClass='page-link-arrow';
  const ignored=/^(?:#|mailto:|tel:|javascript:|data:|blob:)/i;

  function update(link){
    if(!link.matches(selector)||link.hasAttribute('download'))return;
    const href=(link.getAttribute('href')||'').trim();
    if(!href||ignored.test(href))return;
    let destination;
    try{destination=new URL(href,document.baseURI)}catch{return}
    if(!/^(?:https?:|file:)$/.test(destination.protocol))return;
    // Same-document jumps do not navigate to another page.
    if(destination.origin===location.origin&&
       destination.pathname===location.pathname&&
       destination.search===location.search&&destination.hash)return;
    if(link.querySelector('.'+arrowClass))return;
    if((link.textContent||'').includes('↗'))return;

    // An older straight arrow means the same navigation; normalize it
    // in place rather than showing a duplicated arrow.
    const walker=document.createTreeWalker(link,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      if(/→\s*$/.test(node.nodeValue||'')){
        node.nodeValue=node.nodeValue.replace(/→(?=\s*$)/,'↗');
        return;
      }
    }
    const indicator=document.createElement('span');
    indicator.className=arrowClass;
    indicator.setAttribute('aria-hidden','true');
    indicator.textContent='↗';
    link.append(indicator);
  }

  function scan(root){
    if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
    if(root.nodeType===1&&root.matches(selector))update(root);
    root.querySelectorAll?.(selector).forEach(update);
  }

  scan(document);
  const observer=new MutationObserver(changes=>{
    for(const change of changes){
      if(change.type==='attributes'){
        update(change.target);
      }else{
        change.addedNodes.forEach(scan);
      }
    }
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
})();
