import{u as w}from"./vue.f36acd1f-DvHtIHPY.js";import{d as g,n as v,h as p,g as i,w as u,i as n,u as x,j as B,r as I,o as s,A as R,c as $,a as l,t as _,_ as A}from"./index-B1zw4oKm.js";import{C as S}from"./ContentWithSideMenu-CmfpJvY9.js";import{a as d}from"./api-CssfyvDD.js";import{c as f}from"./capitalize-FaBkvBOh.js";import"./index.es-DFti7LE-.js";const V={key:1,class:"container-fluid"},M=g({__name:"Collection",async setup(b){let e,t;const c=x(),y=B(),{name:r}=y.params;if(typeof r!="string")throw v();const o=([e,t]=p(()=>d.getCollectionSchema(r)),e=await e,t(),e);w({title:`Unify · Content · Collections · ${o.plural_display_name}`});const h=([e,t]=p(()=>d.getCollectionItems(r)),e=await e,t(),e).map(a=>({label:f(a.properties[o.item_display_property]),link:`${c.resolve({name:"collection-content"}).href}/${a.id}`})),C={link:c.resolve({name:"create-collection-item"}).href};return(a,z)=>{const k=I("RouterView");return s(),i(S,{items:n(h),"create-item":C},{default:u(()=>[(s(),i(k,{key:a.$route.params.id},{default:u(({Component:m})=>[m?(s(),i(R,{key:0,component:m},null,8,["component"])):(s(),$("section",V,[l("hgroup",null,[l("h1",null,_(n(f)(n(o).plural_display_name)),1),l("p",null,"Please create or select a "+_(n(o).singular_display_name)+" to edit.",1)])]))]),_:1}))]),_:1},8,["items"])}}}),U=A(M,[["__scopeId","data-v-5ecde81d"]]);export{U as default};
