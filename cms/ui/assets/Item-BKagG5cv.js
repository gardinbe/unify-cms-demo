import{u as m}from"./vue.f36acd1f-CDeoN6hf.js";import{d as u,n as c,h as _,k as h,c as y,a as i,t as n,i as e,e as C,j as g,o as w,_ as I}from"./index-89_ml_O7.js";import{C as x}from"./CollectionItemContentForm-Cn6MjBLG.js";import{a as d}from"./api-DjJFujsC.js";import"./Button-Dtuy_636.js";import"./ContentForm-DNeHplsB.js";import"./capitalize-FaBkvBOh.js";const E={class:"container-fluid"},N=u({__name:"Item",async setup(k){let t,a;m({title:"Unify · Editor · Singles"});const f=g(),{name:r,id:p}=f.params;if(typeof r!="string"||typeof p!="string")throw c();const l=parseInt(p);if(isNaN(l))throw c();const o=([t,a]=_(()=>d.getCollectionSchema(r)),t=await t,a(),t),s=([t,a]=_(()=>d.getCollectionItem(r,l)),t=await t,a(),t);if(m({title:`Unify · Content · Collections · ${o.plural_display_name} · ${s.properties[o.item_display_property]}`}),s.schema!==r)throw h();return(B,S)=>(w(),y("section",E,[i("hgroup",null,[i("h1",null,n(e(s).properties[e(o).item_display_property]),1),i("p",null,"Edit the "+n(e(o).singular_display_name)+" '"+n(e(s).properties[e(o).item_display_property])+"'.",1)]),C(x,{schema:e(o),item:e(s)},null,8,["schema","item"])]))}}),A=I(N,[["__scopeId","data-v-dfdb2f8d"]]);export{A as default};
