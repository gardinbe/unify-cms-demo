import{u}from"./vue.f36acd1f-DOUuVcZI.js";import{d,h,g as o,w as l,i as f,u as S,r as g,o as a,A as k,c as y,p as w,f as C,a as n,_ as I}from"./index-BaCD--Hz.js";import{C as b}from"./ContentWithSideMenu-TGGD92My.js";import{a as v}from"./api-CModMmzX.js";import{c as x}from"./capitalize-FaBkvBOh.js";import"./index.es-SnqZ5juU.js";const A=e=>(w("data-v-aba83dcb"),e=e(),C(),e),B={key:1,class:"container-fluid"},R=A(()=>n("hgroup",null,[n("h1",null,"Single Schema Editor"),n("p",null,"Please create or select a single schema to edit.")],-1)),V=[R],$=d({__name:"Singles",async setup(e){let t,c;u({title:"Unify · Schemas · Singles"});const r=S(),m=([t,c]=h(()=>v.getAllSingleSchemas()),t=await t,c(),t).map(s=>({label:x(s.display_name),link:`${r.resolve({name:"single-schemas"}).href}/${s.name}`})),p={link:r.resolve({name:"create-single-schema"}).href};return(s,M)=>{const _=g("RouterView");return a(),o(b,{items:f(m),"create-item":p},{default:l(()=>[(a(),o(_,{key:s.$route.params.name},{default:l(({Component:i})=>[i?(a(),o(k,{key:0,component:i},null,8,["component"])):(a(),y("section",B,V))]),_:1}))]),_:1},8,["items"])}}}),j=I($,[["__scopeId","data-v-aba83dcb"]]);export{j as default};