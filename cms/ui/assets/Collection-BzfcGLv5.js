import{u as k}from"./vue.f36acd1f-DqJv3TzP.js";import{d as w,n as g,h as p,g as i,w as u,i as n,u as v,j as x,r as B,o as s,A as I,c as R,a as l,t as _,_ as $}from"./index-Ch-kkg_L.js";import{C as A}from"./ContentWithSideMenu-DtfEaj6H.js";import{a as d}from"./api-DZsGxFFw.js";import{c as S}from"./capitalize-FaBkvBOh.js";import"./index.es-C-FG5rke.js";const V={key:1,class:"container-fluid"},M=w({__name:"Collection",async setup(b){let e,t;const c=v(),f=x(),{name:r}=f.params;if(typeof r!="string")throw g();const o=([e,t]=p(()=>d.getCollectionSchema(r)),e=await e,t(),e);k({title:`Unify · Content · Collections · ${o.plural_display_name}`});const y=([e,t]=p(()=>d.getCollectionItems(r)),e=await e,t(),e).map(a=>({label:a.properties[o.item_display_property],link:`${c.resolve({name:"collection-content"}).href}/${a.id}`})),h={link:c.resolve({name:"create-collection-item"}).href};return(a,z)=>{const C=B("RouterView");return s(),i(A,{items:n(y),"create-item":h},{default:u(()=>[(s(),i(C,{key:a.$route.params.id},{default:u(({Component:m})=>[m?(s(),i(I,{key:0,component:m},null,8,["component"])):(s(),R("section",V,[l("hgroup",null,[l("h1",null,_(n(S)(n(o).plural_display_name)),1),l("p",null,"Please create or select a "+_(n(o).singular_display_name)+" to edit.",1)])]))]),_:1}))]),_:1},8,["items"])}}}),U=$(M,[["__scopeId","data-v-c61df892"]]);export{U as default};
