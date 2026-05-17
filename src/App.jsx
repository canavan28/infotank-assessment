import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  navy:'#0B1729', navyAlt:'#142239', navyEdge:'#1E2C45',
  bg:'#F4F5F7', card:'#FFFFFF', ink:'#0F172A', ink2:'#334155', muted:'#64748B',
  border:'#E5E8EE', borderStrong:'#CBD5E1',
  accent:'#2E7A8C', accentInk:'#1B5563', accentBg:'#E8F2F4', accentGlow:'#4FB3C7',
  ok:'#15803D', okBg:'#ECFDF3', okBorder:'#86EFAC',
  warn:'#B45309', warnBg:'#FFF7E6', warnBorder:'#FCD9A4',
  err:'#B91C1C', errBg:'#FEF2F2', errBorder:'#FCA5A5',
  na:'#475569', naBg:'#F1F5F9', naBorder:'#CBD5E1',
  critBg:'#FEE2E2', critInk:'#991B1B', hiBg:'#FEF3C7', hiInk:'#92400E', medBg:'#E0E7FF', medInk:'#3730A3',
};
const FONT = "'Geist','Geist Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,monospace";
const LOGO_URI = "data:image/png;base64,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";

// ─── CATALOG ─────────────────────────────────────────────────────────────────
const DEFAULT_CATALOG = [
  { id:"am1", category:"Account Management", question:"Confirm Users are in Datto SaaS", standard:"Licensing accurate; shared mailboxes backed up; no unlicensed active users.", weight:2, criticality:"High" },
  { id:"am2", category:"Account Management", question:"Are all users in Supported User group? Have terminated users been removed?", standard:"Accurate User List", weight:1, criticality:"Medium" },
  { id:"am3", category:"Account Management", question:"Are all softwares using Supported User group to update users?", standard:"Confirmed - Datto SaaS, Graphus, KB4, SaaS Alerts, Dark Web all up to date", weight:2, criticality:"High" },
  { id:"am4", category:"Account Management", question:"Date of last TBR", standard:"Date", weight:1, criticality:"Medium" },
  { id:"am5", category:"Account Management", question:"Date of next TBR", standard:"Date", weight:1, criticality:"Medium" },
  { id:"bk1", category:"Backup", question:"Check SaaS if backups were successful for last 30 days", standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight:2, criticality:"High" },
  { id:"bk2", category:"Backup", question:"Client has Onsite and Cloud backups in place (NAS, Datto) managed by us", standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight:2, criticality:"High" },
  { id:"bk3", category:"Backup", question:"Perform a successful backup test", standard:"Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.", weight:2, criticality:"Critical" },
  { id:"bk4", category:"Backup", question:"Perform a successful backup test on a user.", standard:"Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.", weight:2, criticality:"Critical" },
  { id:"ig1", category:"IT Glue", question:"365/google creds stored and updated - Test", standard:"Documentation current (≤90 days) and complete for core services.", weight:2, criticality:"High" },
  { id:"ig2", category:"IT Glue", question:"Add 3rd-party web/cloud/hosting logins/passwords to ITG", standard:"Documentation current (≤90 days) and complete for core services.", weight:2, criticality:"High" },
  { id:"ig3", category:"IT Glue", question:"Add administrative passwords for each network device to ITG", standard:"Documentation current (≤90 days) and complete for core services.", weight:2, criticality:"Critical" },
  { id:"ig4", category:"IT Glue", question:"All documents properly named for easy searching", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig5", category:"IT Glue", question:"All information about backups is in ITG", standard:"Documentation current (≤90 days) and complete for core services.", weight:2, criticality:"High" },
  { id:"ig6", category:"IT Glue", question:"All LOB applications are documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig7", category:"IT Glue", question:"All of the software licensing is documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig8", category:"IT Glue", question:"All outdated documents have been removed", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig9", category:"IT Glue", question:"All UPS devices are documented for server and network", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig10", category:"IT Glue", question:"All Vendors are documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig11", category:"IT Glue", question:"Company offboarding doc is in ITG and up to date", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig12", category:"IT Glue", question:"Company onboarding doc is in ITG and up to date", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig13", category:"IT Glue", question:"Company workstation setup doc is in ITG and up to date", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig14", category:"IT Glue", question:"Default workstation admin creds are documented", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:2, criticality:"Critical" },
  { id:"ig15", category:"IT Glue", question:"Document all network printers", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig16", category:"IT Glue", question:"Document DNS hosting login/password in ITG", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig17", category:"IT Glue", question:"Document floorplan of the office if available", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig18", category:"IT Glue", question:"Document organizational chart if available", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig19", category:"IT Glue", question:"Document the wireless network SSID/authentication", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig20", category:"IT Glue", question:"File sharing is documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig21", category:"IT Glue", question:"Fill out company home page", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig22", category:"IT Glue", question:"ISP information is documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig23", category:"IT Glue", question:"Network diagrams are documented - if complex network", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig24", category:"IT Glue", question:"Printing is documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig25", category:"IT Glue", question:"Servers are documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ig26", category:"IT Glue", question:"Voice systems are documented", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"nw1", category:"Network", question:"Is the network protected by an InfoTank-Supported Sonicwall?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw2", category:"Network", question:"Are all firewall configurations backed up?", standard:"Supported firewall; current firmware; secure remote access; rules reviewed quarterly.", weight:2, criticality:"High" },
  { id:"nw3", category:"Network", question:"Does the firewall have the latest firmware and security license enabled?", standard:"Supported firewall; current firmware; secure remote access; rules reviewed quarterly.", weight:1, criticality:"Medium" },
  { id:"nw4", category:"Network", question:"Is Sonicwall software installed and up to date?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw5", category:"Network", question:"Are network switches set to alert if something goes wrong?", standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight:1, criticality:"Medium" },
  { id:"nw6", category:"Network", question:"Are the APs Monitored?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw7", category:"Network", question:"Are the network devices all Ubiquiti? (Switches, APs)", standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight:1, criticality:"Medium" },
  { id:"nw8", category:"Network", question:"If not what are the switches", standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight:1, criticality:"Medium" },
  { id:"nw9", category:"Network", question:"If not what are the APs", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw10", category:"Network", question:"Are there strong passphrases in use for corporate wireless SSIDs?", standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight:2, criticality:"Critical" },
  { id:"nw11", category:"Network", question:"Is direct RDP to server present?", standard:"No Direct RDP allowed", weight:1, criticality:"Medium" },
  { id:"nw12", category:"Network", question:"Is network-level remote access limited to authorized staff?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw13", category:"Network", question:"Is the Guest wireless enabled and traffic is segregated?", standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight:1, criticality:"Medium" },
  { id:"nw14", category:"Network", question:"Is the wireless coverage/capacity appropriate for intended use?", standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight:1, criticality:"Medium" },
  { id:"nw15", category:"Network", question:"Is there a failover/redundant internet circuit available?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw16", category:"Network", question:"Perform failover test. Was it successful?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw17", category:"Network", question:"Is there a web content/filtering management system in place?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw18", category:"Network", question:"Is there adequate LAN capacity to support network requirements?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw19", category:"Network", question:"When was last password reset - All network equipment", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw20", category:"Network", question:"When is next password reset - All network equipment", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"pw1", category:"Passwords", question:"Archive old passwords", standard:"Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight:2, criticality:"High" },
  { id:"pw2", category:"Passwords", question:"Confirm that all admin passwords have been changed since we took over", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"ph1", category:"Physical Checks", question:"Conduct an inventory of the workstations, make sure they are labeled and named properly", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ph2", category:"Physical Checks", question:"Photos of the server/network room have been taken and uploaded to ITG", standard:"Documentation current (≤90 days) and complete for core services.", weight:1, criticality:"Medium" },
  { id:"ph3", category:"Physical Checks", question:"Confirm all of the server/network room data cabling neatly cable managed", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ph4", category:"Physical Checks", question:"Confirm that server/network room is properly cooled", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm1", category:"Power Management", question:"Check that all UPS devices functioning normally with all lights green", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm2", category:"Power Management", question:"Confirm all servers and network equipment have adequate power", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm3", category:"Power Management", question:"Confirm an automated shutdown of the servers via UPS configured", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm4", category:"Power Management", question:"Confirm the UPS systems are not overloaded", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm5", category:"Power Management", question:"Confirm the UPS systems have adequate runtime capacity", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm6", category:"Power Management", question:"Confirm UPS devices are within life expectancy", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm7", category:"Power Management", question:"Confirm all servers have UPS installed", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm8", category:"Power Management", question:"Confirm all network equipment have UPS installed", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"pm9", category:"Power Management", question:"Run a UPS test on all UPS devices to ensure functionality", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sc1", category:"Security", question:"Confirm all workstations and servers have S1 installed software", standard:"S1 deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight:2, criticality:"High" },
  { id:"sc2", category:"Security", question:"Is Entra ID enabled for all users", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:2, criticality:"High" },
  { id:"sc3", category:"Security", question:"Has company purchased vPenTest", standard:"vPenTest are purchased and on the contract", weight:2, criticality:"High" },
  { id:"sc4", category:"Security", question:"Are vPenTest on schedule and properly remediated", standard:"vPenTest deployed and scheduled each quarter with no critical alerts outstanding.", weight:2, criticality:"High" },
  { id:"sc5", category:"Security", question:"Is MFA enabled/enforced for all users", standard:"All user accounts require MFA; break-glass accounts restricted and monitored.", weight:2, criticality:"Critical" },
  { id:"sc6", category:"Security", question:"Has company purchased S1 Vigilance", standard:"S1 Vigilance was purchased and on the contract", weight:2, criticality:"High" },
  { id:"sc7", category:"Security", question:"If so, has S1 Vigilance been enabled for client", standard:"S1 Vigilance deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight:2, criticality:"High" },
  { id:"sc8", category:"Security", question:"Has company purchased SaaS Alerts", standard:"SaaS Alerts was purchased and on the contract", weight:2, criticality:"High" },
  { id:"sc9", category:"Security", question:"Are logins protected by SaaS Alerts", standard:"SaaSAlerts deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight:2, criticality:"High" },
  { id:"sv1", category:"Server", question:"Confirm Datto is configured on server to automatically deploy", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:2, criticality:"High" },
  { id:"sv2", category:"Server", question:"Are administrative account passwords set to be strong with a minimum of 12 mixed characters?", standard:"Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight:2, criticality:"Critical" },
  { id:"sv3", category:"Server", question:"Are all servers configured with static network information?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sv4", category:"Server", question:"Are all servers joined/bound to Active Directory domain?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sv5", category:"Server", question:"Are all servers under current vendor warranty?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sv6", category:"Server", question:"Are there secondary administrator accounts in place, in case of breach?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:2, criticality:"Critical" },
  { id:"sv7", category:"Server", question:"Do servers have adequate disk space on all volumes? Under 90%", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sv8", category:"Server", question:"Does adequate server performance/capacity exist?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp1", category:"Server - GPO", question:"Are group policies deployed adhere to company standard?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp2", category:"Server - GPO", question:"Are there restrictive permissions in place to prevent unauthorized access?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp3", category:"Server - GPO", question:"Do workstations/servers/network devices auto-logoff or auto-lock?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp4", category:"Server - GPO", question:"Have all domain admin passwords been reset, and are they on a reset schedule?", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"gp5", category:"Server - GPO", question:"Is the password policy configured in Active Directory?", standard:"Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight:2, criticality:"High" },
  { id:"gp6", category:"Server - GPO", question:"Is there a password required immediately after sleep or when the screen saver begins?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp7", category:"Server - GPO", question:"When is next password reset", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp8", category:"Server - GPO", question:"When was last password reset", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp9", category:"Server - GPO", question:"Do workstations require a password immediately after sleep?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"sy1", category:"Systems", question:"Have Admin accounts been limited using principle of least access for AD/EntraID", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"ws1", category:"Workstations", question:"Are all network printers configured with an accurate name/location?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ws2", category:"Workstations", question:"Are all network printers deployed automatically?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ws3", category:"Workstations", question:"Are all workstations running the same, latest Operating System?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ws4", category:"Workstations", question:"Are all workstations joined to AD/Azure?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ws5", category:"Workstations", question:"Are all workstations protected against electrical surge?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"ws6", category:"Workstations", question:"Are files automatically saved/stored on servers or OneDrive?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:2, criticality:"High" },
  { id:"ws7", category:"Workstations", question:"Are users set to not be local administrators?", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"ws8", category:"Workstations", question:"Have all local administrator passwords been reset?", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"ws9", category:"Workstations", question:"Is BitLocker configured for all laptops and code stored in Datto?", standard:"Full-disk encryption enabled and escrowed for all company endpoints/servers as applicable.", weight:2, criticality:"Critical" },
];

const DEFAULT_CLIENTS = ["AVGroup","COE","LaAmistad","Morton Construction","Phoenix","Warner Summers","Perimeter Floors","TS Adams"];
const STATUSES = ["Complete","Partial","Missing","N/A"];

// ─── SCORING ─────────────────────────────────────────────────────────────────
function scoreItem(r, weight) {
  if (!r || !r.status || r.status==="N/A") return {earned:0,possible:0};
  const p = weight*2;
  return r.status==="Complete" ? {earned:p,possible:p} : r.status==="Partial" ? {earned:weight,possible:p} : {earned:0,possible:p};
}
function calcScore(responses, catalog) {
  let e=0,p=0;
  catalog.forEach(q=>{const s=scoreItem(responses?.[q.id],q.weight);e+=s.earned;p+=s.possible;});
  const pct=p>0?Math.round((e/p)*100):0;
  let grade="F";
  if(pct>=90)grade="A";else if(pct>=80)grade="B";else if(pct>=70)grade="C";else if(pct>=60)grade="D";
  return {earned:e,possible:p,pct,grade};
}
function getPriority(q,status) {
  if(status==="Missing"&&q.criticality==="Critical")return "P1";
  if(status==="Missing")return "P2";
  if(status==="Partial")return "P3";
  return null;
}
function gradeColor(g){return g==="A"?T.ok:g==="B"?T.accent:g==="C"?T.warn:T.err;}

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function lsGet(k){try{const v=localStorage.getItem("it6_"+k);return v?JSON.parse(v):null;}catch{return null;}}
function lsSet(k,v){try{localStorage.setItem("it6_"+k,JSON.stringify(v));}catch(e){console.error(e);}}

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────
function CritBadge({kind}){
  const s=kind==="Critical"?{bg:T.critBg,fg:T.critInk}:kind==="High"?{bg:T.hiBg,fg:T.hiInk}:{bg:T.medBg,fg:T.medInk};
  return <span style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.4,textTransform:"uppercase",padding:"2px 6px",borderRadius:4,background:s.bg,color:s.fg,whiteSpace:"nowrap"}}>{kind}</span>;
}
function Eyebrow({children}){
  return <div style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.6,color:T.muted,textTransform:"uppercase",marginBottom:4}}>{children}</div>;
}
function PriorityPill({p}){
  const c=p==="P1"?T.err:p==="P2"?T.warn:T.accentInk;
  const bg=p==="P1"?T.errBg:p==="P2"?T.warnBg:T.accentBg;
  return <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:c,padding:"3px 8px",borderRadius:4,background:bg}}>{p}</span>;
}

// ─── HOOK: screen width ───────────────────────────────────────────────────────
function useIsMobile(){
  const [mobile,setMobile]=useState(()=>window.innerWidth<768);
  useEffect(()=>{
    const h=()=>setMobile(window.innerWidth<768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);
  return mobile;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("home");
  const [catalog,setCatalog]=useState(()=>lsGet("catalog")||DEFAULT_CATALOG);
  const [clients,setClients]=useState(()=>lsGet("clients")||DEFAULT_CLIENTS);
  const [assessments,setAssessments]=useState(()=>lsGet("assessments")||{});
  const [activeClient,setActiveClient]=useState(null);
  const [savedMsg,setSavedMsg]=useState("");
  const isMobile=useIsMobile();

  const persist=useCallback((cat,cli,asm)=>{
    lsSet("catalog",cat);lsSet("clients",cli);lsSet("assessments",asm);
    setSavedMsg("SAVED");setTimeout(()=>setSavedMsg(""),1800);
  },[]);

  const navItems=[
    {id:"home",  label:"Home",       icon:<HomeIcon/>},
    {id:"assess",label:"Assessment", icon:<AssessIcon/>},
    {id:"dashboard",label:"Dashboard",icon:<DashIcon/>},
    {id:"manage",label:"Questions",  icon:<QIcon/>},
    {id:"clients",label:"Clients",   icon:<ClientsIcon/>},
  ];

  return (
    <div style={{fontFamily:FONT,minHeight:"100vh",background:T.bg,color:T.ink,maxWidth:"100vw",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* TOP NAV — desktop only */}
      {!isMobile && (
        <div style={{background:T.navy,color:"#E8EDF5",borderBottom:`1px solid ${T.navyEdge}`,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,maxWidth:1400,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <img src={LOGO_URI} alt="InfoTank" style={{height:30,width:"auto",objectFit:"contain"}}/>
              <div style={{width:1,height:22,background:T.navyEdge,margin:"0 6px"}}/>
              <div style={{display:"flex",gap:2}}>
                {navItems.map(n=>{
                  const active=view===n.id;
                  return(
                    <button key={n.id} onClick={()=>setView(n.id)} style={{padding:"8px 14px",borderRadius:6,background:active?"rgba(79,179,199,0.14)":"transparent",color:active?"#fff":"#94A3B8",border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:active?600:500,position:"relative"}}>
                      {n.label}
                      {active&&<div style={{position:"absolute",left:14,right:14,bottom:-1,height:2,background:T.accentGlow}}/>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{fontFamily:MONO,fontSize:11,color:"#7B8AA3",letterSpacing:0.4}}>{savedMsg}</div>
          </div>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      {isMobile && (
        <div style={{background:T.navy,color:"#E8EDF5",position:"sticky",top:0,zIndex:100,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <img src={LOGO_URI} alt="InfoTank" style={{height:26,width:"auto",objectFit:"contain"}}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {savedMsg && <span style={{fontFamily:MONO,fontSize:10,color:T.accentGlow,letterSpacing:0.4}}>{savedMsg}</span>}
            <div style={{fontFamily:MONO,fontSize:10,color:"#7B8AA3",letterSpacing:0.3}}>SYNCED · {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{maxWidth:isMobile?"100%":1400,margin:"0 auto",padding:isMobile?"16px 0 80px":"28px 24px"}}>
        {view==="home"&&<HomeView clients={clients} assessments={assessments} catalog={catalog} isMobile={isMobile} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}}/>}
        {view==="assess"&&<AssessView clients={clients} catalog={catalog} assessments={assessments} activeClient={activeClient} setActiveClient={setActiveClient} isMobile={isMobile} onSave={asm=>{setAssessments(asm);persist(catalog,clients,asm);}}/>}
        {view==="dashboard"&&<DashboardView clients={clients} assessments={assessments} catalog={catalog} activeClient={activeClient} setActiveClient={setActiveClient} isMobile={isMobile}/>}
        {view==="manage"&&<ManageView catalog={catalog} isMobile={isMobile} onSave={c=>{setCatalog(c);persist(c,clients,assessments);}}/>}
        {view==="clients"&&<ClientsView clients={clients} assessments={assessments} catalog={catalog} isMobile={isMobile} onSave={c=>{setClients(c);persist(catalog,c,assessments);}} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}}/>}
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      {isMobile && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.navy,borderTop:`1px solid ${T.navyEdge}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {navItems.map(n=>{
            const active=view===n.id;
            return(
              <button key={n.id} onClick={()=>setView(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 4px 8px",background:"transparent",border:"none",cursor:"pointer",color:active?T.accentGlow:"#64748B"}}>
                <span style={{fontSize:20}}>{n.icon}</span>
                <span style={{fontFamily:FONT,fontSize:10,fontWeight:active?700:500,letterSpacing:0.2}}>{n.label}</span>
                {active&&<div style={{position:"absolute",top:0,left:"10%",right:"10%",height:2,background:T.accentGlow,borderRadius:1}}/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
function HomeIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;}
function AssessIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;}
function DashIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;}
function QIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;}
function ClientsIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;}

// ─── HOME VIEW ───────────────────────────────────────────────────────────────
function HomeView({clients,assessments,catalog,isMobile,onStart,onDashboard}){
  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const summaries=clients.map(c=>{
    const hist=assessments[c]||[];const last=hist[hist.length-1];
    if(!last)return{client:c,pct:null,grade:null};
    return{client:c,...calcScore(last.responses,catalog),date:last.date,assessor:last.assessor};
  });
  const assessed=summaries.filter(s=>s.pct!==null).length;
  const p1total=clients.reduce((acc,c)=>{
    const hist=assessments[c]||[];const last=hist[hist.length-1];if(!last)return acc;
    return acc+catalog.filter(q=>{const r=last.responses[q.id];return r&&r.status==="Missing"&&q.criticality==="Critical";}).length;
  },0);

  if(isMobile){
    return(
      <div style={{padding:"0 16px"}}>
        {/* Greeting */}
        <div style={{padding:"20px 0 16px"}}>
          <div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",marginBottom:4}}>{today}</div>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:26,color:T.ink,lineHeight:1.1}}>Good morning.</div>
          <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:4}}>{assessed} assessments scheduled · {assessed} in progress</div>
        </div>

        {/* In Progress Card */}
        {summaries.filter(s=>s.pct!==null).slice(0,1).map(s=>(
          <div key={s.client} style={{background:"linear-gradient(135deg,#1E3A5F,#142239)",borderRadius:14,padding:"20px 20px 16px",marginBottom:20,color:"white"}}>
            <div style={{fontFamily:MONO,fontSize:10,color:"#94A3B8",letterSpacing:0.5,marginBottom:8}}>IN PROGRESS</div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,marginBottom:4}}>{s.client}</div>
            <div style={{fontFamily:FONT,fontSize:13,color:"#94A3B8",marginBottom:16}}>Q{Math.ceil((new Date().getMonth()+1)/3)} {new Date().getFullYear()} Assessment</div>
            <div style={{height:6,background:"rgba(255,255,255,0.15)",borderRadius:999,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${s.pct}%`,background:T.accentGlow,borderRadius:999}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:MONO,fontSize:12,color:"#94A3B8"}}>{s.pct}% complete</span>
              <button onClick={()=>onStart(s.client)} style={{background:T.accentGlow,color:T.navy,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                Resume Assessment ›
              </button>
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",marginBottom:12}}>Quick Actions</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{label:"New Assessment",icon:"📋",action:()=>onStart(clients[0])},{label:"View Dashboard",icon:"📊",action:()=>onDashboard(clients[0])},{label:"Clients",icon:"👥",action:null},{label:"Questions",icon:"❓",action:null}].map(a=>(
              <button key={a.label} onClick={a.action} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 14px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:8}}>
                <span style={{fontSize:24}}>{a.icon}</span>
                <span style={{fontFamily:FONT,fontWeight:600,fontSize:13,color:T.ink}}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Client List */}
        <div>
          <div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",marginBottom:12}}>All Clients</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {summaries.map(s=>(
              <div key={s.client} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:s.grade?gradeColor(s.grade)+"22":T.bg,display:"grid",placeItems:"center",flexShrink:0}}>
                    <span style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:s.grade?gradeColor(s.grade):T.muted}}>{s.grade||"?"}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>{s.client}</div>
                    {s.pct!==null?(
                      <>
                        <div style={{height:4,background:T.bg,borderRadius:999,overflow:"hidden",margin:"6px 0 4px"}}>
                          <div style={{height:"100%",width:`${s.pct}%`,background:s.pct>=80?T.ok:s.pct>=60?T.warn:T.err,borderRadius:999}}/>
                        </div>
                        <div style={{fontFamily:MONO,fontSize:11,color:T.muted}}>{s.pct}% · {new Date(s.date).toLocaleDateString()}</div>
                      </>
                    ):(
                      <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:2}}>No assessment yet</div>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
                  <button onClick={()=>onStart(s.client)} style={{flex:1,padding:"11px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",borderBottomLeftRadius:12}}>
                    {s.pct?"New Assessment":"Start Assessment"}
                  </button>
                  {s.pct&&<button onClick={()=>onDashboard(s.client)} style={{flex:1,padding:"11px 0",background:"transparent",border:"none",borderLeft:`1px solid ${T.border}`,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderBottomRightRadius:12}}>Dashboard</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop home
  return(
    <div>
      <div style={{marginBottom:28}}>
        <Eyebrow>{today}</Eyebrow>
        <h1 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:T.ink,margin:"4px 0 6px",letterSpacing:-0.5}}>Good morning.</h1>
        <div style={{fontFamily:FONT,fontSize:14,color:T.muted}}>{assessed} of {clients.length} clients assessed · {p1total} critical findings open</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[{label:"Active Clients",value:clients.length},{label:"Assessments Done",value:assessed},{label:"Overdue Reviews",value:clients.length-assessed,warn:true},{label:"P1 Findings Open",value:p1total,err:p1total>0}].map(k=>(
          <div key={k.label} style={{background:k.err?T.errBg:k.warn&&k.value>0?T.warnBg:T.card,borderRadius:10,padding:"18px 20px",border:`1px solid ${k.err?T.errBorder:k.warn&&k.value>0?T.warnBorder:T.border}`}}>
            <Eyebrow>{k.label}</Eyebrow>
            <div style={{fontFamily:MONO,fontSize:32,fontWeight:600,color:k.err?T.err:k.warn&&k.value>0?T.warn:T.ink,letterSpacing:-1,lineHeight:1.1}}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {summaries.map(s=>(
          <div key={s.client} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"16px 18px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>{s.client}</div>
                {s.grade&&<div style={{fontFamily:FONT,fontWeight:600,fontSize:22,color:gradeColor(s.grade),letterSpacing:-1}}>{s.grade}</div>}
              </div>
              {s.pct!==null?(
                <>
                  <div style={{height:6,background:T.bg,borderRadius:999,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${s.pct}%`,background:s.pct>=80?T.ok:s.pct>=60?T.warn:T.err,borderRadius:999}}/>
                  </div>
                  <div style={{fontFamily:MONO,fontSize:12,color:T.muted}}>{s.pct}% · {s.earned}/{s.possible} pts · {new Date(s.date).toLocaleDateString()}</div>
                </>
              ):<div style={{fontFamily:FONT,fontSize:13,color:T.muted}}>No assessment yet</div>}
            </div>
            <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
              <button onClick={()=>onStart(s.client)} style={{flex:1,padding:"10px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",borderRight:`1px solid ${T.border}`,borderBottomLeftRadius:12}}>
                {s.pct?"New Assessment":"Start Assessment"}
              </button>
              {s.pct&&<button onClick={()=>onDashboard(s.client)} style={{flex:1,padding:"10px 0",background:"transparent",border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderBottomRightRadius:12}}>Dashboard</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSESS VIEW ─────────────────────────────────────────────────────────────
function AssessView({clients,catalog,assessments,activeClient,setActiveClient,isMobile,onSave}){
  const [client,setClient]=useState(activeClient||clients[0]);
  const [assessor,setAssessor]=useState("");
  const [responses,setResponses]=useState({});
  const [activeCategory,setActiveCategory]=useState("all");
  const [activeQId,setActiveQId]=useState(null);
  const [search,setSearch]=useState("");
  const [mobileDetail,setMobileDetail]=useState(false);

  const categories=[...new Set(catalog.map(q=>q.category))];

  useEffect(()=>{
    if(!client)return;
    const hist=assessments[client]||[];
    setResponses(hist.length>0?{...hist[hist.length-1].responses}:{});
    setActiveQId(catalog[0]?.id||null);
    setMobileDetail(false);
  },[client]);

  const setResp=(id,field,val)=>setResponses(r=>({...r,[id]:{...(r[id]||{}),[field]:val}}));
  const answered=Object.values(responses).filter(r=>r.status).length;
  const filteredQ=catalog.filter(q=>activeCategory==="all"||q.category===activeCategory).filter(q=>!search||q.question.toLowerCase().includes(search.toLowerCase()));
  const activeQ=catalog.find(q=>q.id===activeQId);
  const activeR=responses[activeQId]||{};

  const handleSave=()=>{
    const entry={date:new Date().toISOString(),assessor,responses};
    const hist=assessments[client]||[];
    onSave({...assessments,[client]:[...hist,entry]});
  };

  const statusColors={
    Complete:{active:{bg:T.ok,border:T.ok,text:"#fff"},inactive:{bg:T.okBg,border:T.okBorder,text:T.ok}},
    Partial: {active:{bg:T.warn,border:T.warn,text:"#fff"},inactive:{bg:T.warnBg,border:T.warnBorder,text:T.warn}},
    Missing: {active:{bg:T.err,border:T.err,text:"#fff"},inactive:{bg:T.errBg,border:T.errBorder,text:T.err}},
    "N/A":   {active:{bg:T.na,border:T.na,text:"#fff"},inactive:{bg:T.naBg,border:T.naBorder,text:T.na}},
  };

  // ── MOBILE: question list → tap → detail card
  if(isMobile){
    if(mobileDetail&&activeQ){
      return(
        <div style={{padding:"0 16px"}}>
          {/* Back bar */}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0 16px"}}>
            <button onClick={()=>setMobileDetail(false)} style={{background:"transparent",border:"none",cursor:"pointer",color:T.accent,fontFamily:FONT,fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:4,padding:0}}>
              ‹ Back
            </button>
            <div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.4}}>{answered}/{catalog.length} answered</div>
            <button onClick={handleSave} style={{marginLeft:"auto",background:T.ok,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save</button>
          </div>

          {/* Question detail */}
          <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"20px 18px",marginBottom:16}}>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
              <CritBadge kind={activeQ.criticality}/>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{activeQ.category.toUpperCase()}</span>
            </div>
            <div style={{fontFamily:FONT,fontWeight:600,fontSize:17,color:T.ink,lineHeight:1.35,marginBottom:8}}>{activeQ.question}</div>
            <div style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.5}}>{activeQ.standard}</div>
          </div>

          {/* Status buttons — 2x2 grid on mobile */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {STATUSES.map(s=>{
              const isActive=activeR.status===s;
              const sc=statusColors[s][isActive?"active":"inactive"];
              return(
                <button key={s} onClick={()=>setResp(activeQ.id,"status",isActive?null:s)} style={{padding:"18px 8px",borderRadius:12,border:`2px solid ${sc.border}`,background:sc.bg,color:sc.text,cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:15,transition:"all 0.12s"}}>
                  {s}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
            <Eyebrow>Notes</Eyebrow>
            <textarea value={activeR.notes||""} onChange={e=>setResp(activeQ.id,"notes",e.target.value)} placeholder="Add context, findings, or observations…" rows={3} style={{width:"100%",fontFamily:FONT,fontSize:14,color:T.ink,lineHeight:1.5,border:"none",outline:"none",resize:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0",marginTop:4}}/>
          </div>

          {/* Evidence */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            <Eyebrow>Evidence Link</Eyebrow>
            <input value={activeR.evidence||""} onChange={e=>setResp(activeQ.id,"evidence",e.target.value)} placeholder="https://…" style={{width:"100%",fontFamily:MONO,fontSize:13,color:T.accentInk,border:"none",outline:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0"}}/>
          </div>

          {/* Prev / Next */}
          <div style={{display:"flex",gap:10}}>
            {(()=>{
              const idx=filteredQ.findIndex(q=>q.id===activeQId);
              const prev=filteredQ[idx-1];const next=filteredQ[idx+1];
              return(<>
                <button onClick={()=>prev&&setActiveQId(prev.id)} disabled={!prev} style={{flex:1,padding:"12px 0",background:prev?T.card:"transparent",border:`1px solid ${T.border}`,borderRadius:10,cursor:prev?"pointer":"default",fontFamily:FONT,fontWeight:600,fontSize:14,color:prev?T.ink:T.muted,opacity:prev?1:0.4}}>‹ Prev</button>
                <button onClick={()=>next&&setActiveQId(next.id)} disabled={!next} style={{flex:1,padding:"12px 0",background:next?T.navy:T.card,border:`1px solid ${next?T.navy:T.border}`,borderRadius:10,cursor:next?"pointer":"default",fontFamily:FONT,fontWeight:600,fontSize:14,color:next?"#fff":T.muted,opacity:next?1:0.4}}>Next ›</button>
              </>);
            })()}
          </div>
        </div>
      );
    }

    // Mobile question list
    return(
      <div>
        {/* Header */}
        <div style={{padding:"12px 16px",background:T.card,borderBottom:`1px solid ${T.border}`,position:"sticky",top:56,zIndex:50}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{flex:1,fontFamily:FONT,fontWeight:700,fontSize:15,color:T.ink,background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer"}}>
              {clients.map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={handleSave} style={{background:T.ok,color:"#fff",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Save</button>
          </div>
          {/* Progress */}
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.4}}>SESSION PROGRESS</span>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{answered}/{catalog.length}</span>
            </div>
            <div style={{height:5,background:T.bg,borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${catalog.length>0?(answered/catalog.length)*100:0}%`,background:T.accent,borderRadius:999}}/>
            </div>
          </div>
          {/* Category scroll */}
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}>
            {["all",...categories].map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)} style={{whiteSpace:"nowrap",padding:"5px 12px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,background:activeCategory===cat?T.navy:T.bg,color:activeCategory===cat?"#fff":T.muted,flexShrink:0}}>
                {cat==="all"?"All":cat}
              </button>
            ))}
          </div>
        </div>

        {/* Question cards */}
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {filteredQ.map(q=>{
            const r=responses[q.id]||{};
            const statusColor=r.status==="Complete"?T.ok:r.status==="Partial"?T.warn:r.status==="Missing"?T.err:r.status==="N/A"?T.na:T.border;
            return(
              <div key={q.id} onClick={()=>{setActiveQId(q.id);setMobileDetail(true);}} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,borderLeft:`4px solid ${statusColor}`,padding:"14px 14px 12px",cursor:"pointer"}}>
                <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <CritBadge kind={q.criticality}/>
                    <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{q.category.split(" ")[0].toUpperCase()}</span>
                  </div>
                  {r.status&&<span style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:statusColor,padding:"2px 8px",background:statusColor+"18",borderRadius:4}}>{r.status.toUpperCase()}</span>}
                </div>
                <div style={{fontFamily:FONT,fontSize:14,color:T.ink,lineHeight:1.4,fontWeight:500}}>{q.question}</div>
                {r.notes&&<div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:6,lineHeight:1.4}}>{r.notes}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DESKTOP: 3-pane layout ──
  return(
    <div style={{display:"grid",gridTemplateColumns:"220px minmax(0,380px) 1fr",gap:0,height:"calc(100vh - 112px)",background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",minWidth:0}}>
      {/* Left sidebar */}
      <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.bg,height:"calc(100vh - 112px)",overflow:"hidden"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${T.border}`}}>
          <Eyebrow>Client</Eyebrow>
          <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{width:"100%",fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,background:"transparent",border:"none",cursor:"pointer",padding:"2px 0",outline:"none"}}>
            {clients.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <Eyebrow>Assessor</Eyebrow>
          <input value={assessor} onChange={e=>setAssessor(e.target.value)} placeholder="Your name" style={{fontFamily:FONT,fontSize:13,color:T.ink,background:"transparent",border:"none",outline:"none",width:"100%",padding:"2px 0"}}/>
        </div>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <Eyebrow>Progress</Eyebrow>
            <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{answered}/{catalog.length}</span>
          </div>
          <div style={{height:6,background:T.border,borderRadius:999,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${catalog.length>0?(answered/catalog.length)*100:0}%`,background:T.accent,borderRadius:999}}/>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
          {[{id:"all",label:"All Questions"},...categories.map(c=>({id:c,label:c}))].map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:7,border:"none",cursor:"pointer",textAlign:"left",background:activeCategory===cat.id?T.accentBg:"transparent",color:activeCategory===cat.id?T.accentInk:T.ink2}}>
              <span style={{fontFamily:FONT,fontSize:13,fontWeight:activeCategory===cat.id?600:400}}>{cat.label}</span>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{catalog.filter(q=>cat.id==="all"||q.category===cat.id).filter(q=>responses[q.id]?.status).length}/{catalog.filter(q=>cat.id==="all"||q.category===cat.id).length}</span>
            </button>
          ))}
        </div>
        <div style={{padding:12,borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
          <button onClick={handleSave} style={{flex:1,background:T.navy,color:"white",border:"none",borderRadius:8,padding:"9px 0",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save & Submit</button>
        </div>
      </div>

      {/* Middle: question list */}
      <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",height:"calc(100vh - 112px)",overflow:"hidden"}}>
        <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:T.bg,borderRadius:7,padding:"7px 10px",border:`1px solid ${T.border}`}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions…" style={{border:"none",background:"transparent",fontFamily:FONT,fontSize:13,color:T.ink,outline:"none",width:"100%"}}/>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filteredQ.map(q=>{
            const r=responses[q.id]||{};
            const isActive=activeQId===q.id;
            const statusColor=r.status==="Complete"?T.ok:r.status==="Partial"?T.warn:r.status==="Missing"?T.err:r.status==="N/A"?T.na:"transparent";
            return(
              <div key={q.id} onClick={()=>setActiveQId(q.id)} style={{display:"flex",gap:10,padding:"12px 16px 12px 13px",cursor:"pointer",borderLeft:`3px solid ${isActive?T.accent:statusColor}`,borderBottom:`1px solid ${T.border}`,background:isActive?"#fff":T.card}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}><CritBadge kind={q.criticality}/><span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{q.category.split(" ")[0].toUpperCase()}</span></div>
                  <div style={{fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{q.question}</div>
                </div>
                {r.status&&<span style={{fontFamily:MONO,fontSize:10,color:statusColor,flexShrink:0,paddingTop:2}}>{r.status[0]}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right detail */}
      <div style={{overflowY:"auto",padding:"28px 32px 60px",height:"calc(100vh - 112px)",boxSizing:"border-box"}}>
        {!activeQ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:T.muted,fontFamily:FONT}}>Select a question</div>:(
          <>
            <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
              <CritBadge kind={activeQ.criticality}/>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.3}}>{activeQ.category.toUpperCase()}</span>
            </div>
            <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:20,color:T.ink,lineHeight:1.35,marginBottom:6}}>{activeQ.question}</h2>
            <p style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.55,marginBottom:22}}>{activeQ.standard}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
              {STATUSES.map(s=>{
                const isActive=activeR.status===s;
                const sc=statusColors[s][isActive?"active":"inactive"];
                return<button key={s} onClick={()=>setResp(activeQ.id,"status",isActive?null:s)} style={{padding:"14px 6px",borderRadius:10,border:`1.5px solid ${sc.border}`,background:sc.bg,color:sc.text,cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14,transition:"all 0.1s"}}>{s}</button>;
              })}
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
              <Eyebrow>Notes</Eyebrow>
              <textarea value={activeR.notes||""} onChange={e=>setResp(activeQ.id,"notes",e.target.value)} placeholder="Add context, findings, or observations…" rows={4} style={{width:"100%",fontFamily:FONT,fontSize:13.5,color:T.ink,lineHeight:1.55,border:"none",outline:"none",resize:"vertical",background:"transparent",boxSizing:"border-box",padding:0,marginTop:4}}/>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px"}}>
              <Eyebrow>Evidence Link</Eyebrow>
              <input value={activeR.evidence||""} onChange={e=>setResp(activeQ.id,"evidence",e.target.value)} placeholder="https://…" style={{width:"100%",fontFamily:MONO,fontSize:13,color:T.accentInk,border:"none",outline:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0"}}/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function DashboardView({clients,assessments,catalog,activeClient,setActiveClient,isMobile}){
  const [client,setClient]=useState(activeClient||clients[0]);
  const hist=assessments[client]||[];
  const last=hist[hist.length-1];
  const prev=hist[hist.length-2];
  const score=last?calcScore(last.responses,catalog):null;
  const pScore=prev?calcScore(prev.responses,catalog):null;
  const categories=[...new Set(catalog.map(q=>q.category))];
  const catScores=categories.map(cat=>{
    const qs=catalog.filter(q=>q.category===cat);
    if(!last)return{cat,pct:0};
    let e=0,p=0;qs.forEach(q=>{const s=scoreItem(last.responses[q.id],q.weight);e+=s.earned;p+=s.possible;});
    return{cat,pct:p>0?Math.round((e/p)*100):0};
  }).filter(c=>{
    const qs=catalog.filter(q=>q.category===c.cat);
    return last&&qs.some(q=>last.responses[q.id]?.status&&last.responses[q.id]?.status!=="N/A");
  });
  const remItems=last?catalog.flatMap(q=>{
    const r=last.responses[q.id];
    if(!r||r.status==="Complete"||r.status==="N/A"||!r.status)return[];
    const p=getPriority(q,r.status);if(!p)return[];
    return[{...q,status:r.status,notes:r.notes,priority:p}];
  }).sort((a,b)=>a.priority.localeCompare(b.priority)):[];
  const p1=remItems.filter(i=>i.priority==="P1"),p2=remItems.filter(i=>i.priority==="P2"),p3=remItems.filter(i=>i.priority==="P3");

  const px=isMobile?"16px":"40px";

  return(
    <div style={isMobile?{padding:"0 0 20px"}:{}}>
      <div style={{display:"flex",gap:12,alignItems:"center",margin:`${isMobile?"12px":0} ${isMobile?"16px":"0"} ${isMobile?"12px":"24px"}`}}>
        <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{fontFamily:FONT,fontWeight:700,fontSize:isMobile?15:16,color:T.ink,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",flex:isMobile?1:"none"}}>
          {clients.map(c=><option key={c}>{c}</option>)}
        </select>
        {!isMobile&&<span style={{fontFamily:MONO,fontSize:11,color:T.muted,letterSpacing:0.4}}>📋 SCREENSHOT FOR POWERPOINT TBR SLIDES</span>}
      </div>

      {!last?(
        <div style={{textAlign:"center",padding:80,color:T.muted,fontFamily:FONT,fontSize:16}}>No assessment data for {client} yet.</div>
      ):(
        <div style={{background:"#fff",borderRadius:isMobile?0:14,border:isMobile?"none":`1px solid ${T.border}`,overflow:"hidden"}}>
          {/* Navy header */}
          <div style={{background:T.navy,color:"#E8EDF5",padding:`16px ${px} 20px`,borderBottom:`1px solid ${T.navyEdge}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <img src={LOGO_URI} alt="InfoTank" style={{height:28,width:"auto",objectFit:"contain"}}/>
              <div style={{fontFamily:MONO,fontSize:10,color:"#94A3B8",letterSpacing:0.4}}>MANAGED SERVICES · TBR SCORECARD</div>
            </div>
            <div style={{fontFamily:FONT,fontSize:isMobile?22:28,fontWeight:700,letterSpacing:-0.5}}>{client}</div>
            {last.assessor&&<div style={{fontFamily:FONT,fontSize:12,color:"#94A3B8",marginTop:4}}>Assessed by {last.assessor} · {new Date(last.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>}
          </div>

          <div style={{padding:`20px ${px} 32px`,background:T.bg}}>
            {/* Score + Priority */}
            <div style={{display:isMobile?"flex":"grid",flexDirection:isMobile?"column":undefined,gridTemplateColumns:isMobile?undefined:"1.1fr 2fr",gap:16,marginBottom:16}}>
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"22px 24px",display:"flex",alignItems:"center",gap:20}}>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:isMobile?90:110,lineHeight:0.9,color:T.accent,letterSpacing:-4}}>{score.grade}</div>
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span style={{fontFamily:MONO,fontSize:isMobile?40:48,fontWeight:600,color:T.ink,letterSpacing:-2,lineHeight:1}}>{score.pct}</span>
                    <span style={{fontFamily:MONO,fontSize:18,color:T.muted}}>%</span>
                  </div>
                  <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:2}}>Overall IT Maturity</div>
                  {pScore&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:10,padding:"4px 8px",borderRadius:999,background:score.pct>=pScore.pct?T.okBg:T.errBg,color:score.pct>=pScore.pct?T.ok:T.err,fontFamily:MONO,fontSize:10,fontWeight:600}}>
                    {score.pct>=pScore.pct?"▲":"▼"} {Math.abs(score.pct-pScore.pct)} PTS VS. LAST
                  </div>}
                </div>
              </div>
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
                <Eyebrow>Findings Requiring Remediation</Eyebrow>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
                  {[{p:"P1",label:"Immediate",count:p1.length,c:T.err,bg:T.errBg,border:T.errBorder},{p:"P2",label:"Near-term",count:p2.length,c:T.warn,bg:T.warnBg,border:T.warnBorder},{p:"P3",label:"Planned",count:p3.length,c:T.accentInk,bg:T.accentBg,border:"#B6D7DD"}].map(t=>(
                    <div key={t.p} style={{background:t.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${t.border}`}}>
                      <div style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:t.c,marginBottom:6}}>{t.p} · {t.label}</div>
                      <div style={{fontFamily:MONO,fontSize:32,fontWeight:600,color:t.c,letterSpacing:-1,lineHeight:1}}>{t.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category bars */}
            <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"18px 20px",marginBottom:16}}>
              <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink,marginBottom:14}}>Category Scores</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {catScores.sort((a,b)=>a.pct-b.pct).map(c=>{
                  const color=c.pct>=85?T.ok:c.pct>=70?T.warn:T.err;
                  return(
                    <div key={c.cat} style={{display:"grid",gridTemplateColumns:isMobile?"120px 1fr 44px":"180px 1fr 50px",alignItems:"center",gap:10}}>
                      <div style={{fontFamily:FONT,fontSize:isMobile?12:13,color:T.ink,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.cat}</div>
                      <div style={{height:8,background:"#EEF1F5",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${c.pct}%`,height:"100%",background:color,borderRadius:4}}/>
                      </div>
                      <div style={{fontFamily:MONO,fontSize:13,fontWeight:700,color,textAlign:"right"}}>{c.pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remediation */}
            {remItems.length>0&&(
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>Remediation Plan</div>
                  <div style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{remItems.length} ITEMS</div>
                </div>
                {isMobile?(
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {remItems.map((r,i)=>(
                      <div key={i} style={{padding:"14px 20px",borderBottom:i<remItems.length-1?`1px solid ${T.border}`:"none"}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                          <PriorityPill p={r.priority}/>
                          <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{r.category.toUpperCase()}</span>
                          <span style={{marginLeft:"auto",fontFamily:MONO,fontSize:10,fontWeight:700,color:r.status==="Missing"?T.err:T.warn}}>{r.status.toUpperCase()}</span>
                        </div>
                        <div style={{fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.4}}>{r.question}</div>
                        {r.notes&&<div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:4}}>{r.notes}</div>}
                      </div>
                    ))}
                  </div>
                ):(
                  <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
                    <thead><tr style={{background:"#FAFBFC"}}>{["Priority","Category","Finding","Status","Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 16px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                    <tbody>{remItems.map((r,i)=>(
                      <tr key={i} style={{borderBottom:i<remItems.length-1?`1px solid ${T.border}`:"none"}}>
                        <td style={{padding:"12px 16px"}}><PriorityPill p={r.priority}/></td>
                        <td style={{padding:"12px 16px",color:T.ink2,whiteSpace:"nowrap"}}>{r.category}</td>
                        <td style={{padding:"12px 16px",color:T.ink,maxWidth:300}}>{r.question}</td>
                        <td style={{padding:"12px 16px"}}><span style={{fontFamily:MONO,fontSize:11,fontWeight:600,color:r.status==="Missing"?T.err:T.warn}}>{r.status}</span></td>
                        <td style={{padding:"12px 16px",color:T.muted,fontSize:12,maxWidth:200}}>{r.notes||"—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 20px",borderTop:`1px solid ${T.border}`,fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.4}}>
                  <span>INFOTANK · TECHNOLOGY BUSINESS REVIEW · CONFIDENTIAL</span>
                  <span>PAGE 1 / 1</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MANAGE VIEW ─────────────────────────────────────────────────────────────
function ManageView({catalog,isMobile,onSave}){
  const [items,setItems]=useState(catalog);
  const [editId,setEditId]=useState(null);
  const [filter,setFilter]=useState("All");
  const [dirty,setDirty]=useState(false);
  const [adding,setAdding]=useState(false);
  const [newQ,setNewQ]=useState({category:"",question:"",standard:"",weight:1,criticality:"Medium"});
  const categories=[...new Set(items.map(q=>q.category))];
  const update=(id,f,v)=>{setItems(p=>p.map(q=>q.id===id?{...q,[f]:v}:q));setDirty(true);};
  const remove=id=>{setItems(p=>p.filter(q=>q.id!==id));setDirty(true);};
  const addQ=()=>{if(!newQ.category||!newQ.question)return;setItems(p=>[...p,{...newQ,id:"custom_"+Date.now(),weight:Number(newQ.weight)}]);setNewQ({category:"",question:"",standard:"",weight:1,criticality:"Medium"});setAdding(false);setDirty(true);};
  const filtered=items.filter(q=>filter==="All"||q.category===filter);
  const pad=isMobile?"16px":"0";

  return(
    <div style={{padding:`0 ${pad}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>Question Library</div>
          <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:2}}>{items.length} controls</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setAdding(true)} style={{background:T.navy,color:"white",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>+ Add</button>
          {dirty&&<button onClick={()=>{onSave(items);setDirty(false);}} style={{background:T.ok,color:"white",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save</button>}
        </div>
      </div>
      {adding&&(
        <div style={{background:T.accentBg,borderRadius:12,padding:16,marginBottom:16,border:`1px solid #B6D7DD`}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input placeholder="Category" value={newQ.category} onChange={e=>setNewQ({...newQ,category:e.target.value})} list="cat-list" style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <datalist id="cat-list">{categories.map(c=><option key={c} value={c}/>)}</datalist>
            <input placeholder="Question text" value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <input placeholder="Expected standard" value={newQ.standard} onChange={e=>setNewQ({...newQ,standard:e.target.value})} style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <div style={{display:"flex",gap:8}}>
              <select value={newQ.weight} onChange={e=>setNewQ({...newQ,weight:e.target.value})} style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}><option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option></select>
              <select value={newQ.criticality} onChange={e=>setNewQ({...newQ,criticality:e.target.value})} style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}><option>Medium</option><option>High</option><option>Critical</option></select>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addQ} style={{flex:1,background:T.navy,color:"white",border:"none",borderRadius:8,padding:"10px 0",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14}}>Add Question</button>
              <button onClick={()=>setAdding(false)} style={{flex:1,background:"white",color:T.muted,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 0",cursor:"pointer",fontFamily:FONT,fontSize:14}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"nowrap",overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
        {["All",...categories].map(cat=>(
          <button key={cat} onClick={()=>setFilter(cat)} style={{background:filter===cat?T.navy:T.card,color:filter===cat?"#fff":T.ink2,border:`1px solid ${filter===cat?T.navy:T.border}`,borderRadius:999,padding:"5px 14px",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{cat}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(q=>(
          <div key={q.id} style={{background:T.card,borderRadius:10,padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
            {editId===q.id?(
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                <input value={q.question} onChange={e=>update(q.id,"question",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",fontSize:14,fontFamily:FONT,fontWeight:600}}/>
                <input value={q.standard} onChange={e=>update(q.id,"standard",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 10px",fontSize:13,fontFamily:FONT}}/>
                <div style={{display:"flex",gap:8}}>
                  <select value={q.weight} onChange={e=>update(q.id,"weight",Number(e.target.value))} style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:FONT}}><option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option></select>
                  <select value={q.criticality} onChange={e=>update(q.id,"criticality",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:FONT}}><option>Medium</option><option>High</option><option>Critical</option></select>
                  <button onClick={()=>setEditId(null)} style={{background:T.navy,color:"white",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:FONT,fontWeight:600}}>Done</button>
                </div>
              </div>
            ):(
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}><CritBadge kind={q.criticality}/><span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>Wt {q.weight} · {q.category}</span></div>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink}}>{q.question}</div>
              </div>
            )}
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={()=>setEditId(editId===q.id?null:q.id)} style={{background:T.bg,color:T.muted,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:12}}>✏️</button>
              <button onClick={()=>remove(q.id)} style={{background:T.errBg,color:T.err,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENTS VIEW ─────────────────────────────────────────────────────────────
function ClientsView({clients,assessments,catalog,isMobile,onSave,onStart,onDashboard}){
  const [items,setItems]=useState(clients);
  const [newC,setNewC]=useState("");
  const [dirty,setDirty]=useState(false);
  const summaries=items.map(c=>{const hist=assessments[c]||[];const last=hist[hist.length-1];if(!last)return{client:c,pct:null,grade:null};return{client:c,...calcScore(last.responses,catalog),date:last.date};});
  const add=()=>{if(newC.trim()&&!items.includes(newC.trim())){setItems(p=>[...p,newC.trim()]);setNewC("");setDirty(true);}};
  const pad=isMobile?"16px":"0";

  return(
    <div style={{padding:`0 ${pad}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0",flexWrap:"wrap",gap:10}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>{items.length} Clients</div>
        <div style={{display:"flex",gap:8}}>
          {dirty&&<button onClick={()=>{onSave(items);setDirty(false);}} style={{background:T.ok,color:"white",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save</button>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={newC} onChange={e=>setNewC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Add new client…" style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,fontFamily:FONT}}/>
        <button onClick={add} style={{background:T.navy,color:"white",border:"none",borderRadius:8,padding:"10px 18px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14}}>Add</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {summaries.map(s=>(
          <div key={s.client} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:s.grade?gradeColor(s.grade)+"22":T.bg,display:"grid",placeItems:"center",flexShrink:0}}>
                <span style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:s.grade?gradeColor(s.grade):T.muted}}>{s.grade||"?"}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>{s.client}</div>
                <div style={{fontFamily:MONO,fontSize:11,color:T.muted,marginTop:2}}>
                  {s.pct!==null?`${s.pct}% · Last assessed ${new Date(s.date).toLocaleDateString()}`:"No assessment yet"}
                </div>
              </div>
              <button onClick={()=>{setItems(p=>p.filter(x=>x!==s.client));setDirty(true);}} style={{background:T.errBg,color:T.err,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:12,fontFamily:FONT,fontWeight:600,flexShrink:0}}>Remove</button>
            </div>
            <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
              <button onClick={()=>onStart(s.client)} style={{flex:1,padding:"10px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",borderBottomLeftRadius:12}}>Assess</button>
              {s.pct&&<button onClick={()=>onDashboard(s.client)} style={{flex:1,padding:"10px 0",background:"transparent",border:"none",borderLeft:`1px solid ${T.border}`,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderBottomRightRadius:12}}>Dashboard</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
