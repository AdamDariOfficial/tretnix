import { isTretnixLive } from "@/features/tretnix/profile";

export type AnalyticsEventType="page_view"|"cta_click"|"email_click"|"phone_click"|"case_study_view"|"project_card_click"|"contact_form_submit";
let lastPageViewPath:string|null=null;
function deviceType():"mobile"|"tablet"|"desktop"{if(typeof window==="undefined")return"desktop";const w=window.innerWidth;return w<640?"mobile":w<1024?"tablet":"desktop";}
function referrerHost(){if(typeof document==="undefined")return null;try{const r=document.referrer;if(!r)return null;const u=new URL(r);if(u.host===window.location.host)return null;return u.host.slice(0,120);}catch{return null;}}
export function trackEvent(event_type:AnalyticsEventType,opts:{path?:string;project_slug?:string}={}){if(typeof window==="undefined"||!isTretnixLive())return;const path=(opts.path??window.location.pathname).slice(0,200);if(path.startsWith("/admin"))return;if(event_type==="page_view"){if(lastPageViewPath===path)return;lastPageViewPath=path;}try{void fetch("/api/tretnix/analytics",{method:"POST",headers:{"content-type":"application/json"},keepalive:true,body:JSON.stringify({event_type,path,project_slug:opts.project_slug??null,referrer_host:referrerHost(),device_type:deviceType(),viewport_width:window.innerWidth})});}catch{return;}}
