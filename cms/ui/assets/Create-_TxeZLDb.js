import{u as l}from"./vue.f36acd1f-DOUuVcZI.js";import{d as c,n as m,h as p,c as _,a as t,t as r,i as o,e as u,j as d,o as f,_ as h}from"./index-BaCD--Hz.js";import{C}from"./CollectionItemContentForm-C0ndpRnT.js";import{a as y}from"./api-CModMmzX.js";import"./ContentForm-C0xr-_WT.js";import"./Button-BDJSJXne.js";import"./capitalize-FaBkvBOh.js";const g={class:"container-fluid"},w=c({__name:"Create",async setup(x){let a,s;const i=d(),{name:n}=i.params;if(typeof n!="string")throw m();const e=([a,s]=p(()=>y.getCollectionSchema(n)),a=await a,s(),a);return l({title:`Unify · Content · Collections · ${e.plural_display_name} · New ${e.singular_display_name}`}),(N,B)=>(f(),_("section",g,[t("hgroup",null,[t("h1",null,"New "+r(o(e).singular_display_name),1),t("p",null,"Create a new "+r(o(e).singular_display_name)+".",1)]),u(C,{schema:o(e)},null,8,["schema"])]))}}),j=h(w,[["__scopeId","data-v-a81d7bba"]]);export{j as default};
