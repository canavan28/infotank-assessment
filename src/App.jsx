import { useState, useEffect, useCallback } from "react";

// ─── QUESTION CATALOG (from your Excel files) ───────────────────────────────
const DEFAULT_CATALOG = [
  // Account Management
  { id: "am1", category: "Account Management", question: "Confirm Users are in Datto SaaS", standard: "Licensing accurate; shared mailboxes backed up; no unlicensed active users.", weight: 2, criticality: "High" },
  { id: "am2", category: "Account Management", question: "Are all users in Supported User group? Have terminated users been removed?", standard: "Accurate User List", weight: 1, criticality: "Medium" },
  { id: "am3", category: "Account Management", question: "Are all softwares using Supported User group to update users?", standard: "Confirmed - Datto SaaS, Graphus, KB4, SaaS Alerts, Dark Web all up to date", weight: 2, criticality: "High" },
  { id: "am4", category: "Account Management", question: "Date of last TBR", standard: "Date", weight: 1, criticality: "Medium" },
  { id: "am5", category: "Account Management", question: "Date of next TBR", standard: "Date", weight: 1, criticality: "Medium" },
  // Backup
  { id: "bk1", category: "Backup", question: "Check SaaS if backups were successful for last 30 days, if not investigate why and resolve so future backups are correct", standard: "Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight: 2, criticality: "High" },
  { id: "bk2", category: "Backup", question: "Client has Onsite and Cloud backups in place (NAS, Datto) managed by us - If they have an onsite server", standard: "Backups succeed daily with alerts; all users/shared mailboxes/sites protected.", weight: 2, criticality: "High" },
  { id: "bk3", category: "Backup", question: "Perform a successful backup test", standard: "Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.", weight: 2, criticality: "Critical" },
  { id: "bk4", category: "Backup", question: "Perform a successful backup test on a user.", standard: "Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.", weight: 2, criticality: "Critical" },
  // IT Glue
  { id: "ig1", category: "IT Glue", question: "365/google creds stored and updated - Test", standard: "Documentation current (≤90 days) and complete for core services.", weight: 2, criticality: "High" },
  { id: "ig2", category: "IT Glue", question: "Add 3rd-party web/cloud/hosting logins/passwords to ITG", standard: "Documentation current (≤90 days) and complete for core services.", weight: 2, criticality: "High" },
  { id: "ig3", category: "IT Glue", question: "Add administrative passwords for each network device to ITG", standard: "Documentation current (≤90 days) and complete for core services.", weight: 2, criticality: "Critical" },
  { id: "ig4", category: "IT Glue", question: "All documents properly named for easy searching", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig5", category: "IT Glue", question: "All information about backups is in ITG", standard: "Documentation current (≤90 days) and complete for core services.", weight: 2, criticality: "High" },
  { id: "ig6", category: "IT Glue", question: "All LOB applications are documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig7", category: "IT Glue", question: "All of the software licensing is documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig8", category: "IT Glue", question: "All outdated documents have been removed", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig9", category: "IT Glue", question: "All UPS devices are documented for server and network", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig10", category: "IT Glue", question: "All Vendors are documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig11", category: "IT Glue", question: "Company offboarding doc is in ITG and up to date", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig12", category: "IT Glue", question: "Company onboarding doc is in ITG and up to date", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig13", category: "IT Glue", question: "Company workstation setup doc is in ITG and up to date", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig14", category: "IT Glue", question: "Default workstation admin creds are documented", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 2, criticality: "Critical" },
  { id: "ig15", category: "IT Glue", question: "Document all network printers", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig16", category: "IT Glue", question: "Document DNS hosting login/password in ITG", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig17", category: "IT Glue", question: "Document floorplan of the office if available", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig18", category: "IT Glue", question: "Document organizational chart if available", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig19", category: "IT Glue", question: "Document the wireless network SSID/authentication", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig20", category: "IT Glue", question: "File sharing is documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig21", category: "IT Glue", question: "Fill out company home page", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig22", category: "IT Glue", question: "ISP information is documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig23", category: "IT Glue", question: "Network diagrams are documented - if complex network", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig24", category: "IT Glue", question: "Printing is documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig25", category: "IT Glue", question: "Servers are documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ig26", category: "IT Glue", question: "Voice systems are documented", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  // Network
  { id: "nw1", category: "Network", question: "Is the network protected by an InfoTank-Supported Sonicwall?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw2", category: "Network", question: "Are all firewall configurations backed up?", standard: "Supported firewall; current firmware; secure remote access; rules reviewed quarterly.", weight: 2, criticality: "High" },
  { id: "nw3", category: "Network", question: "Does the firewall have the latest firmware and security license enabled?", standard: "Supported firewall; current firmware; secure remote access; rules reviewed quarterly.", weight: 1, criticality: "Medium" },
  { id: "nw4", category: "Network", question: "Is Sonicwall software installed and up to date?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw5", category: "Network", question: "Are network switches set to alert if something goes wrong?", standard: "Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight: 1, criticality: "Medium" },
  { id: "nw6", category: "Network", question: "Are the APs Monitored?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw7", category: "Network", question: "Are the network devices all Ubiquiti? (Switches, APs)", standard: "Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight: 1, criticality: "Medium" },
  { id: "nw8", category: "Network", question: "If not what are the switches", standard: "Switch firmware current; VLANs documented; guest/IoT segmented from corporate.", weight: 1, criticality: "Medium" },
  { id: "nw9", category: "Network", question: "If not what are the APs", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw10", category: "Network", question: "Are there strong passphrases in use for corporate wireless SSIDs?", standard: "Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight: 2, criticality: "Critical" },
  { id: "nw11", category: "Network", question: "Is direct RDP to server present?", standard: "No Direct RDP allowed", weight: 1, criticality: "Medium" },
  { id: "nw12", category: "Network", question: "Is network-level remote access limited to authorized staff?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw13", category: "Network", question: "Is the Guest wireless enabled and traffic is segregated?", standard: "Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight: 1, criticality: "Medium" },
  { id: "nw14", category: "Network", question: "Is the wireless coverage/capacity appropriate for intended use?", standard: "Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.", weight: 1, criticality: "Medium" },
  { id: "nw15", category: "Network", question: "Is there a failover/redundant internet circuit available in case of primary ISP failure?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw16", category: "Network", question: "Perform failover test. Was it successful?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw17", category: "Network", question: "Is there a web content/filtering management system in place, and is it managed and configured?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw18", category: "Network", question: "Is there adequate LAN capacity to support network requirements?", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw19", category: "Network", question: "When was last password reset - All network equipment", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  { id: "nw20", category: "Network", question: "When is next password reset - All network equipment", standard: "Network gear supported/updated; configs backed up; changes documented.", weight: 1, criticality: "Medium" },
  // Passwords
  { id: "pw1", category: "Passwords", question: "Archive old passwords", standard: "Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight: 2, criticality: "High" },
  { id: "pw2", category: "Passwords", question: "Confirm that all admin passwords have been changed since we took over", standard: "No standard users have local admin; privileged roles minimized and reviewed monthly.", weight: 2, criticality: "Critical" },
  // Physical Checks
  { id: "ph1", category: "Physical Checks", question: "Conduct an inventory of the workstations, make sure they are labeled and named properly", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ph2", category: "Physical Checks", question: "Photos of the server/network room have been taken and uploaded to ITG", standard: "Documentation current (≤90 days) and complete for core services.", weight: 1, criticality: "Medium" },
  { id: "ph3", category: "Physical Checks", question: "Confirm all of the server/network room data cabling neatly cable managed", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ph4", category: "Physical Checks", question: "Confirm that server/network room is properly cooled", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  // Power Management
  { id: "pm1", category: "Power Management", question: "Check that all UPS devices functioning normally with all lights green", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm2", category: "Power Management", question: "Confirm all servers and network equipment have adequate power", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm3", category: "Power Management", question: "Confirm an automated shutdown of the servers via UPS configured", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm4", category: "Power Management", question: "Confirm the UPS systems are not overloaded", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm5", category: "Power Management", question: "Confirm the UPS systems have adequate runtime capacity", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm6", category: "Power Management", question: "Confirm UPS devices are within life expectancy", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm7", category: "Power Management", question: "Confirm all servers have UPS installed", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm8", category: "Power Management", question: "Confirm all network equipment have UPS installed", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "pm9", category: "Power Management", question: "Run a UPS test on all UPS devices to ensure functionality", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  // Security
  { id: "sc1", category: "Security", question: "Confirm all workstations and servers have S1 installed software", standard: "S1 deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight: 2, criticality: "High" },
  { id: "sc2", category: "Security", question: "Is Entra ID enabled for all users", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 2, criticality: "High" },
  { id: "sc3", category: "Security", question: "Has company purchased vPenTest", standard: "vPenTest are purchased and on the contract", weight: 2, criticality: "High" },
  { id: "sc4", category: "Security", question: "Are vPenTest on schedule and properly remediated", standard: "vPenTest deployed and scheduled each quarter with no critical alerts outstanding.", weight: 2, criticality: "High" },
  { id: "sc5", category: "Security", question: "Is MFA enabled/enforced for all users", standard: "All user accounts require MFA; break-glass accounts restricted and monitored.", weight: 2, criticality: "Critical" },
  { id: "sc6", category: "Security", question: "Has company purchased S1 Vigilance", standard: "S1 Vigilance was purchased and on the contract", weight: 2, criticality: "High" },
  { id: "sc7", category: "Security", question: "If so, has S1 Vigilance been enabled for client", standard: "S1 Vigilance deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight: 2, criticality: "High" },
  { id: "sc8", category: "Security", question: "Has company purchased SaaS Alerts", standard: "SaaS Alerts was purchased and on the contract", weight: 2, criticality: "High" },
  { id: "sc9", category: "Security", question: "Are logins protected by SaaS Alerts", standard: "SaaSAlerts deployed and reporting on 100% of endpoints with no critical alerts outstanding.", weight: 2, criticality: "High" },
  // Server
  { id: "sv1", category: "Server", question: "Confirm Datto is configured on server to automatically deploy", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 2, criticality: "High" },
  { id: "sv2", category: "Server", question: "Are administrative account passwords set to be strong with a minimum of 12 mixed characters?", standard: "Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight: 2, criticality: "Critical" },
  { id: "sv3", category: "Server", question: "Are all servers configured with static network information?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "sv4", category: "Server", question: "Are all servers joined/bound to Active Directory domain?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "sv5", category: "Server", question: "Are all servers under current vendor warranty?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "sv6", category: "Server", question: "Are there secondary administrator accounts in place, in case of breach?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 2, criticality: "Critical" },
  { id: "sv7", category: "Server", question: "Do servers have adequate disk space on all volumes? Under 90%", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "sv8", category: "Server", question: "Does adequate server performance/capacity exist?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  // Server - GPO
  { id: "gp1", category: "Server - GPO", question: "Are group policies deployed adhere to company standard?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp2", category: "Server - GPO", question: "Are there restrictive permissions in place to prevent unauthorized access to files/folders?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp3", category: "Server - GPO", question: "Do workstations/servers/network devices auto-logoff or auto-lock with certain conditions?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp4", category: "Server - GPO", question: "Have all domain admin passwords been reset, and are they on a reset schedule?", standard: "No standard users have local admin; privileged roles minimized and reviewed monthly.", weight: 2, criticality: "Critical" },
  { id: "gp5", category: "Server - GPO", question: "Is the password policy configured in Active Directory?", standard: "Password policy ≥12 chars; complexity on; lockout/throttle enabled; SSPR configured.", weight: 2, criticality: "High" },
  { id: "gp6", category: "Server - GPO", question: "Is there a password required immediately after sleep or when the screen saver begins?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp7", category: "Server - GPO", question: "When is next password reset", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp8", category: "Server - GPO", question: "When was last password reset", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "gp9", category: "Server - GPO", question: "Do workstations require a password immediately after sleep, or when the screen saver begins?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  // Systems
  { id: "sy1", category: "Systems", question: "Have Admin accounts been limited using principle of least access for AD/EntraID", standard: "No standard users have local admin; privileged roles minimized and reviewed monthly.", weight: 2, criticality: "Critical" },
  // Workstations
  { id: "ws1", category: "Workstations", question: "Are all network printers configured with an accurate name/location?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ws2", category: "Workstations", question: "Are all network printers deployed automatically?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ws3", category: "Workstations", question: "Are all workstations running the same, latest Operating System?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ws4", category: "Workstations", question: "Are all workstations joined to AD/Azure?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ws5", category: "Workstations", question: "Are all workstations protected against electrical surge?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 1, criticality: "Medium" },
  { id: "ws6", category: "Workstations", question: "Are files automatically saved/stored on servers or OneDrive? Is there an internal policy to store on OneDrive/Server?", standard: "Meets InfoTank standard; exceptions documented with remediation plan.", weight: 2, criticality: "High" },
  { id: "ws7", category: "Workstations", question: "Are users set to not be local administrators?", standard: "No standard users have local admin; privileged roles minimized and reviewed monthly.", weight: 2, criticality: "Critical" },
  { id: "ws8", category: "Workstations", question: "Have all local administrator passwords been reset?", standard: "No standard users have local admin; privileged roles minimized and reviewed monthly.", weight: 2, criticality: "Critical" },
  { id: "ws9", category: "Workstations", question: "Is BitLocker configured for all laptops and code stored in Datto?", standard: "Full-disk encryption enabled and escrowed for all company endpoints/servers as applicable.", weight: 2, criticality: "Critical" },
];

const DEFAULT_CLIENTS = ["AVGroup","COE","LaAmistad","Morton Construction","Phoenix","Warner Summers","Perimeter Floors","TS Adams"];

const STATUSES = ["Complete","Partial","Missing","N/A"];
const STATUS_COLORS = { Complete:"#22c55e", Partial:"#f59e0b", Missing:"#ef4444", "N/A":"#94a3b8" };
const CRIT_COLORS = { Critical:"#dc2626", High:"#ea580c", Medium:"#3b82f6" };

// Scoring: N/A excluded, Complete = weight*2, Partial = weight*1, Missing = 0
function scoreItem(item, weight) {
  if (item.status === "N/A") return { earned: 0, possible: 0 };
  const possible = weight * 2;
  if (item.status === "Complete") return { earned: possible, possible };
  if (item.status === "Partial") return { earned: weight, possible };
  return { earned: 0, possible };
}

function calcScore(responses, catalog) {
  let earned = 0, possible = 0;
  catalog.forEach(q => {
    const r = responses[q.id];
    if (!r) return;
    const s = scoreItem(r, q.weight);
    earned += s.earned; possible += s.possible;
  });
  const pct = possible > 0 ? earned / possible : 0;
  let grade = "F";
  if (pct >= 0.9) grade = "A";
  else if (pct >= 0.8) grade = "B";
  else if (pct >= 0.7) grade = "C";
  else if (pct >= 0.6) grade = "D";
  return { earned, possible, pct, grade };
}

function getPriority(q, status) {
  if (status === "Missing" && q.criticality === "Critical") return "P1";
  if (status === "Missing" && (q.criticality === "High" || q.criticality === "Medium")) return "P2";
  if (status === "Partial") return "P3";
  return null;
}

// ─── STORAGE HELPERS (localStorage for Vercel deployment) ───────────────────
async function storageGet(key) {
  try {
    const val = localStorage.getItem("infotank_" + key);
    return val ? JSON.parse(val) : null;
  } catch { return null; }
}
async function storageSet(key, val) {
  try {
    localStorage.setItem("infotank_" + key, JSON.stringify(val));
  } catch(e) { console.error(e); }
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | assess | manage | dashboard | admin
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [clients, setClients] = useState(DEFAULT_CLIENTS);
  const [assessments, setAssessments] = useState({}); // { clientName: [{ date, assessor, responses:{id:{status,notes,evidence}} }] }
  const [activeClient, setActiveClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState("");

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const cat = await storageGet("catalog");
      const cli = await storageGet("clients");
      const asm = await storageGet("assessments");
      if (cat) setCatalog(cat);
      if (cli) setClients(cli);
      if (asm) setAssessments(asm);
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (newCat, newCli, newAsm) => {
    setSavingStatus("Saving…");
    await Promise.all([
      storageSet("catalog", newCat ?? catalog),
      storageSet("clients", newCli ?? clients),
      storageSet("assessments", newAsm ?? assessments),
    ]);
    setSavingStatus("Saved ✓");
    setTimeout(() => setSavingStatus(""), 2000);
  }, [catalog, clients, assessments]);

  const navItems = [
    { id:"home", label:"🏠 Home" },
    { id:"assess", label:"📋 Assessment" },
    { id:"dashboard", label:"📊 Dashboard" },
    { id:"manage", label:"⚙️ Questions" },
    { id:"admin", label:"👥 Clients" },
  ];

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"'DM Mono',monospace",color:"#64748b"}}>
      Loading InfoTank Assessment Platform…
    </div>
  );

  return (
    <div style={{fontFamily:"'DM Sans','DM Mono',system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      {/* Header */}
      <header style={{background:"#0f172a",color:"white",padding:"0 24px",display:"flex",alignItems:"center",gap:24,height:56,boxShadow:"0 1px 8px rgba(0,0,0,0.3)"}}>
        <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.5px",color:"#38bdf8"}}>
          ⚡ InfoTank
        </div>
        <div style={{flex:1,display:"flex",gap:4}}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              background: view===n.id ? "#1e40af" : "transparent",
              color: view===n.id ? "white" : "#94a3b8",
              border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",
              fontSize:13,fontWeight:600,transition:"all 0.15s"
            }}>{n.label}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:"#64748b"}}>{savingStatus}</div>
      </header>

      {/* Views */}
      <main style={{maxWidth:1200,margin:"0 auto",padding:24}}>
        {view === "home" && <HomeView clients={clients} assessments={assessments} catalog={catalog} onStart={(c) => { setActiveClient(c); setView("assess"); }} onDashboard={(c) => { setActiveClient(c); setView("dashboard"); }} />}
        {view === "assess" && <AssessView clients={clients} catalog={catalog} assessments={assessments} activeClient={activeClient} setActiveClient={setActiveClient} onSave={(newAsm) => { setAssessments(newAsm); save(null, null, newAsm); }} />}
        {view === "dashboard" && <DashboardView clients={clients} assessments={assessments} catalog={catalog} activeClient={activeClient} setActiveClient={setActiveClient} />}
        {view === "manage" && <ManageView catalog={catalog} onSave={(c) => { setCatalog(c); save(c, null, null); }} />}
        {view === "admin" && <AdminView clients={clients} onSave={(c) => { setClients(c); save(null, c, null); }} />}
      </main>
    </div>
  );
}

// ─── HOME VIEW ───────────────────────────────────────────────────────────────
function HomeView({ clients, assessments, catalog, onStart, onDashboard }) {
  const summaries = clients.map(c => {
    const hist = assessments[c] || [];
    const last = hist[hist.length - 1];
    if (!last) return { client: c, pct: null, grade: null, date: null };
    const sc = calcScore(last.responses, catalog);
    return { client: c, ...sc, date: last.date, assessor: last.assessor };
  });

  return (
    <div>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:4}}>Client Assessment Hub</h1>
      <p style={{color:"#64748b",marginBottom:32}}>Technology Business Review Platform</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {summaries.map(s => (
          <div key={s.client} style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",border:"1px solid #e2e8f0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:16}}>{s.client}</div>
              {s.grade && (
                <div style={{
                  background: s.pct >= 0.8 ? "#dcfce7" : s.pct >= 0.6 ? "#fef9c3" : "#fee2e2",
                  color: s.pct >= 0.8 ? "#166534" : s.pct >= 0.6 ? "#854d0e" : "#991b1b",
                  fontWeight:800,fontSize:20,borderRadius:8,padding:"4px 12px"
                }}>{s.grade}</div>
              )}
            </div>
            {s.pct !== null ? (
              <>
                <div style={{marginBottom:8}}>
                  <div style={{height:8,background:"#e2e8f0",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.pct*100}%`,background:s.pct>=0.8?"#22c55e":s.pct>=0.6?"#f59e0b":"#ef4444",borderRadius:4,transition:"width 0.5s"}} />
                  </div>
                </div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>
                  {Math.round(s.pct*100)}% • {s.earned}/{s.possible} pts
                  {s.date && <span> • {new Date(s.date).toLocaleDateString()}</span>}
                </div>
              </>
            ) : (
              <div style={{fontSize:13,color:"#94a3b8",marginBottom:12}}>No assessment yet</div>
            )}
            <div style={{display:"flex",gap:8}}>
              <button onClick={() => onStart(s.client)} style={{flex:1,background:"#0f172a",color:"white",border:"none",borderRadius:7,padding:"8px 0",cursor:"pointer",fontSize:13,fontWeight:600}}>
                {s.pct !== null ? "New Assessment" : "Start Assessment"}
              </button>
              {s.pct !== null && (
                <button onClick={() => onDashboard(s.client)} style={{flex:1,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:7,padding:"8px 0",cursor:"pointer",fontSize:13,fontWeight:600}}>
                  View Dashboard
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSESSMENT VIEW ──────────────────────────────────────────────────────────
function AssessView({ clients, catalog, assessments, activeClient, setActiveClient, onSave }) {
  const [client, setClient] = useState(activeClient || clients[0]);
  const [assessor, setAssessor] = useState("");
  const [responses, setResponses] = useState({});
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const categories = [...new Set(catalog.map(q => q.category))];

  // Load baseline from last assessment
  useEffect(() => {
    if (!client) return;
    const hist = assessments[client] || [];
    if (hist.length > 0) {
      const last = hist[hist.length - 1];
      setResponses({ ...last.responses });
    } else {
      setResponses({});
    }
    setSaved(false);
  }, [client]);

  const setResponse = (id, field, val) => {
    setResponses(r => ({ ...r, [id]: { ...(r[id] || {}), [field]: val } }));
    setSaved(false);
  };

  const handleSave = () => {
    const newEntry = { date: new Date().toISOString(), assessor, responses };
    const hist = assessments[client] || [];
    const newAsm = { ...assessments, [client]: [...hist, newEntry] };
    onSave(newAsm);
    setSaved(true);
  };

  const score = calcScore(responses, catalog);
  const filteredCatalog = catalog
    .filter(q => filter === "All" || q.category === filter)
    .filter(q => !search || q.question.toLowerCase().includes(search.toLowerCase()));

  const completedCount = Object.values(responses).filter(r => r.status).length;

  return (
    <div>
      {/* Controls Bar */}
      <div style={{background:"white",borderRadius:12,padding:16,marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"0 0 auto"}}>
          <label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>CLIENT</label>
          <select value={client} onChange={e => { setClient(e.target.value); setActiveClient(e.target.value); }}
            style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"7px 12px",fontSize:14,fontWeight:600,background:"white",cursor:"pointer"}}>
            {clients.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{flex:"0 0 auto"}}>
          <label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>ASSESSOR</label>
          <input value={assessor} onChange={e => setAssessor(e.target.value)} placeholder="Your name"
            style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"7px 12px",fontSize:14,width:160}} />
        </div>
        <div style={{flex:1}}>
          <label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>SEARCH</label>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…"
            style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"7px 12px",fontSize:14,width:"100%"}} />
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,paddingTop:20}}>
          <div style={{textAlign:"center",background:"#f0f9ff",borderRadius:8,padding:"6px 14px"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#0369a1"}}>{Math.round(score.pct*100)}%</div>
            <div style={{fontSize:11,color:"#64748b"}}>{completedCount}/{catalog.length} done</div>
          </div>
          <button onClick={handleSave} style={{background:saved?"#22c55e":"#0f172a",color:"white",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontWeight:700,fontSize:14}}>
            {saved ? "✓ Saved!" : "Save Assessment"}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["All", ...categories].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            background: filter===cat ? "#0f172a" : "white",
            color: filter===cat ? "white" : "#374151",
            border:"1px solid " + (filter===cat ? "#0f172a" : "#e2e8f0"),
            borderRadius:20,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:600
          }}>{cat}</button>
        ))}
      </div>

      {/* Question List */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filteredCatalog.map(q => {
          const r = responses[q.id] || {};
          const hasPrev = assessments[client]?.length > 0;
          return (
            <div key={q.id} style={{background:"white",borderRadius:10,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:"1px solid " + (r.status === "Missing" ? "#fecaca" : r.status === "Complete" ? "#dcfce7" : r.status === "Partial" ? "#fef9c3" : "#e2e8f0")}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,background:CRIT_COLORS[q.criticality]+"22",color:CRIT_COLORS[q.criticality],borderRadius:4,padding:"2px 6px"}}>{q.criticality}</span>
                    <span style={{fontSize:11,color:"#94a3b8"}}>{q.category}</span>
                    {hasPrev && r.status && <span style={{fontSize:11,color:"#94a3b8"}}>↺ from baseline</span>}
                  </div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{q.question}</div>
                  <div style={{fontSize:12,color:"#64748b",fontStyle:"italic"}}>{q.standard}</div>
                </div>
                {/* Status buttons */}
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => setResponse(q.id, "status", s)} style={{
                      background: r.status===s ? STATUS_COLORS[s] : "#f1f5f9",
                      color: r.status===s ? "white" : "#64748b",
                      border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",
                      fontSize:12,fontWeight:600,transition:"all 0.1s",minWidth:64
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              {/* Notes & Evidence */}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <input placeholder="Notes…" value={r.notes||""} onChange={e => setResponse(q.id,"notes",e.target.value)}
                  style={{flex:1,border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 10px",fontSize:13}} />
                <input placeholder="Evidence link…" value={r.evidence||""} onChange={e => setResponse(q.id,"evidence",e.target.value)}
                  style={{flex:1,border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 10px",fontSize:13}} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function DashboardView({ clients, assessments, catalog, activeClient, setActiveClient }) {
  const [client, setClient] = useState(activeClient || clients[0]);
  const hist = assessments[client] || [];
  const last = hist[hist.length - 1];
  const prev = hist[hist.length - 2];

  const score = last ? calcScore(last.responses, catalog) : null;
  const prevScore = prev ? calcScore(prev.responses, catalog) : null;

  const categories = [...new Set(catalog.map(q => q.category))];

  // Per-category scores
  const catScores = categories.map(cat => {
    const qs = catalog.filter(q => q.category === cat);
    if (!last) return { cat, earned: 0, possible: 0, pct: 0 };
    let earned = 0, possible = 0;
    qs.forEach(q => {
      const r = last.responses[q.id];
      if (!r) return;
      const s = scoreItem(r, q.weight);
      earned += s.earned; possible += s.possible;
    });
    return { cat, earned, possible, pct: possible > 0 ? earned/possible : 0 };
  }).filter(c => c.possible > 0);

  // Remediation items
  const remItems = last ? catalog.flatMap(q => {
    const r = last.responses[q.id];
    if (!r || r.status === "Complete" || r.status === "N/A" || !r.status) return [];
    const priority = getPriority(q, r.status);
    if (!priority) return [];
    return [{ ...q, status: r.status, notes: r.notes, evidence: r.evidence, priority }];
  }).sort((a,b) => a.priority.localeCompare(b.priority)) : [];

  const p1 = remItems.filter(i => i.priority === "P1");
  const p2 = remItems.filter(i => i.priority === "P2");
  const p3 = remItems.filter(i => i.priority === "P3");

  const gradeColor = !score ? "#94a3b8" : score.pct>=0.8 ? "#16a34a" : score.pct>=0.6 ? "#ca8a04" : "#dc2626";

  return (
    <div>
      {/* Client Selector */}
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24,flexWrap:"wrap"}}>
        <select value={client} onChange={e => { setClient(e.target.value); setActiveClient(e.target.value); }}
          style={{border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 16px",fontSize:16,fontWeight:700,background:"white",cursor:"pointer"}}>
          {clients.map(c => <option key={c}>{c}</option>)}
        </select>
        {last && <span style={{color:"#64748b",fontSize:13}}>Last assessed: {new Date(last.date).toLocaleDateString()} by {last.assessor || "Unknown"}</span>}
        <span style={{marginLeft:"auto",fontSize:13,color:"#94a3b8"}}>📋 Screenshot or copy for PowerPoint TBR slides</span>
      </div>

      {!last ? (
        <div style={{textAlign:"center",padding:80,color:"#94a3b8",fontSize:18}}>No assessment data for {client} yet.</div>
      ) : (
        <div id="dashboard-content">
          {/* Score Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
            <div style={{background:"white",borderRadius:12,padding:24,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:56,fontWeight:900,color:gradeColor,lineHeight:1}}>{score.grade}</div>
              <div style={{color:"#64748b",fontSize:14,marginTop:4}}>Overall Grade</div>
              <div style={{fontSize:13,color:"#94a3b8",marginTop:2}}>{Math.round(score.pct*100)}% • {score.earned}/{score.possible} pts</div>
              {prevScore && <div style={{fontSize:12,marginTop:6,color:score.pct>=prevScore.pct?"#16a34a":"#dc2626"}}>
                {score.pct>=prevScore.pct?"▲":"▼"} {Math.abs(Math.round((score.pct-prevScore.pct)*100))}% vs last
              </div>}
            </div>
            <div style={{background:"white",borderRadius:12,padding:24,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:48,fontWeight:900,color:"#dc2626",lineHeight:1}}>{p1.length}</div>
              <div style={{color:"#64748b",fontSize:14,marginTop:4}}>Critical Issues (P1)</div>
              <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Requires immediate action</div>
            </div>
            <div style={{background:"white",borderRadius:12,padding:24,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:48,fontWeight:900,color:"#ea580c",lineHeight:1}}>{p2.length}</div>
              <div style={{color:"#64748b",fontSize:14,marginTop:4}}>High Priority (P2)</div>
              <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Address within 30 days</div>
            </div>
            <div style={{background:"white",borderRadius:12,padding:24,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:48,fontWeight:900,color:"#f59e0b",lineHeight:1}}>{p3.length}</div>
              <div style={{color:"#64748b",fontSize:14,marginTop:4}}>Improvements (P3)</div>
              <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Partial completions</div>
            </div>
          </div>

          {/* Category Bar Chart */}
          <div style={{background:"white",borderRadius:12,padding:24,marginBottom:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
            <h3 style={{margin:"0 0 20px",fontSize:16,fontWeight:700}}>Category Scores</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {catScores.sort((a,b)=>a.pct-b.pct).map(c => (
                <div key={c.cat} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:140,fontSize:12,fontWeight:600,textAlign:"right",color:"#374151",flexShrink:0}}>{c.cat}</div>
                  <div style={{flex:1,height:22,background:"#f1f5f9",borderRadius:4,overflow:"hidden",position:"relative"}}>
                    <div style={{position:"absolute",inset:0,width:`${c.pct*100}%`,background:c.pct>=0.8?"#22c55e":c.pct>=0.6?"#f59e0b":"#ef4444",borderRadius:4,transition:"width 0.5s"}} />
                  </div>
                  <div style={{width:50,fontSize:13,fontWeight:700,color:c.pct>=0.8?"#16a34a":c.pct>=0.6?"#ca8a04":"#dc2626",flexShrink:0}}>
                    {Math.round(c.pct*100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Table */}
          {remItems.length > 0 && (
            <div style={{background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
              <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700}}>Remediation Items ({remItems.length})</h3>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      {["Priority","Category","Issue","Status","Notes"].map(h => (
                        <th key={h} style={{padding:"8px 12px",textAlign:"left",fontWeight:700,color:"#374151",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {remItems.map((item,i) => (
                      <tr key={i} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa"}}>
                        <td style={{padding:"8px 12px"}}>
                          <span style={{background:item.priority==="P1"?"#fee2e2":item.priority==="P2"?"#fff7ed":"#fefce8",color:item.priority==="P1"?"#dc2626":item.priority==="P2"?"#ea580c":"#ca8a04",fontWeight:700,borderRadius:4,padding:"2px 8px",fontSize:12}}>{item.priority}</span>
                        </td>
                        <td style={{padding:"8px 12px",color:"#64748b",whiteSpace:"nowrap"}}>{item.category}</td>
                        <td style={{padding:"8px 12px",maxWidth:300}}>{item.question}</td>
                        <td style={{padding:"8px 12px"}}>
                          <span style={{color:STATUS_COLORS[item.status],fontWeight:600}}>{item.status}</span>
                        </td>
                        <td style={{padding:"8px 12px",color:"#64748b",maxWidth:240,fontSize:12}}>{item.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MANAGE VIEW (Question Editor) ──────────────────────────────────────────
function ManageView({ catalog, onSave }) {
  const [items, setItems] = useState(catalog);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [dirty, setDirty] = useState(false);
  const [newQ, setNewQ] = useState({ category:"", question:"", standard:"", weight:1, criticality:"Medium" });
  const [adding, setAdding] = useState(false);

  const categories = [...new Set(items.map(q => q.category))];

  const update = (id, field, val) => {
    setItems(prev => prev.map(q => q.id===id ? {...q,[field]:val} : q));
    setDirty(true);
  };

  const remove = (id) => {
    setItems(prev => prev.filter(q => q.id !== id));
    setDirty(true);
  };

  const addQuestion = () => {
    if (!newQ.category || !newQ.question) return;
    const id = "custom_" + Date.now();
    setItems(prev => [...prev, { ...newQ, id, weight: Number(newQ.weight) }]);
    setNewQ({ category:"", question:"", standard:"", weight:1, criticality:"Medium" });
    setAdding(false);
    setDirty(true);
  };

  const filtered = items.filter(q => filter==="All" || q.category===filter);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontWeight:800}}>Question Manager</h2>
          <p style={{color:"#64748b",margin:"4px 0 0"}}>Add, remove, or edit assessment questions</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={() => setAdding(true)} style={{background:"#0f172a",color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700}}>+ Add Question</button>
          {dirty && <button onClick={() => { onSave(items); setDirty(false); }} style={{background:"#16a34a",color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700}}>Save Changes</button>}
        </div>
      </div>

      {/* Add Form */}
      {adding && (
        <div style={{background:"#f0f9ff",borderRadius:12,padding:20,marginBottom:20,border:"1px solid #bae6fd"}}>
          <h4 style={{margin:"0 0 14px",fontWeight:700}}>New Question</h4>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10,marginBottom:10}}>
            <input placeholder="Category" value={newQ.category} onChange={e=>setNewQ({...newQ,category:e.target.value})}
              list="cat-list" style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 12px",fontSize:14}} />
            <datalist id="cat-list">{categories.map(c=><option key={c} value={c}/>)}</datalist>
            <input placeholder="Question text" value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})}
              style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 12px",fontSize:14}} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 1fr",gap:10,marginBottom:12}}>
            <input placeholder="Expected standard / description" value={newQ.standard} onChange={e=>setNewQ({...newQ,standard:e.target.value})}
              style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 12px",fontSize:14}} />
            <select value={newQ.weight} onChange={e=>setNewQ({...newQ,weight:e.target.value})}
              style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 12px",fontSize:14}}>
              <option value={1}>Weight: 1</option><option value={2}>Weight: 2</option><option value={3}>Weight: 3</option>
            </select>
            <select value={newQ.criticality} onChange={e=>setNewQ({...newQ,criticality:e.target.value})}
              style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 12px",fontSize:14}}>
              <option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addQuestion} style={{background:"#0f172a",color:"white",border:"none",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontWeight:700}}>Add</button>
            <button onClick={() => setAdding(false)} style={{background:"white",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:7,padding:"8px 18px",cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["All",...categories].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{background:filter===cat?"#0f172a":"white",color:filter===cat?"white":"#374151",border:"1px solid "+(filter===cat?"#0f172a":"#e2e8f0"),borderRadius:20,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>
            {cat} <span style={{color:filter===cat?"#94a3b8":"#94a3b8",fontSize:11}}>({items.filter(q=>cat==="All"||q.category===cat).length})</span>
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map(q => (
          <div key={q.id} style={{background:"white",borderRadius:9,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:"1px solid #e2e8f0",display:"flex",gap:12,alignItems:"flex-start"}}>
            {editId === q.id ? (
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                <input value={q.question} onChange={e=>update(q.id,"question",e.target.value)}
                  style={{border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 10px",fontSize:14,fontWeight:600}} />
                <input value={q.standard} onChange={e=>update(q.id,"standard",e.target.value)}
                  style={{border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 10px",fontSize:13}} />
                <div style={{display:"flex",gap:8}}>
                  <select value={q.weight} onChange={e=>update(q.id,"weight",Number(e.target.value))}
                    style={{border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 10px",fontSize:13}}>
                    <option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option>
                  </select>
                  <select value={q.criticality} onChange={e=>update(q.id,"criticality",e.target.value)}
                    style={{border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 10px",fontSize:13}}>
                    <option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                  <button onClick={() => setEditId(null)} style={{background:"#0f172a",color:"white",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>Done</button>
                </div>
              </div>
            ) : (
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:3,alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,background:CRIT_COLORS[q.criticality]+"22",color:CRIT_COLORS[q.criticality],borderRadius:4,padding:"1px 6px"}}>{q.criticality}</span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>Weight: {q.weight}</span>
                </div>
                <div style={{fontWeight:600,fontSize:14}}>{q.question}</div>
                {q.standard && <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{q.standard}</div>}
              </div>
            )}
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={() => setEditId(editId===q.id?null:q.id)} style={{background:"#f1f5f9",color:"#374151",border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12}}>✏️</button>
              <button onClick={() => remove(q.id)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────────
function AdminView({ clients, onSave }) {
  const [items, setItems] = useState(clients);
  const [newClient, setNewClient] = useState("");
  const [dirty, setDirty] = useState(false);

  const add = () => {
    if (!newClient.trim() || items.includes(newClient.trim())) return;
    setItems(prev => [...prev, newClient.trim()]);
    setNewClient("");
    setDirty(true);
  };

  const remove = (c) => { setItems(prev => prev.filter(x=>x!==c)); setDirty(true); };

  return (
    <div style={{maxWidth:500}}>
      <h2 style={{fontWeight:800,marginBottom:4}}>Client Management</h2>
      <p style={{color:"#64748b",marginBottom:24}}>Add or remove clients from the assessment system</p>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <input value={newClient} onChange={e=>setNewClient(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="New client name…"
          style={{flex:1,border:"1px solid #e2e8f0",borderRadius:8,padding:"9px 14px",fontSize:14}} />
        <button onClick={add} style={{background:"#0f172a",color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700}}>Add</button>
        {dirty && <button onClick={()=>{onSave(items);setDirty(false);}} style={{background:"#16a34a",color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700}}>Save</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {items.map(c => (
          <div key={c} style={{background:"white",borderRadius:9,padding:"12px 16px",border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:600}}>{c}</span>
            <button onClick={()=>remove(c)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:13}}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
