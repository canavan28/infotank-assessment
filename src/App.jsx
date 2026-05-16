import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS (from Claude Design handoff) ──────────────────────────────
const T = {
  navy:        '#0B1729',
  navyAlt:     '#142239',
  navyEdge:    '#1E2C45',
  bg:          '#F4F5F7',
  card:        '#FFFFFF',
  ink:         '#0F172A',
  ink2:        '#334155',
  muted:       '#64748B',
  border:      '#E5E8EE',
  borderStrong:'#CBD5E1',
  accent:      '#2E7A8C',
  accentInk:   '#1B5563',
  accentBg:    '#E8F2F4',
  accentGlow:  '#4FB3C7',
  ok:    '#15803D', okBg:    '#ECFDF3', okBorder:    '#86EFAC',
  warn:  '#B45309', warnBg:  '#FFF7E6', warnBorder:  '#FCD9A4',
  err:   '#B91C1C', errBg:   '#FEF2F2', errBorder:   '#FCA5A5',
  na:    '#475569', naBg:    '#F1F5F9', naBorder:    '#CBD5E1',
  critBg:'#FEE2E2', critInk: '#991B1B',
  hiBg:  '#FEF3C7', hiInk:   '#92400E',
  medBg: '#E0E7FF', medInk:  '#3730A3',
};
const FONT = "'Geist','Geist Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,monospace";
const LOGO_URI = "data:image/png;base64,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";

