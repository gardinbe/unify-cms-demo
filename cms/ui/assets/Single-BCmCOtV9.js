import{u as c}from"./vue.f36acd1f-BSMnBShJ.js";import{d as m,n as l,h as p,c as _,a as s,t as i,i as t,e as u,j as f,o as d,_ as h}from"./index-pNKClL6v.js";import{a as g}from"./api-Dn1OY6V2.js";import{c as S}from"./capitalize-FaBkvBOh.js";import{S as y}from"./SingleSchemaForm-CaUW8W9w.js";import"./SchemaForm-lwFQKWF0.js";import"./index.es-DTFtQfw9.js";import"./Button-BPi03kNl.js";const x={class:"container-fluid"},w=m({__name:"Single",async setup(B){let e,o;const r=f(),{name:n}=r.params;if(typeof n!="string")throw l();const a=([e,o]=p(()=>g.getSingleSchema(n)),e=await e,o(),e);return c({title:`Unify · Schemas · Singles · ${a.display_name}`}),(k,C)=>(d(),_("section",x,[s("hgroup",null,[s("h1",null,i(t(S)(t(a).display_name)),1),s("p",null,"Edit the '"+i(t(a).display_name)+"' single schema.",1)]),u(y,{schema:t(a)},null,8,["schema"])]))}}),A=h(w,[["__scopeId","data-v-3b2f4a3f"]]);export{A as default};
