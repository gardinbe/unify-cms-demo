import{u as m}from"./vue.f36acd1f-gY-k4IAX.js";import{d as u,c,e as l,w as i,u as _,r as f,o as s,g as b,A as y,p as S,f as w,a as e,b as k,_ as g}from"./index-COE1sEld.js";import{C as x}from"./ContentWithSideMenu-CFEWZ6fg.js";import"./index.es-B-U5nsY0.js";const r=t=>(S("data-v-fb7aeb55"),t=t(),w(),t),v={key:1,class:"container-fluid"},C=r(()=>e("hgroup",null,[e("h1",null,"Schema Editor"),e("p",null,"Please select either a single or collection schema to edit.")],-1)),I=r(()=>e("div",null,[e("p",{class:"secondary-text"},[e("b",null,"Schemas"),k(" define the structure of content, and what content can be created. ")]),e("p",{class:"secondary-text"}," They specify what fields should be present, along with their names, types and several other properties. They can be created and modified using the schemas editor. They're stored directly in JSON files (to allow schemas to be added to repositories). ")],-1)),T=[C,I],V=u({__name:"Schemas",setup(t){m({title:"Unify · Schemas"});const d=_(),o=a=>d.resolve({name:a}).href,h=[{label:"Singles",link:o("single-schemas")},{label:"Collections",link:o("collection-schemas")}];return(a,B)=>{const p=f("RouterView");return s(),c("main",null,[l(x,{items:h},{default:i(()=>[l(p,null,{default:i(({Component:n})=>[n?(s(),b(y,{key:0,component:n},null,8,["component"])):(s(),c("section",v,T))]),_:1})]),_:1})])}}}),H=g(V,[["__scopeId","data-v-fb7aeb55"]]);export{H as default};