// ─── QUESTION CATALOG ────────────────────────────────────────────────────────
const DEFAULT_CATALOG = [
  { id:"am1", category:"Account Management", question:"Confirm Users are in Datto SaaS", standard:"Licensing accurate; shared mailboxes backed up; no unlicensed active users.", weight:2, criticality:"High" },
  { id:"am2", category:"Account Management", question:"Are all users in Supported User group? Have terminated users been removed?", standard:"Accurate User List", weight:1, criticality:"Medium" },
  { id:"am3", category:"Account Management", question:"Are all softwares using Supported User group to update users?", standard:"Confirmed - Datto SaaS, Graphus, KB4, SaaS Alerts, Dark Web all up to date", weight:2, criticality:"High" },
  { id:"am4", category:"Account Management", question:"Date of last TBR", standard:"Date", weight:1, criticality:"Medium" },
  { id:"am5", category:"Account Management", question:"Date of next TBR", standard:"Date", weight:1, criticality:"Medium" },
  { id:"bk1", category:"Backup", question:"Check SaaS if backups were successful for last 30 days, if not investigate why and resolve so future backups are correct", standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight:2, criticality:"High" },
  { id:"bk2", category:"Backup", question:"Client has Onsite and Cloud backups in place (NAS, Datto) managed by us - If they have an onsite server", standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight:2, criticality:"High" },
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
  { id:"nw15", category:"Network", question:"Is there a failover/redundant internet circuit available in case of primary ISP failure?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw16", category:"Network", question:"Perform failover test. Was it successful?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
  { id:"nw17", category:"Network", question:"Is there a web content/filtering management system in place, and is it managed and configured?", standard:"Network gear supported/updated; configs backed up; changes documented.", weight:1, criticality:"Medium" },
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
  { id:"gp2", category:"Server - GPO", question:"Are there restrictive permissions in place to prevent unauthorized access to files/folders?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp3", category:"Server - GPO", question:"Do workstations/servers/network devices auto-logoff or auto-lock with certain conditions?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp4", category:"Server - GPO", question:"Have all domain admin passwords been reset, and are they on a reset schedule?", standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.", weight:2, criticality:"Critical" },
  { id:"gp5", category:"Server - GPO", question:"Is the password policy configured in Active Directory?", standard:"Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight:2, criticality:"High" },
  { id:"gp6", category:"Server - GPO", question:"Is there a password required immediately after sleep or when the screen saver begins?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp7", category:"Server - GPO", question:"When is next password reset", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp8", category:"Server - GPO", question:"When was last password reset", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
  { id:"gp9", category:"Server - GPO", question:"Do workstations require a password immediately after sleep, or when the screen saver begins?", standard:"Meets InfoTank standard; exceptions documented with remediation plan.", weight:1, criticality:"Medium" },
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
const STATUS_KEY = { Complete:"complete", Partial:"partial", Missing:"missing", "N/A":"na" };
const KEY_STATUS = { complete:"Complete", partial:"Partial", missing:"Missing", na:"N/A" };

// ─── SCORING ─────────────────────────────────────────────────────────────────
function scoreItem(r, weight) {
  if (!r || r.status === "N/A" || !r.status) return { earned:0, possible:0 };
  const possible = weight * 2;
  if (r.status === "Complete") return { earned:possible, possible };
  if (r.status === "Partial")  return { earned:weight,   possible };
  return { earned:0, possible };
}
function calcScore(responses, catalog) {
  let earned = 0, possible = 0;
  catalog.forEach(q => { const s = scoreItem(responses[q.id], q.weight); earned += s.earned; possible += s.possible; });
  const pct = possible > 0 ? Math.round((earned/possible)*100) : 0;
  let grade = "F";
  if (pct >= 90) grade = "A"; else if (pct >= 80) grade = "B"; else if (pct >= 70) grade = "C"; else if (pct >= 60) grade = "D";
  return { earned, possible, pct, grade };
}
function getPriority(q, status) {
  if (status === "Missing" && q.criticality === "Critical") return "P1";
  if (status === "Missing") return "P2";
  if (status === "Partial") return "P3";
  return null;
}
function gradeColor(g) {
  return g === "A" ? T.ok : g === "B" ? "#2E7A8C" : g === "C" ? T.warn : T.err;
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function lsGet(key) { try { const v = localStorage.getItem("infotank_"+key); return v ? JSON.parse(v) : null; } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem("infotank_"+key, JSON.stringify(val)); } catch(e) { console.error(e); } }

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────
function CritBadge({ kind }) {
  const s = kind === "Critical" ? {bg:T.critBg,fg:T.critInk} : kind === "High" ? {bg:T.hiBg,fg:T.hiInk} : {bg:T.medBg,fg:T.medInk};
  return <span style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.4,textTransform:"uppercase",padding:"3px 7px",borderRadius:4,background:s.bg,color:s.fg}}>{kind}</span>;
}
function StatusDot({ status }) {
  const k = STATUS_KEY[status] || null;
  const color = k === "complete" ? T.ok : k === "partial" ? T.warn : k === "missing" ? T.err : k === "na" ? T.na : T.borderStrong;
  return <span style={{width:10,height:10,borderRadius:"50%",background:k ? color:"transparent",border:k ? "none":`1.5px solid ${T.borderStrong}`,display:"inline-block",flexShrink:0}} />;
}
function PriorityPill({ p }) {
  const color = p==="P1" ? T.err : p==="P2" ? T.warn : T.accentInk;
  const bg    = p==="P1" ? T.errBg : p==="P2" ? T.warnBg : T.accentBg;
  return <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color,padding:"4px 10px",borderRadius:4,background:bg,letterSpacing:0.5,display:"inline-block"}}>{p}</span>;
}
function Btn({ children, onClick, variant="ghost", style={} }) {
  const base = {fontFamily:FONT,fontSize:13,fontWeight:600,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",transition:"all 0.12s",...style};
  const v = variant === "primary" ? {background:T.navy,color:"#E8EDF5"} : variant === "accent" ? {background:T.accent,color:"#fff"} : {background:"transparent",color:T.muted,border:`1px solid ${T.border}`};
  return <button onClick={onClick} style={{...base,...v}}>{children}</button>;
}
function Eyebrow({ children }) {
  return <div style={{fontFamily:MONO,fontSize:10.5,fontWeight:600,letterSpacing:0.5,color:T.muted,textTransform:"uppercase",marginBottom:4}}>{children}</div>;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [catalog, setCatalog] = useState(() => lsGet("catalog") || DEFAULT_CATALOG);
  const [clients, setClients] = useState(() => lsGet("clients") || DEFAULT_CLIENTS);
  const [assessments, setAssessments] = useState(() => lsGet("assessments") || {});
  const [activeClient, setActiveClient] = useState(null);
  const [saveLabel, setSaveLabel] = useState("");

  const persist = useCallback((cat, cli, asm) => {
    lsSet("catalog", cat); lsSet("clients", cli); lsSet("assessments", asm);
    setSaveLabel("AUTOSAVED"); setTimeout(() => setSaveLabel(""), 2000);
  }, []);

  const navItems = [
    {id:"home",label:"Home"},{id:"assess",label:"Assessment"},{id:"dashboard",label:"Dashboard"},{id:"manage",label:"Questions"},{id:"clients",label:"Clients"},
  ];

  return (
    <div style={{fontFamily:FONT,minHeight:"100vh",background:T.bg,color:T.ink}}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Top Nav */}
      <div style={{background:T.navy,color:"#E8EDF5",borderBottom:`1px solid ${T.navyEdge}`,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,maxWidth:1400,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src={LOGO_URI} alt="InfoTank" style={{height:32,width:"auto",objectFit:"contain"}} />
            </div>
            <div style={{width:1,height:22,background:T.navyEdge,margin:"0 6px"}}/>
            <div style={{display:"flex",gap:2}}>
              {navItems.map(n => {
                const active = view === n.id;
                return (
                  <button key={n.id} onClick={() => setView(n.id)} style={{padding:"8px 14px",borderRadius:6,background:active?"rgba(79,179,199,0.14)":"transparent",color:active?"#FFFFFF":"#94A3B8",border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:active?600:500,position:"relative"}}>
                    {n.label}
                    {active && <div style={{position:"absolute",left:14,right:14,bottom:-1,height:2,background:T.accentGlow}}/>}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{fontFamily:MONO,fontSize:11,color:"#7B8AA3",letterSpacing:0.4}}>{saveLabel}</div>
        </div>
      </div>

      {/* Views */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px 24px"}}>
        {view==="home"     && <HomeView     clients={clients} assessments={assessments} catalog={catalog} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}} />}
        {view==="assess"   && <AssessView   clients={clients} catalog={catalog} assessments={assessments} activeClient={activeClient} setActiveClient={setActiveClient} onSave={asm=>{setAssessments(asm);persist(catalog,clients,asm);}} />}
        {view==="dashboard"&& <DashboardView clients={clients} assessments={assessments} catalog={catalog} activeClient={activeClient} setActiveClient={setActiveClient} />}
        {view==="manage"   && <ManageView   catalog={catalog} onSave={c=>{setCatalog(c);persist(c,clients,assessments);}} />}
        {view==="clients"  && <ClientsView  clients={clients} assessments={assessments} catalog={catalog} onSave={c=>{setClients(c);persist(catalog,c,assessments);}} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}} />}
      </div>
    </div>
  );
}

// ─── HOME VIEW ───────────────────────────────────────────────────────────────
function HomeView({ clients, assessments, catalog, onStart, onDashboard }) {
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const summaries = clients.map(c => {
    const hist = assessments[c] || [];
    const last = hist[hist.length-1];
    if (!last) return {client:c,pct:null,grade:null};
    return {client:c, ...calcScore(last.responses,catalog), date:last.date, assessor:last.assessor};
  });
  const assessed = summaries.filter(s => s.pct !== null);
  const overdue = summaries.filter(s => !s.pct);
  const p1total = clients.reduce((acc,c) => {
    const hist = assessments[c]||[]; const last = hist[hist.length-1]; if(!last) return acc;
    return acc + catalog.filter(q => { const r=last.responses[q.id]; return r && r.status==="Missing" && q.criticality==="Critical"; }).length;
  },0);

  return (
    <div>
      <div style={{marginBottom:28}}>
        <Eyebrow>{today}</Eyebrow>
        <h1 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:T.ink,margin:"4px 0 6px",letterSpacing:-0.5}}>Good morning.</h1>
        <div style={{fontFamily:FONT,fontSize:14,color:T.muted}}>{assessed.length} of {clients.length} clients assessed · {p1total} critical findings open</div>
      </div>

      {/* KPI strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[
          {label:"Active Clients",   value:clients.length,                  tint:false},
          {label:"Assessments Done", value:assessed.length,                 tint:false},
          {label:"Overdue Reviews",  value:overdue.length,  warn:true},
          {label:"P1 Findings Open", value:p1total,         err:p1total>0},
        ].map(k => (
          <div key={k.label} style={{background:k.err?T.errBg:k.warn&&k.value>0?T.warnBg:T.card,borderRadius:10,padding:"18px 20px",border:`1px solid ${k.err?T.errBorder:k.warn&&k.value>0?T.warnBorder:T.border}`}}>
            <Eyebrow>{k.label}</Eyebrow>
            <div style={{fontFamily:MONO,fontSize:32,fontWeight:600,color:k.err?T.err:k.warn&&k.value>0?T.warn:T.ink,letterSpacing:-1,lineHeight:1.1}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Client grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {summaries.map(s => (
          <div key={s.client} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"16px 18px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>{s.client}</div>
                {s.grade && <div style={{fontFamily:FONT,fontWeight:600,fontSize:22,color:gradeColor(s.grade),letterSpacing:-1}}>{s.grade}</div>}
              </div>
              {s.pct !== null ? (
                <>
                  <div style={{height:6,background:T.bg,borderRadius:999,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${s.pct}%`,background:s.pct>=80?T.ok:s.pct>=60?T.warn:T.err,borderRadius:999}}/>
                  </div>
                  <div style={{fontFamily:MONO,fontSize:12,color:T.muted}}>{s.pct}% · {s.earned}/{s.possible} pts · {new Date(s.date).toLocaleDateString()}</div>
                </>
              ) : (
                <div style={{fontFamily:FONT,fontSize:13,color:T.muted}}>No assessment yet</div>
              )}
            </div>
            <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
              <button onClick={() => onStart(s.client)} style={{flex:1,padding:"10px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:"#fff",borderRight:`1px solid ${T.border}`,borderBottomLeftRadius:12}}>
                {s.pct ? "New Assessment" : "Start Assessment"}
              </button>
              {s.pct && <button onClick={() => onDashboard(s.client)} style={{flex:1,padding:"10px 0",background:"transparent",border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderBottomRightRadius:12}}>Dashboard</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSESS VIEW (3-pane desktop) ────────────────────────────────────────────
function AssessView({ clients, catalog, assessments, activeClient, setActiveClient, onSave }) {
  const [client, setClient] = useState(activeClient || clients[0]);
  const [assessor, setAssessor] = useState("");
  const [responses, setResponses] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeQId, setActiveQId] = useState(null);
  const [search, setSearch] = useState("");

  const categories = [...new Set(catalog.map(q => q.category))];

  useEffect(() => {
    if (!client) return;
    const hist = assessments[client] || [];
    setResponses(hist.length > 0 ? { ...hist[hist.length-1].responses } : {});
    setActiveQId(catalog[0]?.id || null);
  }, [client]);

  const setResp = (id, field, val) => setResponses(r => ({...r,[id]:{...(r[id]||{}),[field]:val}}));

  const filteredQ = catalog
    .filter(q => activeCategory === "all" || q.category === activeCategory)
    .filter(q => !search || q.question.toLowerCase().includes(search.toLowerCase()));

  const activeQ = catalog.find(q => q.id === activeQId);
  const activeR = responses[activeQId] || {};

  const answered = Object.values(responses).filter(r => r.status).length;
  const catCounts = categories.reduce((acc, cat) => {
    const qs = catalog.filter(q => q.category === cat);
    const done = qs.filter(q => responses[q.id]?.status).length;
    acc[cat] = {done, total:qs.length};
    return acc;
  },{});

  const handleSave = () => {
    const entry = {date:new Date().toISOString(), assessor, responses};
    const hist = assessments[client] || [];
    onSave({...assessments,[client]:[...hist,entry]});
  };

  const statusStyle = (s, active) => {
    const k = STATUS_KEY[s];
    const colors = {complete:{bg:T.ok,border:T.ok,text:"#fff"}, partial:{bg:T.warn,border:T.warn,text:"#fff"}, missing:{bg:T.err,border:T.err,text:"#fff"}, na:{bg:T.na,border:T.na,text:"#fff"}};
    const inactive = {complete:{bg:"#fff",border:T.okBorder,text:T.ok}, partial:{bg:"#fff",border:T.warnBorder,text:T.warn}, missing:{bg:"#fff",border:T.errBorder,text:T.err}, na:{bg:"#fff",border:T.naBorder,text:T.na}};
    return active ? colors[k] : inactive[k];
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"220px minmax(0,380px) 1fr",gap:0,height:"calc(100vh - 112px)",background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",minWidth:0}}>

      {/* LEFT SIDEBAR */}
      <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.bg}}>
        {/* Client */}
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${T.border}`}}>
          <Eyebrow>Client</Eyebrow>
          <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}}
            style={{width:"100%",fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,background:"transparent",border:"none",cursor:"pointer",padding:"2px 0",outline:"none"}}>
            {clients.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Assessor */}
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <Eyebrow>Assessor</Eyebrow>
          <input value={assessor} onChange={e=>setAssessor(e.target.value)} placeholder="Your name"
            style={{fontFamily:FONT,fontSize:13,color:T.ink,background:"transparent",border:"none",outline:"none",width:"100%",padding:"2px 0"}}/>
        </div>
        {/* Progress */}
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <Eyebrow>Session Progress</Eyebrow>
            <span style={{fontFamily:MONO,fontSize:10.5,color:T.muted}}>{answered}/{catalog.length}</span>
          </div>
          <div style={{height:6,background:T.border,borderRadius:999,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${catalog.length>0?(answered/catalog.length)*100:0}%`,background:T.accent,borderRadius:999,transition:"width 0.3s"}}/>
          </div>
        </div>
        {/* Categories */}
        <div style={{flex:1,overflowY:"auto",padding:"8px 8px"}}>
          <Eyebrow style={{padding:"4px 8px"}}>Categories</Eyebrow>
          {[{id:"all",label:"All Questions",done:answered,total:catalog.length},...categories.map(c=>({id:c,label:c,...catCounts[c]}))].map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} style={{
              width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"7px 10px",borderRadius:7,border:"none",cursor:"pointer",textAlign:"left",
              background:activeCategory===cat.id?T.accentBg:"transparent",
              color:activeCategory===cat.id?T.accentInk:T.ink2,
            }}>
              <span style={{fontFamily:FONT,fontSize:13,fontWeight:activeCategory===cat.id?600:400}}>{cat.label}</span>
              <span style={{fontFamily:MONO,fontSize:11,color:T.muted}}>{cat.done}/{cat.total}</span>
            </button>
          ))}
        </div>
        {/* Footer actions */}
        <div style={{padding:12,borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
          <Btn onClick={handleSave} variant="ghost" style={{flex:1,fontSize:12}}>Save Draft</Btn>
          <Btn onClick={handleSave} variant="primary" style={{flex:1,fontSize:12}}>Submit Review</Btn>
        </div>
      </div>

      {/* MIDDLE: Question List */}
      <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink,marginBottom:2}}>
            {new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"})} Assessment
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:6,background:T.bg,borderRadius:7,padding:"6px 10px",border:`1px solid ${T.border}`}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                style={{border:"none",background:"transparent",fontFamily:FONT,fontSize:13,color:T.ink,outline:"none",width:"100%"}}/>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filteredQ.map(q => {
            const r = responses[q.id] || {};
            const isActive = activeQId === q.id;
            const k = STATUS_KEY[r.status] || null;
            const railColor = isActive ? T.accent : k==="complete"?T.ok:k==="partial"?T.warn:k==="missing"?T.err:k==="na"?T.na:"transparent";
            return (
              <div key={q.id} onClick={()=>setActiveQId(q.id)} style={{
                display:"flex",gap:10,padding:"12px 16px 12px 13px",cursor:"pointer",
                borderLeft:`3px solid ${railColor}`,borderBottom:`1px solid ${T.border}`,
                background:isActive?"#fff":T.card,transition:"background 0.1s",
              }}>
                <div style={{paddingTop:3,flexShrink:0}}><StatusDot status={r.status}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
                    <CritBadge kind={q.criticality}/>
                    <span style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.3}}>{q.id.toUpperCase()} · {q.category.split(" ")[0].toUpperCase()}</span>
                  </div>
                  <div style={{fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{q.question}</div>
                  {(r.notes || r.evidence) && (
                    <div style={{display:"flex",gap:8,marginTop:4}}>
                      {r.notes    && <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>NOTES</span>}
                      {r.evidence && <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>EVIDENCE</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT DETAIL PANE */}
      <div style={{overflowY:"auto",padding:"28px 36px 60px"}}>
        {!activeQ ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:T.muted,fontFamily:FONT}}>Select a question to begin</div>
        ) : (
          <>
            {/* Eyebrow */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontFamily:MONO,fontSize:11,color:T.muted,letterSpacing:0.3}}>{activeQ.id.toUpperCase()} · {activeQ.category.toUpperCase()}</span>
                <CritBadge kind={activeQ.criticality}/>
              </div>
              {activeR.status && (
                <span style={{fontFamily:MONO,fontSize:11,fontWeight:600,letterSpacing:0.4,textTransform:"uppercase",padding:"3px 10px",borderRadius:999,
                  background:STATUS_KEY[activeR.status]==="complete"?T.okBg:STATUS_KEY[activeR.status]==="partial"?T.warnBg:STATUS_KEY[activeR.status]==="missing"?T.errBg:T.naBg,
                  color:STATUS_KEY[activeR.status]==="complete"?T.ok:STATUS_KEY[activeR.status]==="partial"?T.warn:STATUS_KEY[activeR.status]==="missing"?T.err:T.na,
                }}>{activeR.status}</span>
              )}
            </div>
            {/* Question */}
            <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:22,color:T.ink,lineHeight:1.3,marginBottom:6}}>{activeQ.question}</h2>
            <p style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.55,marginBottom:24}}>{activeQ.standard}</p>

            {/* Status buttons */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:10,marginBottom:24}}>
              {STATUSES.map(s => {
                const k = STATUS_KEY[s];
                const active = activeR.status === s;
                const sc = statusStyle(s, active);
                return (
                  <button key={s} onClick={()=>setResp(activeQ.id,"status", active ? null : s)} style={{
                    padding:"16px 8px",borderRadius:10,border:`1.5px solid ${sc.border}`,
                    background:sc.bg,color:sc.text,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:14,
                    display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all 0.12s",
                  }}>
                    {s}
                    <span style={{fontFamily:MONO,fontSize:10,opacity:0.65}}>{s[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Notes */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <Eyebrow>Notes</Eyebrow>
              <textarea value={activeR.notes||""} onChange={e=>setResp(activeQ.id,"notes",e.target.value)}
                placeholder="Add context, findings, or observations…"
                rows={4} style={{width:"100%",fontFamily:FONT,fontSize:13.5,color:T.ink,lineHeight:1.55,border:"none",outline:"none",resize:"vertical",background:"transparent",boxSizing:"border-box",padding:0,marginTop:4}}/>
            </div>
            {/* Evidence */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px"}}>
              <Eyebrow>Evidence Link</Eyebrow>
              <input value={activeR.evidence||""} onChange={e=>setResp(activeQ.id,"evidence",e.target.value)}
                placeholder="https://…" style={{width:"100%",fontFamily:MONO,fontSize:13,color:T.accentInk,border:"none",outline:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0"}}/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function DashboardView({ clients, assessments, catalog, activeClient, setActiveClient }) {
  const [client, setClient] = useState(activeClient || clients[0]);
  const hist = assessments[client] || [];
  const last = hist[hist.length-1];
  const prev = hist[hist.length-2];
  const score  = last ? calcScore(last.responses, catalog) : null;
  const pScore = prev ? calcScore(prev.responses, catalog) : null;
  const categories = [...new Set(catalog.map(q => q.category))];

  const catScores = categories.map(cat => {
    const qs = catalog.filter(q => q.category === cat);
    if (!last) return {cat, pct:0};
    let e=0,p=0;
    qs.forEach(q => { const s=scoreItem(last.responses[q.id],q.weight); e+=s.earned; p+=s.possible; });
    const hasCrit = qs.some(q=>q.criticality==="Critical");
    const hasHigh = qs.some(q=>q.criticality==="High");
    return {cat, pct:p>0?Math.round((e/p)*100):0, weight:hasCrit?"Critical":hasHigh?"High":"Medium"};
  }).filter(c => {
    const qs = catalog.filter(q => q.category === c.cat);
    return last && qs.some(q => last.responses[q.id]?.status && last.responses[q.id]?.status !== "N/A");
  });

  const remItems = last ? catalog.flatMap(q => {
    const r = last.responses[q.id];
    if (!r || r.status==="Complete" || r.status==="N/A" || !r.status) return [];
    const p = getPriority(q, r.status);
    if (!p) return [];
    return [{...q,status:r.status,notes:r.notes,evidence:r.evidence,priority:p}];
  }).sort((a,b)=>a.priority.localeCompare(b.priority)) : [];

  const p1=remItems.filter(i=>i.priority==="P1"),p2=remItems.filter(i=>i.priority==="P2"),p3=remItems.filter(i=>i.priority==="P3");
  const reviewPeriod = last ? (() => { const d=new Date(last.date); const q=Math.ceil((d.getMonth()+1)/3); return `Q${q} ${d.getFullYear()}`; })() : "—";

  return (
    <div>
      {/* Client picker */}
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}>
        <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}}
          style={{fontFamily:FONT,fontWeight:700,fontSize:16,color:T.ink,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>
          {clients.map(c=><option key={c}>{c}</option>)}
        </select>
        <span style={{fontFamily:MONO,fontSize:11,color:T.muted,letterSpacing:0.4}}>📋 SCREENSHOT FOR POWERPOINT TBR SLIDES</span>
      </div>

      {!last ? (
        <div style={{textAlign:"center",padding:80,color:T.muted,fontFamily:FONT,fontSize:16}}>No assessment data for {client} yet.</div>
      ) : (
        <div style={{background:"#fff",borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {/* Dashboard Header (navy) */}
          <div style={{background:T.navy,color:"#E8EDF5",padding:"20px 40px 22px",borderBottom:`1px solid ${T.navyEdge}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <img src={LOGO_URI} alt="InfoTank" style={{height:36,width:"auto",objectFit:"contain"}} />
                <div style={{fontFamily:MONO,fontSize:11,color:"#94A3B8",letterSpacing:0.4}}>MANAGED SERVICES · TBR SCORECARD</div>
              </div>
              <div style={{fontFamily:MONO,fontSize:11,color:"#94A3B8",letterSpacing:0.4}}>REVIEW PERIOD · {reviewPeriod}</div>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:24}}>
              <div>
                <div style={{fontFamily:MONO,fontSize:11,color:"#7B8AA3",letterSpacing:0.5,marginBottom:6}}>PREPARED FOR</div>
                <div style={{fontFamily:FONT,fontSize:32,fontWeight:600,letterSpacing:-0.5,lineHeight:1.1}}>{client}</div>
                {last.assessor && <div style={{fontFamily:FONT,fontSize:13.5,color:"#94A3B8",marginTop:4}}>Assessed by {last.assessor} · {new Date(last.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>}
              </div>
              <div style={{display:"flex",gap:32,alignItems:"flex-end"}}>
                {[["Assessment Date",new Date(last.date).toLocaleDateString()],["Assessor",last.assessor||"—"],["Next Review","6 months"]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{fontFamily:MONO,fontSize:10,color:"#7B8AA3",letterSpacing:0.5,marginBottom:4}}>{l.toUpperCase()}</div>
                    <div style={{fontFamily:FONT,fontSize:14,color:"#FFFFFF",fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{padding:"28px 40px 40px",background:T.bg}}>
            {/* Hero row */}
            <div style={{display:"grid",gridTemplateColumns:"1.15fr 2fr",gap:20,marginBottom:20}}>
              {/* Grade card */}
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:28,display:"flex",alignItems:"center",gap:24}}>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:140,lineHeight:0.9,color:T.accent,letterSpacing:-6}}>{score.grade}</div>
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontFamily:MONO,fontSize:56,fontWeight:600,color:T.ink,letterSpacing:-2,lineHeight:1}}>{score.pct}</span>
                    <span style={{fontFamily:MONO,fontSize:22,color:T.muted,fontWeight:500}}>%</span>
                  </div>
                  <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:4}}>Overall IT Maturity</div>
                  {pScore && (
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:12,padding:"5px 10px",borderRadius:999,background:score.pct>=pScore.pct?T.okBg:T.errBg,color:score.pct>=pScore.pct?T.ok:T.err,fontFamily:MONO,fontSize:11,fontWeight:600,letterSpacing:0.4}}>
                      {score.pct>=pScore.pct?"▲":"▼"} {Math.abs(score.pct-pScore.pct)} PTS VS. LAST
                    </div>
                  )}
                </div>
              </div>
              {/* Priority counts */}
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:24,display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <div>
                    <Eyebrow>Critical Issues Open</Eyebrow>
                    <div style={{fontFamily:FONT,fontSize:18,fontWeight:600,color:T.ink,marginTop:4}}>{remItems.length} findings requiring remediation</div>
                  </div>
                  <div style={{fontFamily:MONO,fontSize:11,color:T.muted,letterSpacing:0.4}}>UPDATED · {new Date().toISOString().slice(0,10)}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                  {[{p:"P1",label:"Immediate (≤30d)",count:p1.length,color:T.err,bg:T.errBg,border:T.errBorder},
                    {p:"P2",label:"Near-term (≤90d)",count:p2.length,color:T.warn,bg:T.warnBg,border:T.warnBorder},
                    {p:"P3",label:"Planned (≤6 months)",count:p3.length,color:T.accentInk,bg:T.accentBg,border:"#B6D7DD"}].map(t=>(
                    <div key={t.p} style={{background:t.bg,borderRadius:10,padding:"14px 14px 12px",border:`1px solid ${t.border}`}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:t.color,letterSpacing:0.5,padding:"2px 6px",borderRadius:4,background:"#fff",border:`1px solid ${t.border}`}}>{t.p}</span>
                        <span style={{fontFamily:FONT,fontSize:11,color:t.color,opacity:0.8}}>{t.label}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontFamily:MONO,fontSize:36,fontWeight:600,color:t.color,letterSpacing:-1,lineHeight:1}}>{t.count}</span>
                        <span style={{fontFamily:FONT,fontSize:12,color:t.color,opacity:0.7}}>{t.count===1?"finding":"findings"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category bars */}
            <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"22px 26px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18}}>
                <div>
                  <div style={{fontFamily:FONT,fontWeight:600,fontSize:16,color:T.ink}}>Maturity by Category</div>
                  <div style={{fontFamily:FONT,fontSize:12.5,color:T.muted,marginTop:2}}>Scored against InfoTank Standard Service Stack · {catalog.length} controls</div>
                </div>
                <div style={{display:"flex",gap:14}}>
                  {[{l:"On Target (≥85)",c:T.ok},{l:"Watch (70–84)",c:T.warn},{l:"At Risk (<70)",c:T.err}].map(i=>(
                    <div key={i.l} style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:10,height:10,borderRadius:2,background:i.c,display:"inline-block"}}/>
                      <span style={{fontFamily:MONO,fontSize:10.5,color:T.muted,letterSpacing:0.4}}>{i.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {catScores.sort((a,b)=>a.pct-b.pct).map(c => {
                  const color = c.pct>=85?T.ok:c.pct>=70?T.warn:T.err;
                  return (
                    <div key={c.cat} style={{display:"grid",gridTemplateColumns:"200px 1fr 60px 80px",alignItems:"center",gap:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:6,height:22,borderRadius:2,background:color,display:"inline-block"}}/>
                        <span style={{fontFamily:FONT,fontSize:13.5,color:T.ink,fontWeight:500}}>{c.cat}</span>
                      </div>
                      <div style={{height:10,background:"#EEF1F5",borderRadius:4,overflow:"hidden",position:"relative"}}>
                        <div style={{width:`${c.pct}%`,height:"100%",background:color,borderRadius:4,transition:"width 0.3s"}}/>
                        <div style={{position:"absolute",top:-3,bottom:-3,left:"85%",width:1,background:"rgba(15,23,42,0.18)"}}/>
                      </div>
                      <div style={{fontFamily:MONO,fontSize:14,fontWeight:600,color,textAlign:"right"}}>{c.pct}%</div>
                      <div style={{textAlign:"right"}}><CritBadge kind={c.weight}/></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remediation table */}
            {remItems.length > 0 && (
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{padding:"18px 26px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontFamily:FONT,fontWeight:600,fontSize:16,color:T.ink}}>Remediation Plan</div>
                    <div style={{fontFamily:FONT,fontSize:12.5,color:T.muted,marginTop:2}}>Findings tracked through completion · status reviewed weekly</div>
                  </div>
                  <div style={{fontFamily:MONO,fontSize:11,color:T.muted,letterSpacing:0.4}}>{remItems.length} ITEMS</div>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
                  <thead>
                    <tr style={{background:"#FAFBFC"}}>
                      {["Priority","Category","Finding","Status","Notes"].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"10px 16px",fontFamily:MONO,fontSize:10.5,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {remItems.map((r,i)=>(
                      <tr key={i} style={{borderBottom:i<remItems.length-1?`1px solid ${T.border}`:"none"}}>
                        <td style={{padding:"14px 16px",verticalAlign:"top",width:70}}><PriorityPill p={r.priority}/></td>
                        <td style={{padding:"14px 16px",verticalAlign:"top",color:T.ink2,fontWeight:500,whiteSpace:"nowrap"}}>{r.category}</td>
                        <td style={{padding:"14px 16px",verticalAlign:"top",color:T.ink,lineHeight:1.45}}>{r.question}</td>
                        <td style={{padding:"14px 16px",verticalAlign:"top",whiteSpace:"nowrap"}}>
                          <span style={{fontFamily:MONO,fontSize:11,fontWeight:600,color:r.status==="Missing"?T.err:T.warn}}>{r.status}</span>
                        </td>
                        <td style={{padding:"14px 16px",verticalAlign:"top",color:T.muted,fontSize:12,maxWidth:200}}>{r.notes||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{display:"flex",justifyContent:"space-between",padding:"12px 26px",borderTop:`1px solid ${T.border}`,fontFamily:MONO,fontSize:10.5,color:T.muted,letterSpacing:0.4}}>
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
function ManageView({ catalog, onSave }) {
  const [items, setItems] = useState(catalog);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [dirty, setDirty] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState({category:"",question:"",standard:"",weight:1,criticality:"Medium"});
  const categories = [...new Set(items.map(q=>q.category))];

  const update = (id,field,val) => { setItems(p=>p.map(q=>q.id===id?{...q,[field]:val}:q)); setDirty(true); };
  const remove = id => { setItems(p=>p.filter(q=>q.id!==id)); setDirty(true); };
  const addQ = () => {
    if (!newQ.category || !newQ.question) return;
    setItems(p=>[...p,{...newQ,id:"custom_"+Date.now(),weight:Number(newQ.weight)}]);
    setNewQ({category:"",question:"",standard:"",weight:1,criticality:"Medium"});
    setAdding(false); setDirty(true);
  };
  const filtered = items.filter(q=>filter==="All"||q.category===filter);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{margin:0,fontFamily:FONT,fontWeight:600,fontSize:22,color:T.ink}}>Question Library</h2>
          <p style={{color:T.muted,margin:"4px 0 0",fontFamily:FONT,fontSize:13}}>Manage the assessment control catalog</p></div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setAdding(true)} variant="primary">+ Add Question</Btn>
          {dirty && <Btn onClick={()=>{onSave(items);setDirty(false);}} variant="accent">Save Changes</Btn>}
        </div>
      </div>

      {adding && (
        <div style={{background:T.accentBg,borderRadius:12,padding:20,marginBottom:20,border:`1px solid #B6D7DD`}}>
          <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,marginBottom:12,color:T.accentInk}}>New Question</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10,marginBottom:10}}>
            <input placeholder="Category" value={newQ.category} onChange={e=>setNewQ({...newQ,category:e.target.value})} list="cat-list"
              style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:FONT}}/>
            <datalist id="cat-list">{categories.map(c=><option key={c} value={c}/>)}</datalist>
            <input placeholder="Question text" value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})}
              style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:FONT}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 1fr",gap:10,marginBottom:12}}>
            <input placeholder="Expected standard" value={newQ.standard} onChange={e=>setNewQ({...newQ,standard:e.target.value})}
              style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:FONT}}/>
            <select value={newQ.weight} onChange={e=>setNewQ({...newQ,weight:e.target.value})}
              style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:FONT}}>
              <option value={1}>Weight: 1</option><option value={2}>Weight: 2</option><option value={3}>Weight: 3</option>
            </select>
            <select value={newQ.criticality} onChange={e=>setNewQ({...newQ,criticality:e.target.value})}
              style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:FONT}}>
              <option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={addQ} variant="primary">Add Question</Btn>
            <Btn onClick={()=>setAdding(false)} variant="ghost">Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["All",...categories].map(cat=>(
          <button key={cat} onClick={()=>setFilter(cat)} style={{
            background:filter===cat?T.navy:T.card,color:filter===cat?"#fff":T.ink2,
            border:`1px solid ${filter===cat?T.navy:T.border}`,borderRadius:999,padding:"5px 14px",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,
          }}>{cat} <span style={{opacity:0.6,fontSize:11}}>({items.filter(q=>cat==="All"||q.category===cat).length})</span></button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map(q=>(
          <div key={q.id} style={{background:T.card,borderRadius:10,padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
            {editId===q.id ? (
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                <input value={q.question} onChange={e=>update(q.id,"question",e.target.value)}
                  style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:14,fontFamily:FONT,fontWeight:600}}/>
                <input value={q.standard} onChange={e=>update(q.id,"standard",e.target.value)}
                  style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:13,fontFamily:FONT}}/>
                <div style={{display:"flex",gap:8}}>
                  <select value={q.weight} onChange={e=>update(q.id,"weight",Number(e.target.value))}
                    style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:FONT}}>
                    <option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option>
                  </select>
                  <select value={q.criticality} onChange={e=>update(q.id,"criticality",e.target.value)}
                    style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:FONT}}>
                    <option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                  <Btn onClick={()=>setEditId(null)} variant="primary" style={{fontSize:12}}>Done</Btn>
                </div>
              </div>
            ) : (
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:4,alignItems:"center"}}>
                  <CritBadge kind={q.criticality}/>
                  <span style={{fontFamily:MONO,fontSize:10.5,color:T.muted}}>Weight: {q.weight} · {q.category}</span>
                </div>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink}}>{q.question}</div>
                {q.standard && <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:2}}>{q.standard}</div>}
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
function ClientsView({ clients, assessments, catalog, onSave, onStart, onDashboard }) {
  const [items, setItems] = useState(clients);
  const [newC, setNewC] = useState("");
  const [dirty, setDirty] = useState(false);

  const summaries = items.map(c => {
    const hist = assessments[c]||[]; const last = hist[hist.length-1];
    if(!last) return {client:c,pct:null,grade:null};
    return {client:c,...calcScore(last.responses,catalog),date:last.date};
  });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{margin:0,fontFamily:FONT,fontWeight:600,fontSize:22,color:T.ink}}>Clients</h2>
          <p style={{color:T.muted,margin:"4px 0 0",fontFamily:FONT,fontSize:13}}>{items.length} managed accounts</p></div>
        <div style={{display:"flex",gap:8}}>
          <input value={newC} onChange={e=>setNewC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&newC.trim()&&!items.includes(newC.trim())&&(setItems(p=>[...p,newC.trim()]),setNewC(""),setDirty(true))} placeholder="New client name…"
            style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",fontSize:14,fontFamily:FONT,width:200}}/>
          <Btn onClick={()=>{if(newC.trim()&&!items.includes(newC.trim())){setItems(p=>[...p,newC.trim()]);setNewC("");setDirty(true);}}} variant="primary">Add Client</Btn>
          {dirty && <Btn onClick={()=>{onSave(items);setDirty(false);}} variant="accent">Save</Btn>}
        </div>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
          <thead>
            <tr style={{background:"#FAFBFC"}}>
              {["Client","Last Score","Last Assessed","Status","Actions"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 20px",fontFamily:MONO,fontSize:10.5,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaries.map((s,i)=>(
              <tr key={s.client} style={{borderBottom:i<summaries.length-1?`1px solid ${T.border}`:"none"}}>
                <td style={{padding:"14px 20px",fontWeight:600,color:T.ink,display:"flex",alignItems:"center",gap:10}}>
                  {s.grade && <span style={{fontFamily:MONO,fontSize:15,fontWeight:700,color:gradeColor(s.grade)}}>{s.grade}</span>}
                  {s.client}
                </td>
                <td style={{padding:"14px 20px",fontFamily:MONO,fontSize:13,color:T.ink}}>{s.pct!==null?`${s.pct}%`:"—"}</td>
                <td style={{padding:"14px 20px",color:T.muted,fontFamily:MONO,fontSize:12}}>{s.date?new Date(s.date).toLocaleDateString():"Never"}</td>
                <td style={{padding:"14px 20px"}}>
                  <span style={{fontFamily:MONO,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,
                    background:!s.pct?T.errBg:s.pct>=70?T.okBg:T.warnBg,
                    color:!s.pct?T.err:s.pct>=70?T.ok:T.warn,
                  }}>{!s.pct?"NOT ASSESSED":s.pct>=70?"ON TRACK":"AT RISK"}</span>
                </td>
                <td style={{padding:"14px 20px"}}>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>onStart(s.client)} style={{fontFamily:FONT,fontSize:12,fontWeight:600,color:T.accent,background:T.accentBg,border:`1px solid #B6D7DD`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Assess</button>
                    {s.pct && <button onClick={()=>onDashboard(s.client)} style={{fontFamily:FONT,fontSize:12,fontWeight:600,color:T.muted,background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Dashboard</button>}
                    <button onClick={()=>{setItems(p=>p.filter(x=>x!==s.client));setDirty(true);}} style={{fontFamily:FONT,fontSize:12,fontWeight:600,color:T.err,background:T.errBg,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
