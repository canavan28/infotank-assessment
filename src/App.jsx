import { useState, useEffect, useCallback, useRef } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";

// ΓöÇΓöÇΓöÇ MSAL CONFIG ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const msalConfig = {
  auth: {
    clientId: "0a54654f-ae37-45ed-92f7-e18666ad80f9",
    authority: "https://login.microsoftonline.com/701012de-b85f-4128-a794-fa585f8fdf2d",
    redirectUri: "https://infotank-assessment.vercel.app",
    postLogoutRedirectUri: "https://infotank-assessment.vercel.app",
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: true },
};
const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
const loginRequest = { scopes: ["openid","profile","email","User.Read"] };

// ΓöÇΓöÇΓöÇ API LAYER ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getToken() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) throw new Error("Not signed in");
  try {
    const resp = await msalInstance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
    return resp.idToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ ...loginRequest, account: accounts[0] });
    }
    throw err;
  }
}

async function api(method, path, body) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}
const apiGet  = (path)       => api("GET",    path);
const apiPost = (path, body) => api("POST",   path, body);
const apiDel  = (path)       => api("DELETE", path);

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
  purple:'#7C3AED', purpleBg:'#F5F3FF', purpleBorder:'#DDD6FE',
};
const FONT = "'Geist','Geist Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,monospace";
const LOGO_URI = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABBALQDASIAAhEBAxEB/8QAHAABAAMBAQEBAQAAAAAAAAAAAAUGBwMEAgEI/8QASRAAAQMDAgMEAwoJCwUAAAAAAQIDBAAFEQYSByExE0FRYRQigRYXMkJxkZOhsdIIFTM2N1RzdNEjJDRSVVZicnWEspSzwuHw/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECBQQD/8QAKREAAgIBAgQFBQEAAAAAAAAAAAECEQMEIQUSEzEiMlJxgUFykcHRsf/aAAwDAQACEQMRAD8A/jKlKUArvAZTInx46iQl11KCR1AJArhX0hSkLStCilSTlKgcEHxoDSOIPD22ac04u5xZsx5xLqEbXNu3BPkKq+g4+mpFxfTqeSpiMGctKSVDK8jlyB7s1309rGexKXHvsqXdbXJT2UpiQ6pw7T8ZO48lDr/8CLJJ4RXFb61wbpDMVRy12oUF7T0zgYzV8U+nNSaTr6PsVyQ6kXFOvYootj9xvMuLYor81tC1qbDSSpXZBWArx7x89cLpbLha3ks3GE/EcWnclLqCkkdM8606w2N3hlJd1Den0S4zrXooREBKwpSkqB9baMYQe/wqp8UNTQNUXeLMt7MlptqP2ag+lIJO4nlgnlzrqeLA9O8nN477HN1MyzrHy+Gu5UaUpXEdYpSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKltPadu9+dUm3RFLbR+UeUdrbY/xKPIfJ1oCJr+roX9DY/Zp+ysECNIaZOXlDUtzR1Qg7YjavM9XPsPlXw/xK1it1S27k2wgn1W24ze1I8BlJPzmoJWxo3Hb8yUfvjf/FVYTWjN6g109p03y8RIl3sC+TiZDbISfX2ZAThQO7kDjzqL/Fek9RHNknKss5XSFOVllR8EO/x5mryxyhXMqvf4KqcZ3yu62KbSpK+2O62OT2F0hOx1H4KiMoX/AJVDkfZUbVSRSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAVOw9KXx2TDTJt0qJHlPtNCQ4ydie0UEg/XUFW88RXnY/C5qQw4pt1pMVaFpOClQUkgjzzXfpNJHPjyzb8qv/Ti1WqlhyY4peZ0U296Tseh47M29l69SHlkR46B2TWU4yVnJJHMdKquodVXa8tJiuLbiwEcm4cVPZspHyDr7amLRYdZ65ipkOTVvRWlENuzXzt3d+3kT4d1e73odS/r1p+lc+5WedxnldI7D0l5LMdlx51RwlDaSpR+QCrHqvQ9+03GEqa2y9GyEl6OsqSknpnIBHy4xV9/B+iRxabjO7NJkKkBreRzCQkHA9p+ypFFAnytZQNLfiWdGnxbPu27HoWxOd+/G8pzndz6/VVarUOKkfWqLCXr9OtbkBUlO1mKDlKsKxzKQcYz31VNKaJvupGDJgtNNxgrb2z69qSe8DAJPzVaWSU65ndbfBSMIxvlVWc7Hq67W2L6C4pq4W88lRJie0bx5Z5p9lW/T+itP60tpu1qVLs215TT0ckPICgEq9Ukg49Yda8XvQ6l/XrT9K59yuN007rrRlqceYuC0QQve6YUhW1JOBuIIB7gM4qhcrS9NXxTrnolnuUphLikIdbirUlYBIyCBjur89zGpf7vXb/onP4VN2biRqK1W1qBHENbbWcKcbKlHJJJJ3eJNarYtQz5vDJzUbwZ9NTEkPAJSQjc2VhPLPT1R31s6TRaXU7KbtK3t+TJ1Wr1On3cVTdLcwx3TmoWmlOu2G6IbQkqUpURwBIHUk45CoutJtGudXaqmjT7P4qbXObcb3ONqSANiieYJ7ge6uPvQ6l/XrT9K59ys/URwRa6Mm/dUd2B5pJ9VJexnlK0JfCPUyUFQl2pZHxQ8vJ+dFUq8Wqfabku3T4ymZKCAUdc56EEdQfKuc9zxUq+W/hVqiVFQ+tUCIVAHs33Vbx8oSk4rueEWpQCRNtJ8g659yhNGeV7ZVpusWIiZKtk1iMvGx5xhSUKyMjCiMHIrpqGy3Gw3EwLmx2TwG5ODlKk9xB7xyrVOJ/6JbR/tv8AtGgMapUzpXTV11LNMa2tJwgZcecJDbfhkgHr4DnXzqmwu6eniDJnQZMgDLiYy1K7PwCspHPyoQRFKUoBW7cTf0Tj9nG+1NYTW3cSJsN3hYGWpbC3Ozj+olwFXIpzyrZ4Y0sGov0/0yeIpvNh+7+C1TpNr4GtzYLnYyG46tiwB6pLpBPy8zWW+6/VH9v3H6dVaH6XF94f0f0lntvR8dn2g3flvDrWQVjGuzblz5V34GvTbg52z64y96yPhFDpAJ8/VFfH4P8A+bU/98/8E147VLijgOuOZLIe9HeHZlwbvyyu7rXXgPMiR9OzkyJTDKjLyAtwJJGxPjUEmRvzZkhHZvy33UZztW4VDPtrY4El+DwHTIhuqYdTGVtWg4KdzxBII6HmedYpWyaHn2O/8NvcxKuTUOSltTa0rWEq+GVJUnPwh0z7akhGRmdNLnaGZIK/63aHPz1sdilSJnA6Y7LfcfcEWQne4rccAqAGT4VXjwvi5ONX28juygffqw3t+x6U4ZSLAi8MzZDjLjbYQoblqWTz2gnAGe891QEYpW4aT/QS9/p83/k7WH1tOlpkRHBF6OuUwl70CYOzLgCslTuBjrWzwZpZcl+l/oyuLJvHCvUv2ZRpi1yb1folshuhp59ZAWT8EAEqPLwANaRc9IaMsa0Rr3qy5NSlJ3bUuAcvHaEqI7+pqi8O7nFs+s7dcJqiiO2pSVqAztCkKTn5BuzWka30naNV3RN4iaohMlbaUFJUlxKsdCCFDFYxqo/NHx9ExL/FNn1bdX5SlkIYW76juR0UOzGfn7q8PEtKVcYNNpUkEK9FyCOv84VXXSmg7bZL7Gu0nVUJ5MVW8Np2pycHqSrkPZURrC+W678W7LIhSEORor8ZlTwPqKIeKiQfAbsZ8qEk3xu1BeLVMt0W2z3ojbjanFlo7VKOcDJ648vOqXpjV+pjqO3IcvUx1tcltC0OOFSVJKgCCD5Gpzj1JjyLvbVR32ngI6gShYVj1vKqLptSUaitilKCUiW0SScADeKEPuaH+EIkenWhWBuLToJxz6p/jVtu9iTqPQ1iti5aYyFCOtSz8IgNHkkd5P8A77qp3HyTGky7QY8hp4Jbdz2awrHNPhUlxEnsjhhZ/RZrfpLSoyh2bo3oIbPPkcjBoSfXEC+p0Ra2dN6cgriFxvcZRTyweRKT8Zfie7l7MecWtxanHFKWtRJUpRyST3mtY0vqu06wtXuc1eG0ySP5GSSEhZA5HPxV/UfqNC1lp1zT9xLKZLMyKsksvtLByPBQHRXl81CGQVKUqSBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoD/2Q==";

const SERVER_QS = new Set(["sv1","sv2","sv3","sv4","sv5","sv6","sv7","sv8","gp1","gp2","gp3","gp4","gp5","gp6","gp7","gp8","gp9","pm7","pm8","pm9","ph3","ph4"]);

// Internal = tech fixes it  External = needs client budget/decision
const DEFAULT_CATALOG = [
  {id:"am1",category:"Account Management",question:"Confirm Users are in Datto SaaS",standard:"Licensing accurate; shared mailboxes backed up; no unlicensed active users.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"am2",category:"Account Management",question:"Are all users in Supported User group? Have terminated users been removed?",standard:"Accurate User List",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"am3",category:"Account Management",question:"Are all softwares using Supported User group to update users?",standard:"Confirmed - Datto SaaS, Graphus, KB4, SaaS Alerts, Dark Web all up to date",weight:2,criticality:"High",remedType:"Internal"},
  {id:"am4",category:"Account Management",question:"Date of last TBR",standard:"Date",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"am5",category:"Account Management",question:"Date of next TBR",standard:"Date",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"bk1",category:"Backup",question:"Check SaaS if backups were successful for last 30 days",standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"bk2",category:"Backup",question:"Client has Onsite and Cloud backups in place (NAS, Datto) managed by us",standard:"Backups succeed daily with alerts; all users/shared mailboxes/sites protected.",weight:2,criticality:"High",remedType:"External"},
  {id:"bk3",category:"Backup",question:"Perform a successful backup test",standard:"Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"bk4",category:"Backup",question:"Perform a successful backup test on a user.",standard:"Quarterly restore tests documented; RPO/RTO meet contract; offsite/immutable copy in place.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ig1",category:"IT Glue",question:"365/google creds stored and updated - Test",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"ig2",category:"IT Glue",question:"Add 3rd-party web/cloud/hosting logins/passwords to ITG",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"ig3",category:"IT Glue",question:"Add administrative passwords for each network device to ITG",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ig4",category:"IT Glue",question:"All documents properly named for easy searching",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig5",category:"IT Glue",question:"All information about backups is in ITG",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"ig6",category:"IT Glue",question:"All LOB applications are documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig7",category:"IT Glue",question:"All of the software licensing is documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig8",category:"IT Glue",question:"All outdated documents have been removed",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig9",category:"IT Glue",question:"All UPS devices are documented for server and network",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig10",category:"IT Glue",question:"All Vendors are documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig11",category:"IT Glue",question:"Company offboarding doc is in ITG and up to date",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig12",category:"IT Glue",question:"Company onboarding doc is in ITG and up to date",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig13",category:"IT Glue",question:"Company workstation setup doc is in ITG and up to date",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig14",category:"IT Glue",question:"Default workstation admin creds are documented",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ig15",category:"IT Glue",question:"Document all network printers",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig16",category:"IT Glue",question:"Document DNS hosting login/password in ITG",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig17",category:"IT Glue",question:"Document floorplan of the office if available",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig18",category:"IT Glue",question:"Document organizational chart if available",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig19",category:"IT Glue",question:"Document the wireless network SSID/authentication",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig20",category:"IT Glue",question:"File sharing is documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig21",category:"IT Glue",question:"Fill out company home page",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig22",category:"IT Glue",question:"ISP information is documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig23",category:"IT Glue",question:"Network diagrams are documented - if complex network",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig24",category:"IT Glue",question:"Printing is documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig25",category:"IT Glue",question:"Servers are documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ig26",category:"IT Glue",question:"Voice systems are documented",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw1",category:"Network",question:"Is the network protected by an InfoTank-Supported Sonicwall?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw2",category:"Network",question:"Are all firewall configurations backed up?",standard:"Supported firewall; current firmware; secure remote access; rules reviewed quarterly.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"nw3",category:"Network",question:"Does the firewall have the latest firmware and security license enabled?",standard:"Supported firewall; current firmware; secure remote access; rules reviewed quarterly.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw4",category:"Network",question:"Is Sonicwall software installed and up to date?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw5",category:"Network",question:"Are network switches set to alert if something goes wrong?",standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw6",category:"Network",question:"Are the APs Monitored?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw7",category:"Network",question:"Are the network devices all Ubiquiti? (Switches, APs)",standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw8",category:"Network",question:"If not what are the switches",standard:"Switch firmware current; VLANs documented; guest/IoT segmented from corporate.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw9",category:"Network",question:"If not what are the APs",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw10",category:"Network",question:"Are there strong passphrases in use for corporate wireless SSIDs?",standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"nw11",category:"Network",question:"Is direct RDP to server present?",standard:"No Direct RDP allowed",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw12",category:"Network",question:"Is network-level remote access limited to authorized staff?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw13",category:"Network",question:"Is the Guest wireless enabled and traffic is segregated?",standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw14",category:"Network",question:"Is the wireless coverage/capacity appropriate for intended use?",standard:"Business Wi-Fi uses WPA2-Enterprise/WPA3; guest isolated; default creds removed.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw15",category:"Network",question:"Is there a failover/redundant internet circuit available?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw16",category:"Network",question:"Perform failover test. Was it successful?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw17",category:"Network",question:"Is there a web content/filtering management system in place?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw18",category:"Network",question:"Is there adequate LAN capacity to support network requirements?",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"nw19",category:"Network",question:"When was last password reset - All network equipment",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"nw20",category:"Network",question:"When is next password reset - All network equipment",standard:"Network gear supported/updated; configs backed up; changes documented.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"pw1",category:"Passwords",question:"Archive old passwords",standard:"Password policy ΓëÑ12 chars; complexity on; lockout/throttle enabled; SSPR configured.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"pw2",category:"Passwords",question:"Confirm that all admin passwords have been changed since we took over",standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ph1",category:"Physical Checks",question:"Conduct an inventory of the workstations, make sure they are labeled and named properly",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ph2",category:"Physical Checks",question:"Photos of the server/network room have been taken and uploaded to ITG",standard:"Documentation current (Γëñ90 days) and complete for core services.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ph3",category:"Physical Checks",question:"Confirm all of the server/network room data cabling neatly cable managed",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ph4",category:"Physical Checks",question:"Confirm that server/network room is properly cooled",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"pm1",category:"Power Management",question:"Check that all UPS devices functioning normally with all lights green",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"pm2",category:"Power Management",question:"Confirm all servers and network equipment have adequate power",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"pm3",category:"Power Management",question:"Confirm an automated shutdown of the servers via UPS configured",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"pm4",category:"Power Management",question:"Confirm the UPS systems are not overloaded",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"pm5",category:"Power Management",question:"Confirm the UPS systems have adequate runtime capacity",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"pm6",category:"Power Management",question:"Confirm UPS devices are within life expectancy",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"pm7",category:"Power Management",question:"Confirm all servers have UPS installed",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"pm8",category:"Power Management",question:"Confirm all network equipment have UPS installed",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"pm9",category:"Power Management",question:"Run a UPS test on all UPS devices to ensure functionality",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"sc1",category:"Security",question:"Confirm all workstations and servers have S1 installed software",standard:"S1 deployed and reporting on 100% of endpoints with no critical alerts outstanding.",weight:2,criticality:"High",remedType:"External"},
  {id:"sc2",category:"Security",question:"Is Entra ID enabled for all users",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:2,criticality:"High",remedType:"External"},
  {id:"sc3",category:"Security",question:"Has company purchased vPenTest",standard:"vPenTest are purchased and on the contract",weight:2,criticality:"High",remedType:"External"},
  {id:"sc4",category:"Security",question:"Are vPenTest on schedule and properly remediated",standard:"vPenTest deployed and scheduled each quarter with no critical alerts outstanding.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"sc5",category:"Security",question:"Is MFA enabled/enforced for all users",standard:"All user accounts require MFA; break-glass accounts restricted and monitored.",weight:2,criticality:"Critical",remedType:"External"},
  {id:"sc6",category:"Security",question:"Has company purchased S1 Vigilance",standard:"S1 Vigilance was purchased and on the contract",weight:2,criticality:"High",remedType:"External"},
  {id:"sc7",category:"Security",question:"If so, has S1 Vigilance been enabled for client",standard:"S1 Vigilance deployed and reporting on 100% of endpoints with no critical alerts outstanding.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"sc8",category:"Security",question:"Has company purchased SaaS Alerts",standard:"SaaS Alerts was purchased and on the contract",weight:2,criticality:"High",remedType:"External"},
  {id:"sc9",category:"Security",question:"Are logins protected by SaaS Alerts",standard:"SaaSAlerts deployed and reporting on 100% of endpoints with no critical alerts outstanding.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"sv1",category:"Server",question:"Confirm Datto is configured on server to automatically deploy",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"sv2",category:"Server",question:"Are administrative account passwords set to be strong with a minimum of 12 mixed characters?",standard:"Password policy ΓëÑ12 chars; complexity on; lockout/throttle enabled; SSPR configured.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"sv3",category:"Server",question:"Are all servers configured with static network information?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"sv4",category:"Server",question:"Are all servers joined/bound to Active Directory domain?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"sv5",category:"Server",question:"Are all servers under current vendor warranty?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"sv6",category:"Server",question:"Are there secondary administrator accounts in place, in case of breach?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"sv7",category:"Server",question:"Do servers have adequate disk space on all volumes? Under 90%",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"sv8",category:"Server",question:"Does adequate server performance/capacity exist?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"gp1",category:"Server - GPO",question:"Are group policies deployed adhere to company standard?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp2",category:"Server - GPO",question:"Are there restrictive permissions in place to prevent unauthorized access?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp3",category:"Server - GPO",question:"Do workstations/servers/network devices auto-logoff or auto-lock?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp4",category:"Server - GPO",question:"Have all domain admin passwords been reset, and are they on a reset schedule?",standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"gp5",category:"Server - GPO",question:"Is the password policy configured in Active Directory?",standard:"Password policy ΓëÑ12 chars; complexity on; lockout/throttle enabled; SSPR configured.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"gp6",category:"Server - GPO",question:"Is there a password required immediately after sleep or when the screen saver begins?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp7",category:"Server - GPO",question:"When is next password reset",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp8",category:"Server - GPO",question:"When was last password reset",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"gp9",category:"Server - GPO",question:"Do workstations require a password immediately after sleep?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"sy1",category:"Systems",question:"Have Admin accounts been limited using principle of least access for AD/EntraID",standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ws1",category:"Workstations",question:"Are all network printers configured with an accurate name/location?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ws2",category:"Workstations",question:"Are all network printers deployed automatically?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ws3",category:"Workstations",question:"Are all workstations running the same, latest Operating System?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"ws4",category:"Workstations",question:"Are all workstations joined to AD/Azure?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"ws5",category:"Workstations",question:"Are all workstations protected against electrical surge?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:1,criticality:"Medium",remedType:"External"},
  {id:"ws6",category:"Workstations",question:"Are files automatically saved/stored on servers or OneDrive?",standard:"Meets InfoTank standard; exceptions documented with remediation plan.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"ws7",category:"Workstations",question:"Are users set to not be local administrators?",standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ws8",category:"Workstations",question:"Have all local administrator passwords been reset?",standard:"No standard users have local admin; privileged roles minimized and reviewed monthly.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"ws9",category:"Workstations",question:"Is BitLocker configured for all laptops and code stored in Datto?",standard:"Full-disk encryption enabled and escrowed for all company endpoints/servers as applicable.",weight:2,criticality:"Critical",remedType:"External"},
  {id:"eid1",category:"Entra ID",question:"Are all devices enrolled in Entra ID / Azure AD?",standard:"100% of managed devices enrolled; compliance policies applied.",weight:2,criticality:"Critical",remedType:"External"},
  {id:"eid2",category:"Entra ID",question:"Is Conditional Access configured and enforced for all users?",standard:"Baseline CA policies active; MFA required for all cloud apps; legacy auth blocked.",weight:2,criticality:"Critical",remedType:"Internal"},
  {id:"eid3",category:"Entra ID",question:"Are Conditional Access policies following Microsoft best practices?",standard:"Microsoft Secure Score CA recommendations implemented; named locations and risk policies configured.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"eid4",category:"Entra ID",question:"Is Entra ID Password Protection enabled?",standard:"Custom banned password list active; on-prem proxy deployed if hybrid.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"eid5",category:"Entra ID",question:"Are privileged roles using Entra ID PIM (Privileged Identity Management)?",standard:"No standing Global Admin assignments; PIM activated for all privileged roles.",weight:2,criticality:"Critical",remedType:"External"},
  {id:"eid6",category:"Entra ID",question:"Is Entra ID Sign-in risk and user risk policy configured?",standard:"Sign-in risk policy requires MFA on medium+ risk; user risk policy enforces password change on high risk.",weight:2,criticality:"High",remedType:"Internal"},
  {id:"eid7",category:"Entra ID",question:"Is seamless SSO configured for hybrid-joined devices?",standard:"Seamless SSO enabled for hybrid environments; SSPR deployed for self-service password reset.",weight:1,criticality:"Medium",remedType:"Internal"},
  {id:"eid8",category:"Entra ID",question:"Are guest and external accounts reviewed regularly in Entra ID?",standard:"Guest access review conducted quarterly; unused guest accounts removed; external collaboration restrictions in place.",weight:2,criticality:"High",remedType:"Internal"},
];

const DEFAULT_CLIENTS = ["AVGroup","COE","LaAmistad","Morton Construction","Phoenix","Warner Summers","Perimeter Floors","TS Adams"];
const DEFAULT_TECHS = ["Marcus Chen","Sarah Johnson","Tyler Brooks","Jordan Lee"];
const STATUSES = ["Complete","Partial","Missing","N/A"];

// ΓöÇΓöÇΓöÇ HELPERS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function scoreItem(r,weight){
  if(!r||!r.status||r.status==="N/A")return{earned:0,possible:0};
  const p=weight*2;
  return r.status==="Complete"?{earned:p,possible:p}:r.status==="Partial"?{earned:weight,possible:p}:{earned:0,possible:p};
}
function calcScore(responses,catalog){
  let e=0,p=0;
  catalog.forEach(q=>{const s=scoreItem(responses?.[q.id],q.weight);e+=s.earned;p+=s.possible;});
  const pct=p>0?Math.round((e/p)*100):0;
  let grade="F";
  if(pct>=90)grade="A";else if(pct>=80)grade="B";else if(pct>=70)grade="C";else if(pct>=60)grade="D";
  return{earned:e,possible:p,pct,grade};
}
function getPriority(q,status){
  if(status==="Missing"&&q.criticality==="Critical")return"P1";
  if(status==="Missing")return"P2";
  if(status==="Partial")return"P3";
  return null;
}
function gradeColor(g){return g==="A"?T.ok:g==="B"?T.accent:g==="C"?T.warn:T.err;}
function fmtTime(iso){if(!iso)return"";const d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}
function fmtDate(iso){if(!iso)return"Never";return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}

// Due/Overdue: new clients (no assessments) ΓåÆ due immediately, overdue after 1 month
// Existing clients ΓåÆ due at 11 months, overdue at 12 months
function getAssessmentStatus(clientName,assessments,clientCreatedAt){
  const hist=assessments[clientName]||[];
  const submitted=hist.filter(a=>a.submitted);
  if(submitted.length===0){
    // New or never assessed ΓÇö use client creation date
    const created=clientCreatedAt?new Date(clientCreatedAt):new Date(Date.now()-40*24*60*60*1000);
    const monthsOld=(Date.now()-created.getTime())/(1000*60*60*24*30);
    if(monthsOld>1)return"overdue";
    return"due";
  }
  const lastDate=new Date(submitted[submitted.length-1].date);
  const monthsAgo=(Date.now()-lastDate.getTime())/(1000*60*60*24*30);
  if(monthsAgo>=12)return"overdue";
  if(monthsAgo>=11)return"due";
  return"ok";
}
function isInProgress(clientName,assessments){
  const hist=assessments[clientName]||[];
  return hist.some(a=>!a.submitted&&Object.values(a.responses||{}).some(r=>r.status));
}

// ΓöÇΓöÇΓöÇ STORAGE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function lsGet(k){try{const v=localStorage.getItem("it10_"+k);return v?JSON.parse(v):null;}catch{return null;}}
function lsSet(k,v){try{localStorage.setItem("it10_"+k,JSON.stringify(v));}catch(e){console.error(e);}}

// ΓöÇΓöÇΓöÇ PRIMITIVES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function CritBadge({kind}){
  const s=kind==="Critical"?{bg:T.critBg,fg:T.critInk}:kind==="High"?{bg:T.hiBg,fg:T.hiInk}:{bg:T.medBg,fg:T.medInk};
  return <span style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.4,textTransform:"uppercase",padding:"2px 6px",borderRadius:4,background:s.bg,color:s.fg,whiteSpace:"nowrap"}}>{kind}</span>;
}
function TypeBadge({t}){
  const ext=t==="External";
  return <span style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.4,textTransform:"uppercase",padding:"2px 6px",borderRadius:4,background:ext?T.purpleBg:T.accentBg,color:ext?T.purple:T.accentInk,whiteSpace:"nowrap",border:`1px solid ${ext?T.purpleBorder:T.border}`}}>{t||"ΓÇö"}</span>;
}
function Eyebrow({children}){
  return <div style={{fontFamily:MONO,fontSize:10,fontWeight:600,letterSpacing:0.6,color:T.muted,textTransform:"uppercase",marginBottom:4}}>{children}</div>;
}
function PriorityPill({p}){
  const c=p==="P1"?T.err:p==="P2"?T.warn:T.accentInk;
  const bg=p==="P1"?T.errBg:p==="P2"?T.warnBg:T.accentBg;
  return <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:c,padding:"3px 8px",borderRadius:4,background:bg}}>{p}</span>;
}
function useIsMobile(){
  const [m,setM]=useState(()=>window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return m;
}

// ΓöÇΓöÇΓöÇ ARCHIVE MODAL ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function ArchiveModal({item,onConfirm,onCancel}){
  const [note,setNote]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(11,23,41,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}}>
      <div style={{background:T.card,borderRadius:14,padding:24,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:18,color:T.ink,marginBottom:4}}>Archive Finding</div>
        <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginBottom:6}}><strong>{item.client}</strong> ┬╖ {item.question}</div>
        <div style={{fontFamily:FONT,fontSize:12,color:T.warn,marginBottom:16,padding:"8px 12px",background:T.warnBg,borderRadius:8}}>This item stays on the score but disappears from the work queue. A note is required.</div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Why is this being archived? (e.g. Client declined ΓÇö budget constraint)" rows={3}
          style={{width:"100%",fontFamily:FONT,fontSize:14,color:T.ink,border:`1.5px solid ${note.trim().length>5?T.ok:T.border}`,borderRadius:8,padding:"10px 12px",resize:"none",outline:"none",boxSizing:"border-box",marginBottom:16}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px 0",background:"white",border:`1px solid ${T.border}`,borderRadius:8,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:14,color:T.muted}}>Cancel</button>
          <button onClick={()=>note.trim().length>5&&onConfirm(note.trim())} disabled={note.trim().length<=5} style={{flex:2,padding:"10px 0",background:note.trim().length>5?T.navy:"#e2e8f0",border:"none",borderRadius:8,cursor:note.trim().length>5?"pointer":"default",fontFamily:FONT,fontWeight:700,fontSize:14,color:note.trim().length>5?"white":T.muted}}>Archive Finding</button>
        </div>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ MAIN APP ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

// ΓöÇΓöÇΓöÇ LOGIN SCREEN ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function LoginScreen({onLogin,error}){
  const [loading,setLoading]=useState(false);
  const handleLogin=async()=>{
    setLoading(true);
    try{await msalInstance.loginRedirect(loginRequest);}
    catch(e){console.error(e);setLoading(false);}
  };
  return(
    <div style={{minHeight:"100vh",background:"#0B1729",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Geist','Geist Sans',system-ui,sans-serif",padding:24}}>
      <div style={{background:"#FFFFFF",borderRadius:16,padding:"40px 36px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}}>
        <img src={LOGO_URI} alt="InfoTank" style={{height:48,width:"auto",objectFit:"contain",marginBottom:24}}/>
        <div style={{fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:22,color:"#0F172A",marginBottom:8}}>Assessment Platform</div>
        <div style={{fontFamily:"'Geist',sans-serif",fontSize:14,color:"#64748B",marginBottom:32,lineHeight:1.55}}>Sign in with your InfoTank Microsoft account to continue.</div>
        {error&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",marginBottom:16,fontFamily:"'Geist',sans-serif",fontSize:13,color:"#B91C1C"}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"13px 0",background:loading?"#e2e8f0":"#0B1729",color:loading?"#64748B":"white",border:"none",borderRadius:10,cursor:loading?"default":"pointer",fontFamily:"'Geist',sans-serif",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>
          {loading?"Signing inΓÇª":"Sign in with Microsoft"}
        </button>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ MAIN APP ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export default function App(){
  const [authState,setAuthState]=useState("loading");
  const [user,setUser]=useState(null);
  const [catalog,setCatalog]=useState(DEFAULT_CATALOG);
  const [clients,setClients]=useState(DEFAULT_CLIENTS);
  const [clientMeta,setClientMeta]=useState({});
  const [techs,setTechs]=useState(DEFAULT_TECHS);
  const [assessments,setAssessments]=useState({});
  const [archived,setArchived]=useState({});
  const [dataLoaded,setDataLoaded]=useState(false);
  const [dataError,setDataError]=useState(null);
  const [view,setView]=useState("home");
  const [activeClient,setActiveClient]=useState(null);
  const [savedMsg,setSavedMsg]=useState("");
  const isMobile=useIsMobile();

  useEffect(()=>{
    msalInstance.handleRedirectPromise().then(result=>{
      // result is non-null when returning from a redirect login
      const accounts=msalInstance.getAllAccounts();
      if(accounts.length>0)setAuthState("loggedIn");
      else setAuthState("loggedOut");
    }).catch(err=>{
      console.error("Redirect error:",err);
      setAuthState("loggedOut");
    });
  },[]);

  useEffect(()=>{
    if(authState!=="loggedIn")return;
    (async()=>{
      try{
        const [meRes,catalogRes,clientsRes,clientMetaRes,techsRes,assessmentsRes,archivedRes]=await Promise.all([
          apiGet("/api/me"),
          apiGet("/api/kv/catalog"),
          apiGet("/api/kv/clients"),
          apiGet("/api/kv/clientMeta"),
          apiGet("/api/kv/techs"),
          apiGet("/api/assessments"),
          apiGet("/api/archived"),
        ]);
        setUser(meRes);
        if(catalogRes.value)setCatalog(catalogRes.value);
        if(clientsRes.value)setClients(clientsRes.value);
        if(clientMetaRes.value)setClientMeta(clientMetaRes.value);
        if(techsRes.value)setTechs(techsRes.value);
        setAssessments(assessmentsRes.assessments||{});
        setArchived(archivedRes.archived||{});
        setDataLoaded(true);
      }catch(err){
        console.error("Load error:",err);
        setDataError(err.message);
        setDataLoaded(true);
      }
    })();
  },[authState]);

  const showSaved=()=>{setSavedMsg("SAVED");setTimeout(()=>setSavedMsg(""),1500);};

  const saveKV=async(key,value)=>{await apiPost(`/api/kv/${key}`,{value});showSaved();};

  const saveAssessments=async(newAsm)=>{
    setAssessments(newAsm);
    // Find which client changed and save just that client's latest entry
    for(const client of Object.keys(newAsm)){
      const hist=newAsm[client]||[];
      if(hist.length===0)continue;
      const latest=hist[hist.length-1];
      const id=latest._id;
      await apiPost(`/api/assessments/${client}`,{data:latest,submitted:!!latest.submitted,assessmentId:id});
    }
    showSaved();
  };

  const archiveItem=async(client,qid,note)=>{
    const key=`${client}__${qid}`;
    await apiPost(`/api/archived/${key}`,{note});
    setArchived(prev=>({...prev,[key]:{note,archivedAt:new Date().toISOString()}}));
  };

  const unarchiveItem=async(client,qid)=>{
    const key=`${client}__${qid}`;
    await apiDel(`/api/archived/${key}`);
    setArchived(prev=>{const n={...prev};delete n[key];return n;});
  };

  const isArchived=(client,qid)=>!!archived[`${client}__${qid}`];
  const isManager=user?.role==="manager";

  const allNavItems=[
    {id:"home",      label:"Home",        icon:<HomeIcon/>,    roles:["tech","manager"]},
    {id:"assess",    label:"Assessment",  icon:<AssessIcon/>,  roles:["tech","manager"]},
    {id:"dashboard", label:"Dashboard",   icon:<DashIcon/>,    roles:["tech","manager"]},
    {id:"remediation",label:"Remediation",icon:<RemIcon/>,     roles:["tech","manager"]},
    {id:"assessors", label:"Assessors",   icon:<StatsIcon/>,   roles:["manager"]},
    {id:"manage",    label:"Questions",   icon:<QIcon/>,       roles:["manager"]},
    {id:"clients",   label:"Clients",     icon:<ClientsIcon/>, roles:["tech","manager"]},
  ];
  const navItems=allNavItems.filter(n=>n.roles.includes(user?.role||"tech"));
  const mobileNavItems=navItems.filter(n=>!["assessors","manage"].includes(n.id));

  const handleSignOut=()=>{msalInstance.logoutRedirect();setUser(null);};

  if(authState==="loading")return(
    <div style={{minHeight:"100vh",background:"#0B1729",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Geist',sans-serif",color:"#94A3B8",fontSize:14}}>LoadingΓÇª</div>
  );
  if(authState==="loggedOut")return <LoginScreen onLogin={()=>setAuthState("loggedIn")}/>;
  if(!dataLoaded)return(
    <div style={{minHeight:"100vh",background:"#F4F5F7",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Geist',sans-serif",color:"#64748B",fontSize:14}}>
      {dataError?`Error: ${dataError} ΓÇö check Railway API connection`:"Loading dataΓÇª"}
    </div>
  );

  return(
    <div style={{fontFamily:FONT,minHeight:"100vh",background:T.bg,color:T.ink,maxWidth:"100vw",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      {!isMobile&&(
        <div style={{background:T.navy,color:"#E8EDF5",borderBottom:`1px solid ${T.navyEdge}`,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,maxWidth:1400,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <img src={LOGO_URI} alt="InfoTank" style={{height:30,width:"auto",objectFit:"contain"}}/>
              <div style={{width:1,height:22,background:T.navyEdge}}/>
              <div style={{display:"flex",gap:2}}>
                {navItems.map(n=>{const active=view===n.id;return(
                  <button key={n.id} onClick={()=>setView(n.id)} style={{padding:"8px 13px",borderRadius:6,background:active?"rgba(79,179,199,0.14)":"transparent",color:active?"#fff":"#94A3B8",border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:active?600:500,position:"relative"}}>
                    {n.label}{active&&<div style={{position:"absolute",left:13,right:13,bottom:-1,height:2,background:T.accentGlow}}/>}
                  </button>
                );})}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {savedMsg&&<span style={{fontFamily:MONO,fontSize:11,color:T.accentGlow,letterSpacing:0.4}}>{savedMsg}</span>}
              {user&&(
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:FONT,fontSize:13,fontWeight:600,color:"#E8EDF5"}}>{user.name}</div>
                    <div style={{fontFamily:MONO,fontSize:10,color:"#7B8AA3",textTransform:"uppercase",letterSpacing:0.3}}>{user.role}</div>
                  </div>
                  <button onClick={handleSignOut} style={{background:"rgba(255,255,255,0.08)",color:"#94A3B8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600}}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isMobile&&(
        <div style={{background:T.navy,position:"sticky",top:0,zIndex:100,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <img src={LOGO_URI} alt="InfoTank" style={{height:26,width:"auto",objectFit:"contain"}}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {savedMsg&&<span style={{fontFamily:MONO,fontSize:10,color:T.accentGlow}}>{savedMsg}</span>}
            {user&&<span style={{fontFamily:FONT,fontSize:12,color:"#94A3B8"}}>{user.name.split(" ")[0]}</span>}
          </div>
        </div>
      )}
      <div style={{maxWidth:isMobile?"100%":1400,margin:"0 auto",padding:isMobile?"16px 0 80px":"28px 24px"}}>
        {view==="home"&&<HomeView clients={clients} clientMeta={clientMeta} assessments={assessments} catalog={catalog} archived={archived} isMobile={isMobile} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}}/>}
        {view==="assess"&&<AssessView clients={clients} catalog={catalog} assessments={assessments} techs={techs} activeClient={activeClient} setActiveClient={setActiveClient} isMobile={isMobile} onSave={saveAssessments}/>}
        {view==="dashboard"&&<DashboardView clients={clients} assessments={assessments} catalog={catalog} activeClient={activeClient} setActiveClient={setActiveClient} isMobile={isMobile}/>}
        {view==="remediation"&&<RemediationView clients={clients} assessments={assessments} catalog={catalog} techs={techs} archived={archived} isMobile={isMobile} onArchive={archiveItem} onUnarchive={unarchiveItem} isArchived={isArchived} onNavigate={c=>{setActiveClient(c);setView("assess");}}/>}
        {view==="assessors"&&isManager&&<AssessorsView assessments={assessments} catalog={catalog} techs={techs} clients={clients} isMobile={isMobile} onSaveTechs={async t=>{setTechs(t);await saveKV("techs",t);}}/>}
        {view==="manage"&&isManager&&<ManageView catalog={catalog} techs={techs} isMobile={isMobile} onSave={async c=>{setCatalog(c);await saveKV("catalog",c);}}/>}
        {view==="clients"&&<ClientsView clients={clients} clientMeta={clientMeta} assessments={assessments} catalog={catalog} isMobile={isMobile} onSave={async(c,m)=>{setClients(c);setClientMeta(m);await saveKV("clients",c);await saveKV("clientMeta",m);}} onStart={c=>{setActiveClient(c);setView("assess");}} onDashboard={c=>{setActiveClient(c);setView("dashboard");}}/>}
      </div>
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.navy,borderTop:`1px solid ${T.navyEdge}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {mobileNavItems.map(n=>{const active=view===n.id;return(
            <button key={n.id} onClick={()=>setView(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 2px 8px",background:"transparent",border:"none",cursor:"pointer",color:active?T.accentGlow:"#64748B",position:"relative"}}>
              <span style={{fontSize:18}}>{n.icon}</span>
              <span style={{fontFamily:FONT,fontSize:9,fontWeight:active?700:500}}>{n.label}</span>
              {active&&<div style={{position:"absolute",top:0,left:"10%",right:"10%",height:2,background:T.accentGlow,borderRadius:1}}/>}
            </button>
          );})}
        </div>
      )}
    </div>
  );
}
function HomeIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;}
function AssessIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;}
function DashIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;}
function RemIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;}
function StatsIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;}
function QIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;}
function ClientsIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;}

// ΓöÇΓöÇΓöÇ HOME VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function HomeView({clients,clientMeta,assessments,catalog,archived,isMobile,onStart,onDashboard}){
  const [activeFilter,setActiveFilter]=useState(null);
  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  const summaries=clients.map(c=>{
    const hist=assessments[c]||[];
    const submitted=hist.filter(a=>a.submitted);
    const last=submitted[submitted.length-1];
    const inProg=isInProgress(c,assessments);
    const status=getAssessmentStatus(c,assessments,clientMeta[c]?.createdAt);
    const p1count=last?catalog.filter(q=>{const r=last.responses?.[q.id];return r&&r.status==="Missing"&&q.criticality==="Critical"&&!archived[`${c}__${q.id}`];}).length:0;
    return{client:c,pct:last?calcScore(last.responses,catalog).pct:null,grade:last?calcScore(last.responses,catalog).grade:null,date:last?.date,inProg,status,p1count};
  });

  const kpis=[
    {id:"all",    label:"Active Clients",   value:clients.length,    color:T.ink,     bg:T.card,      border:T.border},
    {id:"due",    label:"Due Soon",         value:summaries.filter(s=>s.status==="due").length,    color:T.warn,    bg:T.warnBg,    border:T.warnBorder},
    {id:"overdue",label:"Overdue",          value:summaries.filter(s=>s.status==="overdue").length, color:T.err,     bg:T.errBg,     border:T.errBorder},
    {id:"p1",     label:"P1 Findings",      value:summaries.reduce((a,s)=>a+s.p1count,0),          color:T.err,     bg:T.errBg,     border:T.errBorder},
    {id:"inprog", label:"In Progress",      value:summaries.filter(s=>s.inProg).length,             color:T.purple,  bg:T.purpleBg,  border:T.purpleBorder},
  ];

  const filtered=summaries.filter(s=>{
    if(!activeFilter||activeFilter==="all")return true;
    if(activeFilter==="due")return s.status==="due";
    if(activeFilter==="overdue")return s.status==="overdue";
    if(activeFilter==="p1")return s.p1count>0;
    if(activeFilter==="inprog")return s.inProg;
    return true;
  });

  const ClientCard=({s})=>{
    const statusLabel=s.status==="overdue"?"OVERDUE":s.status==="due"?"DUE SOON":null;
    const statusColor=s.status==="overdue"?T.err:s.status==="due"?T.warn:null;
    const btnLabel=s.inProg?"Resume Assessment":s.pct!=null?"New Assessment":"Start Assessment";
    return(
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${s.status==="overdue"?T.errBorder:s.status==="due"?T.warnBorder:T.border}`,overflow:"hidden"}}>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>{s.client}</div>
              {statusLabel&&<div style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:statusColor,letterSpacing:0.5,marginTop:2}}>{statusLabel}</div>}
            </div>
            {s.grade&&<div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:gradeColor(s.grade),letterSpacing:-1,marginLeft:8}}>{s.grade}</div>}
          </div>
          {s.pct!=null?(
            <>
              <div style={{height:5,background:T.bg,borderRadius:999,overflow:"hidden",marginBottom:5}}>
                <div style={{height:"100%",width:`${s.pct}%`,background:s.pct>=80?T.ok:s.pct>=60?T.warn:T.err,borderRadius:999}}/>
              </div>
              <div style={{fontFamily:MONO,fontSize:11,color:T.muted}}>{s.pct}% ┬╖ {fmtDate(s.date)}{s.inProg&&<span style={{color:T.purple,fontWeight:700}}> ┬╖ IN PROGRESS</span>}</div>
            </>
          ):<div style={{fontFamily:FONT,fontSize:12,color:T.muted}}>{s.inProg?"Assessment in progress ΓÇö not yet submitted":"No assessment yet"}</div>}
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
          <button onClick={()=>onStart(s.client)} style={{flex:1,padding:"11px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",borderRadius:s.pct?"0 0 0 12px":"0 0 12px 12px"}}>
            {btnLabel}
          </button>
          {s.pct&&<button onClick={()=>onDashboard(s.client)} style={{flex:1,padding:"11px 0",background:"transparent",border:"none",borderLeft:`1px solid ${T.border}`,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderRadius:"0 0 12px 0"}}>Dashboard</button>}
        </div>
      </div>
    );
  };

  return(
    <div style={{padding:isMobile?"0 16px":"0"}}>
      {!isMobile&&<div style={{marginBottom:24}}><Eyebrow>{today}</Eyebrow><h1 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:T.ink,margin:"4px 0 0",letterSpacing:-0.5}}>Good morning.</h1></div>}
      {isMobile&&<div style={{padding:"16px 0 12px"}}><div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",marginBottom:4}}>{today}</div><div style={{fontFamily:FONT,fontWeight:700,fontSize:24,color:T.ink}}>Good morning.</div></div>}

      {/* KPI cards ΓÇö clickable filters */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(5,1fr)",gap:10,marginBottom:20}}>
        {kpis.map(k=>{
          const active=activeFilter===k.id||(k.id==="all"&&!activeFilter);
          return(
            <button key={k.id} onClick={()=>setActiveFilter(activeFilter===k.id&&k.id!=="all"?null:k.id)} style={{background:active?k.bg:T.card,borderRadius:10,padding:"14px 16px",border:`2px solid ${active?k.border:T.border}`,cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
              <div style={{fontFamily:MONO,fontSize:9,fontWeight:600,letterSpacing:0.5,color:active?k.color:T.muted,textTransform:"uppercase",marginBottom:4}}>{k.label}</div>
              <div style={{fontFamily:MONO,fontSize:28,fontWeight:600,color:active?k.color:T.ink,letterSpacing:-1,lineHeight:1}}>{k.value}</div>
            </button>
          );
        })}
      </div>

      {activeFilter&&activeFilter!=="all"&&(
        <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginBottom:12}}>
          Showing {filtered.length} client{filtered.length!==1?"s":""} ┬╖ <button onClick={()=>setActiveFilter(null)} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontWeight:600,fontFamily:FONT,fontSize:13,padding:0}}>Clear filter</button>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtered.map(s=><ClientCard key={s.client} s={s}/>)}
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ INTAKE MODAL ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function IntakeModal({onConfirm,onCancel}){
  const [hasServer,setHasServer]=useState(null);
  const [hasEntra,setHasEntra]=useState(null);
  const ready=hasServer!==null&&hasEntra!==null;
  const Opt=({val,cur,set,label,color})=>(
    <button onClick={()=>set(val)} style={{flex:1,padding:"14px 8px",borderRadius:10,border:`2px solid ${cur===val?(color||T.accent):T.border}`,background:cur===val?(color||T.accent)+"18":"white",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:15,color:cur===val?(color||T.accentInk):T.muted}}>{label}</button>
  );
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(11,23,41,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}>
      <div style={{background:T.card,borderRadius:16,padding:28,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink,marginBottom:6}}>Before we begin</div>
        <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginBottom:24}}>Answer two quick questions to customise this assessment.</div>
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,marginBottom:10}}>Does this client have an on-premises server?</div>
          <div style={{display:"flex",gap:10}}>
            <Opt val={true} cur={hasServer} set={setHasServer} label="Yes" color={T.ok}/>
            <Opt val={false} cur={hasServer} set={setHasServer} label="No" color={T.err}/>
          </div>
          {hasServer===false&&<div style={{marginTop:8,padding:"8px 12px",background:T.warnBg,borderRadius:8,fontFamily:FONT,fontSize:12,color:T.warn}}>Server, Server-GPO, and related power/physical questions will be set to N/A automatically.</div>}
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,marginBottom:10}}>Is this client enrolled in Entra ID?</div>
          <div style={{display:"flex",gap:10}}>
            <Opt val={true} cur={hasEntra} set={setHasEntra} label="Yes" color={T.ok}/>
            <Opt val={false} cur={hasEntra} set={setHasEntra} label="No" color={T.err}/>
          </div>
          {hasEntra===true&&<div style={{marginTop:8,padding:"8px 12px",background:T.okBg,borderRadius:8,fontFamily:FONT,fontSize:12,color:T.ok}}>Entra ID specific questions will be included.</div>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"11px 0",background:"white",border:`1px solid ${T.border}`,borderRadius:9,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:14,color:T.muted}}>Cancel</button>
          <button onClick={()=>ready&&onConfirm({hasServer,hasEntra})} disabled={!ready} style={{flex:2,padding:"11px 0",background:ready?T.navy:"#e2e8f0",border:"none",borderRadius:9,cursor:ready?"pointer":"default",fontFamily:FONT,fontWeight:700,fontSize:14,color:ready?"white":T.muted}}>Start Assessment</button>
        </div>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ ASSESS VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function AssessView({clients,catalog,assessments,techs,activeClient,setActiveClient,isMobile,onSave}){
  const [client,setClient]=useState(activeClient||clients[0]);
  const [responses,setResponses]=useState({});
  const [intake,setIntake]=useState(null);
  const [showIntake,setShowIntake]=useState(false);
  const [activeCategory,setActiveCategory]=useState("all");
  const [activeQId,setActiveQId]=useState(null);
  const [search,setSearch]=useState("");
  const [statusFilters,setStatusFilters]=useState([]); // multi-select
  const [mobileDetail,setMobileDetail]=useState(false);
  const [submitted,setSubmitted]=useState(false);

  const effectiveCatalog=intake?catalog.filter(q=>{
    if(q.category==="Entra ID"&&!intake.hasEntra)return false;
    return true;
  }):catalog.filter(q=>q.category!=="Entra ID");

  const categories=[...new Set(effectiveCatalog.map(q=>q.category))];

  useEffect(()=>{
    if(!client)return;
    const hist=assessments[client]||[];
    // Find in-progress draft first, then last submitted
    const draft=hist.find(a=>!a.submitted&&Object.values(a.responses||{}).some(r=>r.status));
    const last=hist.filter(a=>a.submitted).slice(-1)[0];
    const base=draft||last;
    if(base){
      setResponses({...base.responses});
      setIntake(base.intake||{hasServer:true,hasEntra:false});
      setSubmitted(false);
      setShowIntake(false);
    } else {
      setResponses({});
      setIntake(null);
      setSubmitted(false);
      setShowIntake(true);
    }
    setActiveQId(null);setMobileDetail(false);setStatusFilters([]);
  },[client]);

  const autoSave=useCallback((newResp,intakeData,isSubmitted=false)=>{
    const hist=assessments[client]||[];
    const draftIdx=hist.findIndex(a=>!a.submitted&&Object.values(a.responses||{}).some(r=>r.status));
    const entry={date:draftIdx>=0?hist[draftIdx].date:new Date().toISOString(),responses:newResp,intake:intakeData||intake,updatedAt:new Date().toISOString(),submitted:isSubmitted};
    let newHist;
    if(draftIdx>=0){newHist=[...hist.slice(0,draftIdx),entry,...hist.slice(draftIdx+1)];}
    else{newHist=[...hist,entry];}
    onSave({...assessments,[client]:newHist});
  },[assessments,client,intake,onSave]);

  const setResp=(id,field,val,noSave)=>{
    setResponses(prev=>{
      const updated={...prev,[id]:{...(prev[id]||{}),[field]:val,...(field==="status"?{answeredAt:new Date().toISOString()}:{})}};
      if(!noSave)autoSave(updated,null,false);
      return updated;
    });
  };

  const handleIntakeConfirm=(intakeData)=>{
    setIntake(intakeData);setShowIntake(false);
    let init={};
    if(!intakeData.hasServer){
      SERVER_QS.forEach(qid=>{init[qid]={status:"N/A",answeredAt:new Date().toISOString(),assessor:"System"};});
    }
    setResponses(init);
    autoSave(init,intakeData,false);
    setActiveQId(effectiveCatalog[0]?.id||null);
  };

  const handleSubmit=()=>{
    autoSave(responses,intake,true);
    setSubmitted(true);
  };

  const toggleStatusFilter=s=>setStatusFilters(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s]);

  const answered=Object.values(responses).filter(r=>r.status).length;
  const unanswered=effectiveCatalog.filter(q=>!responses[q.id]?.status);

  const filteredQ=effectiveCatalog.filter(q=>{
    if(activeCategory!=="all"&&q.category!==activeCategory)return false;
    if(search&&!q.question.toLowerCase().includes(search.toLowerCase()))return false;
    if(statusFilters.length>0){
      const st=responses[q.id]?.status||null;
      if(statusFilters.includes("Unanswered")&&!st)return true;
      if(st&&statusFilters.includes(st))return true;
      if(!statusFilters.includes("Unanswered")&&!st)return false;
      if(st&&!statusFilters.includes(st))return false;
      return false;
    }
    return true;
  });

  const activeQ=effectiveCatalog.find(q=>q.id===activeQId);
  const activeR=responses[activeQId]||{};

  const statusColors={
    Complete:{active:{bg:T.ok,border:T.ok,text:"#fff"},inactive:{bg:T.okBg,border:T.okBorder,text:T.ok}},
    Partial:{active:{bg:T.warn,border:T.warn,text:"#fff"},inactive:{bg:T.warnBg,border:T.warnBorder,text:T.warn}},
    Missing:{active:{bg:T.err,border:T.err,text:"#fff"},inactive:{bg:T.errBg,border:T.errBorder,text:T.err}},
    "N/A":{active:{bg:T.na,border:T.na,text:"#fff"},inactive:{bg:T.naBg,border:T.naBorder,text:T.na}},
  };

  const StatusFilterPills=()=>(
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
      {[...STATUSES,"Unanswered"].map(s=>{
        const active=statusFilters.includes(s);
        const color=s==="Complete"?T.ok:s==="Partial"?T.warn:s==="Missing"?T.err:s==="N/A"?T.na:T.purple;
        return(
          <button key={s} onClick={()=>toggleStatusFilter(s)} style={{padding:"4px 12px",borderRadius:999,border:`1.5px solid ${active?color:T.border}`,background:active?color+"18":"white",color:active?color:T.muted,cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>
            {s}{s==="Unanswered"&&<span style={{marginLeft:4,fontFamily:MONO,fontSize:10}}>({unanswered.length})</span>}
          </button>
        );
      })}
      {statusFilters.length>0&&<button onClick={()=>setStatusFilters([])} style={{padding:"4px 12px",borderRadius:999,border:`1px solid ${T.border}`,background:"white",color:T.muted,cursor:"pointer",fontFamily:FONT,fontSize:12}}>Clear</button>}
    </div>
  );

  const TechSelect=({qid,value})=>(
    <select value={value||""} onChange={e=>setResp(qid,"assessor",e.target.value)} style={{fontFamily:FONT,fontSize:12,color:T.ink,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 8px",background:"white",cursor:"pointer",width:"100%"}}>
      <option value="">ΓÇö Assign assessor ΓÇö</option>
      {techs.map(t=><option key={t} value={t}>{t}</option>)}
    </select>
  );

  if(showIntake) return <IntakeModal onConfirm={handleIntakeConfirm} onCancel={()=>setShowIntake(false)}/>;

  // Submit confirmation banner
  const SubmitBanner=()=>(
    <div style={{background:submitted?T.okBg:T.navy,border:`1px solid ${submitted?T.okBorder:T.navyEdge}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      {submitted?(
        <div style={{fontFamily:FONT,fontSize:14,color:T.ok,fontWeight:600}}>Γ£ô Assessment submitted successfully</div>
      ):(
        <>
          <div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:"#E8EDF5"}}>Ready to submit?</div>
            <div style={{fontFamily:FONT,fontSize:12,color:"#94A3B8",marginTop:2}}>Only click Submit when the assessment is fully complete. Progress auto-saves as you go.</div>
          </div>
          <button onClick={handleSubmit} style={{background:T.ok,color:"white",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14,whiteSpace:"nowrap",flexShrink:0}}>Submit Assessment</button>
        </>
      )}
    </div>
  );

  // ΓöÇΓöÇ MOBILE ΓöÇΓöÇ
  if(isMobile){
    if(mobileDetail&&activeQ){
      return(
        <div style={{padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0 14px"}}>
            <button onClick={()=>setMobileDetail(false)} style={{background:"transparent",border:"none",cursor:"pointer",color:T.accent,fontFamily:FONT,fontWeight:600,fontSize:14,padding:0}}>ΓÇ╣ Back</button>
            <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{answered}/{effectiveCatalog.length}</span>
          </div>
          <SubmitBanner/>
          <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px",marginBottom:12}}>
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
              <CritBadge kind={activeQ.criticality}/>
              <TypeBadge t={activeQ.remedType}/>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{activeQ.category.toUpperCase()}</span>
            </div>
            <div style={{fontFamily:FONT,fontWeight:600,fontSize:16,color:T.ink,lineHeight:1.35,marginBottom:6}}>{activeQ.question}</div>
            <div style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{activeQ.standard}</div>
          </div>
          <div style={{marginBottom:12}}><Eyebrow>Assessor</Eyebrow><TechSelect qid={activeQ.id} value={activeR.assessor}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            {STATUSES.map(s=>{const isActive=activeR.status===s;const sc=statusColors[s][isActive?"active":"inactive"];return<button key={s} onClick={()=>setResp(activeQ.id,"status",isActive?null:s)} style={{padding:"16px 8px",borderRadius:12,border:`2px solid ${sc.border}`,background:sc.bg,color:sc.text,cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14}}>{s}</button>;})}
          </div>
          {activeR.answeredAt&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginBottom:10}}>ANSWERED ┬╖ {fmtTime(activeR.answeredAt)}</div>}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <Eyebrow>Notes</Eyebrow>
            <textarea value={activeR.notes||""} onChange={e=>setResp(activeQ.id,"notes",e.target.value,true)} onBlur={()=>autoSave(responses,null,false)} placeholder="Add contextΓÇª" rows={3} style={{width:"100%",fontFamily:FONT,fontSize:14,color:T.ink,border:"none",outline:"none",resize:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0",marginTop:4}}/>
          </div>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <Eyebrow>Evidence Link</Eyebrow>
            <input value={activeR.evidence||""} onChange={e=>setResp(activeQ.id,"evidence",e.target.value,true)} onBlur={()=>autoSave(responses,null,false)} placeholder="https://ΓÇª" style={{width:"100%",fontFamily:MONO,fontSize:13,color:T.accentInk,border:"none",outline:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0"}}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            {(()=>{const idx=filteredQ.findIndex(q=>q.id===activeQId);const prev=filteredQ[idx-1];const next=filteredQ[idx+1];return(<>
              <button onClick={()=>prev&&setActiveQId(prev.id)} disabled={!prev} style={{flex:1,padding:"12px 0",background:prev?T.card:"transparent",border:`1px solid ${T.border}`,borderRadius:10,cursor:prev?"pointer":"default",fontFamily:FONT,fontWeight:600,fontSize:14,color:prev?T.ink:T.muted,opacity:prev?1:0.4}}>ΓÇ╣ Prev</button>
              <button onClick={()=>next&&setActiveQId(next.id)} disabled={!next} style={{flex:1,padding:"12px 0",background:next?T.navy:T.card,border:`1px solid ${next?T.navy:T.border}`,borderRadius:10,cursor:next?"pointer":"default",fontFamily:FONT,fontWeight:600,fontSize:14,color:next?"#fff":T.muted,opacity:next?1:0.4}}>Next ΓÇ║</button>
            </>);})()}
          </div>
        </div>
      );
    }
    return(
      <div>
        <div style={{padding:"10px 16px",background:T.card,borderBottom:`1px solid ${T.border}`,position:"sticky",top:56,zIndex:50}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{flex:1,fontFamily:FONT,fontWeight:700,fontSize:14,color:T.ink,background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer"}}>
              {clients.map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={()=>setShowIntake(true)} style={{background:T.navyAlt,color:"#94A3B8",border:"none",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontFamily:MONO,fontSize:9,fontWeight:600}}>INTAKE</button>
          </div>
          <div style={{height:4,background:T.bg,borderRadius:999,overflow:"hidden",marginBottom:6}}>
            <div style={{height:"100%",width:`${effectiveCatalog.length>0?(answered/effectiveCatalog.length)*100:0}%`,background:T.accent,borderRadius:999}}/>
          </div>
          <StatusFilterPills/>
          <div style={{display:"flex",gap:5,overflowX:"auto",scrollbarWidth:"none",marginTop:8,paddingBottom:2}}>
            {["all",...categories].map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)} style={{whiteSpace:"nowrap",padding:"4px 10px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:11,fontWeight:600,background:activeCategory===cat?T.navy:T.bg,color:activeCategory===cat?"#fff":T.muted,flexShrink:0}}>
                {cat==="all"?"All":cat}
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:"10px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <SubmitBanner/>
          {filteredQ.map(q=>{
            const r=responses[q.id]||{};
            const sc=r.status==="Complete"?T.ok:r.status==="Partial"?T.warn:r.status==="Missing"?T.err:r.status==="N/A"?T.na:T.border;
            return(
              <div key={q.id} onClick={()=>{setActiveQId(q.id);setMobileDetail(true);}} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,borderLeft:`4px solid ${sc}`,padding:"12px 14px",cursor:"pointer"}}>
                <div style={{display:"flex",gap:6,marginBottom:5,alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}><CritBadge kind={q.criticality}/><TypeBadge t={q.remedType}/></div>
                  {r.status&&<span style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:sc}}>{r.status.toUpperCase()}</span>}
                </div>
                <div style={{fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.4,fontWeight:500}}>{q.question}</div>
                {r.assessor&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginTop:3}}>{r.assessor}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ΓöÇΓöÇ DESKTOP 3-PANE ΓöÇΓöÇ
  return(
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      <SubmitBanner/>
      <div style={{display:"grid",gridTemplateColumns:"220px minmax(0,360px) 1fr",gap:0,height:"calc(100vh - 160px)",background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",minWidth:0}}>
        {/* Left */}
        <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.bg,height:"calc(100vh - 160px)",overflow:"hidden"}}>
          <div style={{padding:"12px 14px 10px",borderBottom:`1px solid ${T.border}`}}>
            <Eyebrow>Client</Eyebrow>
            <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{width:"100%",fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,background:"transparent",border:"none",cursor:"pointer",padding:"2px 0",outline:"none"}}>
              {clients.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <Eyebrow>Progress</Eyebrow>
              <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{answered}/{effectiveCatalog.length}</span>
            </div>
            <div style={{height:5,background:T.border,borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${effectiveCatalog.length>0?(answered/effectiveCatalog.length)*100:0}%`,background:T.accent,borderRadius:999}}/>
            </div>
            {intake&&<div style={{marginTop:6,display:"flex",gap:5}}>
              <span style={{fontFamily:MONO,fontSize:9,padding:"2px 5px",borderRadius:4,background:intake.hasServer?T.okBg:T.errBg,color:intake.hasServer?T.ok:T.err,fontWeight:600}}>{intake.hasServer?"ON-PREM":"CLOUD"}</span>
              {intake.hasEntra&&<span style={{fontFamily:MONO,fontSize:9,padding:"2px 5px",borderRadius:4,background:T.accentBg,color:T.accentInk,fontWeight:600}}>ENTRA ID</span>}
            </div>}
          </div>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`}}>
            <Eyebrow>Filter by Status</Eyebrow>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
              {[...STATUSES,"Unanswered"].map(s=>{
                const active=statusFilters.includes(s);
                const color=s==="Complete"?T.ok:s==="Partial"?T.warn:s==="Missing"?T.err:s==="N/A"?T.na:T.purple;
                return(
                  <button key={s} onClick={()=>toggleStatusFilter(s)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",borderRadius:6,border:`1px solid ${active?color:T.border}`,background:active?color+"14":"transparent",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:active?600:400,color:active?color:T.ink2}}>
                    {s}{s==="Unanswered"&&<span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{unanswered.length}</span>}
                  </button>
                );
              })}
              {statusFilters.length>0&&<button onClick={()=>setStatusFilters([])} style={{padding:"4px 0",border:"none",background:"transparent",cursor:"pointer",fontFamily:FONT,fontSize:11,color:T.muted,textAlign:"left"}}>Clear filters</button>}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px"}}>
            {[{id:"all",label:"All Questions"},...categories.map(c=>({id:c,label:c}))].map(cat=>(
              <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"6px 9px",borderRadius:6,border:"none",cursor:"pointer",textAlign:"left",background:activeCategory===cat.id?T.accentBg:"transparent",color:activeCategory===cat.id?T.accentInk:T.ink2}}>
                <span style={{fontFamily:FONT,fontSize:12,fontWeight:activeCategory===cat.id?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.label}</span>
                <span style={{fontFamily:MONO,fontSize:10,color:T.muted,flexShrink:0,marginLeft:4}}>{effectiveCatalog.filter(q=>cat.id==="all"||q.category===cat.id).filter(q=>responses[q.id]?.status).length}/{effectiveCatalog.filter(q=>cat.id==="all"||q.category===cat.id).length}</span>
              </button>
            ))}
          </div>
          <div style={{padding:10,borderTop:`1px solid ${T.border}`}}>
            <button onClick={()=>setShowIntake(true)} style={{width:"100%",background:T.navyAlt,color:"#94A3B8",border:"none",borderRadius:7,padding:"7px 0",cursor:"pointer",fontFamily:MONO,fontSize:9,fontWeight:600,letterSpacing:0.5}}>RE-RUN INTAKE</button>
          </div>
        </div>

        {/* Middle */}
        <div style={{borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",height:"calc(100vh - 160px)",overflow:"hidden"}}>
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:T.bg,borderRadius:7,padding:"6px 10px",border:`1px solid ${T.border}`}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questionsΓÇª" style={{border:"none",background:"transparent",fontFamily:FONT,fontSize:13,color:T.ink,outline:"none",width:"100%"}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {filteredQ.map(q=>{
              const r=responses[q.id]||{};const isActive=activeQId===q.id;
              const sc=r.status==="Complete"?T.ok:r.status==="Partial"?T.warn:r.status==="Missing"?T.err:r.status==="N/A"?T.na:"transparent";
              return(
                <div key={q.id} onClick={()=>setActiveQId(q.id)} style={{display:"flex",gap:8,padding:"10px 12px 10px 10px",cursor:"pointer",borderLeft:`3px solid ${isActive?T.accent:sc}`,borderBottom:`1px solid ${T.border}`,background:isActive?"#fff":T.card}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:5,marginBottom:3,alignItems:"center",flexWrap:"wrap"}}><CritBadge kind={q.criticality}/><TypeBadge t={q.remedType}/></div>
                    <div style={{fontFamily:FONT,fontSize:12,color:T.ink,lineHeight:1.35,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{q.question}</div>
                    {r.assessor&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginTop:2}}>{r.assessor}</div>}
                  </div>
                  {r.status&&<span style={{fontFamily:MONO,fontSize:10,color:sc,flexShrink:0,paddingTop:2,fontWeight:700}}>{r.status[0]}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div style={{overflowY:"auto",padding:"22px 26px 60px",height:"calc(100vh - 160px)",boxSizing:"border-box"}}>
          {!activeQ?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:T.muted,fontFamily:FONT,gap:8}}>
              <span style={{fontSize:14}}>Select a question to begin</span>
            </div>
          ):(
            <>
              <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
                <CritBadge kind={activeQ.criticality}/>
                <TypeBadge t={activeQ.remedType}/>
                <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{activeQ.category.toUpperCase()}</span>
                {activeR.status&&<span style={{marginLeft:"auto",fontFamily:MONO,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,background:activeR.status==="Complete"?T.okBg:activeR.status==="Partial"?T.warnBg:activeR.status==="Missing"?T.errBg:T.naBg,color:activeR.status==="Complete"?T.ok:activeR.status==="Partial"?T.warn:activeR.status==="Missing"?T.err:T.na}}>{activeR.status}</span>}
              </div>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:18,color:T.ink,lineHeight:1.35,marginBottom:6}}>{activeQ.question}</h2>
              <p style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.55,marginBottom:16}}>{activeQ.standard}</p>
              <div style={{marginBottom:14}}><Eyebrow>Assessor</Eyebrow>
                <select value={activeR.assessor||""} onChange={e=>setResp(activeQ.id,"assessor",e.target.value)} style={{fontFamily:FONT,fontSize:13,color:T.ink,border:`1px solid ${T.border}`,borderRadius:7,padding:"6px 10px",background:"white",cursor:"pointer",width:"100%"}}>
                  <option value="">ΓÇö Assign assessor ΓÇö</option>
                  {techs.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {STATUSES.map(s=>{const isActive=activeR.status===s;const sc=statusColors[s][isActive?"active":"inactive"];return<button key={s} onClick={()=>setResp(activeQ.id,"status",isActive?null:s)} style={{padding:"12px 4px",borderRadius:9,border:`1.5px solid ${sc.border}`,background:sc.bg,color:sc.text,cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>{s}</button>;})}
              </div>
              {activeR.answeredAt&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginBottom:12}}>ANSWERED ┬╖ {fmtTime(activeR.answeredAt)}</div>}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px 13px",marginBottom:10}}>
                <Eyebrow>Notes</Eyebrow>
                <textarea value={activeR.notes||""} onChange={e=>setResp(activeQ.id,"notes",e.target.value,true)} onBlur={()=>autoSave(responses,null,false)} placeholder="Add context, findings, or observationsΓÇª" rows={4} style={{width:"100%",fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.5,border:"none",outline:"none",resize:"vertical",background:"transparent",boxSizing:"border-box",padding:"4px 0",marginTop:4}}/>
              </div>
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px 13px"}}>
                <Eyebrow>Evidence Link</Eyebrow>
                <input value={activeR.evidence||""} onChange={e=>setResp(activeQ.id,"evidence",e.target.value,true)} onBlur={()=>autoSave(responses,null,false)} placeholder="https://ΓÇª" style={{width:"100%",fontFamily:MONO,fontSize:13,color:T.accentInk,border:"none",outline:"none",background:"transparent",boxSizing:"border-box",padding:"4px 0"}}/>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ DASHBOARD VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function DashboardView({clients,assessments,catalog,activeClient,setActiveClient,isMobile}){
  const [client,setClient]=useState(activeClient||clients[0]);
  const [capturing,setCapturing]=useState(false);
  const dashRef=useRef(null);
  const hist=assessments[client]||[];
  const submitted=hist.filter(a=>a.submitted);
  const last=submitted[submitted.length-1];
  const prev=submitted[submitted.length-2];
  const score=last?calcScore(last.responses,catalog):null;
  const pScore=prev?calcScore(prev.responses,catalog):null;
  const categories=[...new Set(catalog.map(q=>q.category))];

  const catScores=categories.map(cat=>{
    const qs=catalog.filter(q=>q.category===cat);
    if(!last)return{cat,pct:0};
    let e=0,p=0;qs.forEach(q=>{const s=scoreItem(last.responses?.[q.id],q.weight);e+=s.earned;p+=s.possible;});
    return{cat,pct:p>0?Math.round((e/p)*100):0};
  }).filter(c=>{
    const qs=catalog.filter(q=>q.category===c.cat);
    return last&&qs.some(q=>last.responses?.[q.id]?.status&&last.responses?.[q.id]?.status!=="N/A");
  });

  // Dashboard only shows EXTERNAL findings
  const remItems=last?catalog.flatMap(q=>{
    const r=last.responses?.[q.id];
    if(!r||r.status==="Complete"||r.status==="N/A"||!r.status)return[];
    if(q.remedType!=="External")return[];
    const p=getPriority(q,r.status);if(!p)return[];
    return[{...q,status:r.status,notes:r.notes,assessor:r.assessor,priority:p}];
  }).sort((a,b)=>a.priority.localeCompare(b.priority)):[];
  const p1=remItems.filter(i=>i.priority==="P1"),p2=remItems.filter(i=>i.priority==="P2"),p3=remItems.filter(i=>i.priority==="P3");

  const handleScreenshot=async()=>{
    if(!dashRef.current||capturing)return;
    setCapturing(true);
    try{
      const script=document.createElement("script");
      script.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      document.head.appendChild(script);
      await new Promise((res,rej)=>{script.onload=res;script.onerror=rej;});
      const canvas=await window.html2canvas(dashRef.current,{scale:2,useCORS:true,backgroundColor:"#F4F5F7",logging:false});
      const link=document.createElement("a");
      link.download=`${client.replace(/\s+/g,"-")}-TBR-Dashboard.png`;
      link.href=canvas.toDataURL("image/png");link.click();
    }catch(e){alert("Screenshot failed. Try again.");}
    finally{setCapturing(false);}
  };

  const px=isMobile?"16px":"36px";
  return(
    <div>
      <div style={{display:"flex",gap:12,alignItems:"center",margin:`0 ${isMobile?"16px":"0"} ${isMobile?"12px":"20px"}`}}>
        <select value={client} onChange={e=>{setClient(e.target.value);setActiveClient(e.target.value);}} style={{fontFamily:FONT,fontWeight:700,fontSize:isMobile?14:16,color:T.ink,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",flex:isMobile?1:"none"}}>
          {clients.map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={handleScreenshot} disabled={!last||capturing} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:last?T.navy:"#e2e8f0",color:last?"#E8EDF5":T.muted,border:"none",borderRadius:8,cursor:last?"pointer":"default",fontFamily:FONT,fontWeight:600,fontSize:12,whiteSpace:"nowrap",flexShrink:0}}>
          {capturing?"CapturingΓÇª":"≡ƒôï Download for PowerPoint"}
        </button>
      </div>
      {!last?(
        <div style={{textAlign:"center",padding:60,color:T.muted,fontFamily:FONT,fontSize:15}}>No submitted assessment for {client} yet.</div>
      ):(
        <div ref={dashRef} style={{background:"#fff",borderRadius:isMobile?0:12,border:isMobile?"none":`1px solid ${T.border}`,overflow:"hidden"}}>
          <div style={{background:T.navy,color:"#E8EDF5",padding:`14px ${px} 18px`,borderBottom:`1px solid ${T.navyEdge}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <img src={LOGO_URI} alt="InfoTank" style={{height:26,width:"auto",objectFit:"contain"}}/>
              <div style={{fontFamily:MONO,fontSize:10,color:"#94A3B8",letterSpacing:0.4}}>MANAGED SERVICES ┬╖ TBR SCORECARD</div>
            </div>
            <div style={{fontFamily:FONT,fontSize:isMobile?20:26,fontWeight:700,letterSpacing:-0.5}}>{client}</div>
            <div style={{fontFamily:FONT,fontSize:12,color:"#94A3B8",marginTop:3}}>Submitted {new Date(last.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} ┬╖ External findings only</div>
          </div>
          <div style={{padding:`18px ${px} 28px`,background:T.bg}}>
            <div style={{display:isMobile?"flex":"grid",flexDirection:isMobile?"column":undefined,gridTemplateColumns:isMobile?undefined:"1.1fr 2fr",gap:14,marginBottom:14}}>
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"20px 22px",display:"flex",alignItems:"center",gap:18}}>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:isMobile?80:100,lineHeight:0.9,color:T.accent,letterSpacing:-4}}>{score.grade}</div>
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                    <span style={{fontFamily:MONO,fontSize:isMobile?36:44,fontWeight:600,color:T.ink,letterSpacing:-2,lineHeight:1}}>{score.pct}</span>
                    <span style={{fontFamily:MONO,fontSize:16,color:T.muted}}>%</span>
                  </div>
                  <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:2}}>Overall IT Maturity</div>
                  {pScore&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,padding:"3px 8px",borderRadius:999,background:score.pct>=pScore.pct?T.okBg:T.errBg,color:score.pct>=pScore.pct?T.ok:T.err,fontFamily:MONO,fontSize:10,fontWeight:600}}>
                    {score.pct>=pScore.pct?"Γû▓":"Γû╝"} {Math.abs(score.pct-pScore.pct)} PTS VS. LAST
                  </div>}
                </div>
              </div>
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
                <Eyebrow>Client-Facing Findings (External)</Eyebrow>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
                  {[{p:"P1",label:"Immediate",count:p1.length,c:T.err,bg:T.errBg,border:T.errBorder},{p:"P2",label:"Near-term",count:p2.length,c:T.warn,bg:T.warnBg,border:T.warnBorder},{p:"P3",label:"Planned",count:p3.length,c:T.accentInk,bg:T.accentBg,border:"#B6D7DD"}].map(t=>(
                    <div key={t.p} style={{background:t.bg,borderRadius:9,padding:"11px 13px",border:`1px solid ${t.border}`}}>
                      <div style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:t.c,marginBottom:5}}>{t.p} ┬╖ {t.label}</div>
                      <div style={{fontFamily:MONO,fontSize:30,fontWeight:600,color:t.c,letterSpacing:-1,lineHeight:1}}>{t.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"16px 18px",marginBottom:14}}>
              <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink,marginBottom:12}}>Category Scores</div>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {catScores.sort((a,b)=>a.pct-b.pct).map(c=>{
                  const color=c.pct>=85?T.ok:c.pct>=70?T.warn:T.err;
                  return(
                    <div key={c.cat} style={{display:"grid",gridTemplateColumns:isMobile?"110px 1fr 42px":"170px 1fr 48px",alignItems:"center",gap:10}}>
                      <div style={{fontFamily:FONT,fontSize:12,color:T.ink,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.cat}</div>
                      <div style={{height:7,background:"#EEF1F5",borderRadius:4,overflow:"hidden"}}><div style={{width:`${c.pct}%`,height:"100%",background:color,borderRadius:4}}/></div>
                      <div style={{fontFamily:MONO,fontSize:13,fontWeight:700,color,textAlign:"right"}}>{c.pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {remItems.length>0&&(
              <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>Recommended Projects</div>
                  <div style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{remItems.length} ITEMS</div>
                </div>
                {isMobile?(
                  <div>{remItems.map((r,i)=>(
                    <div key={i} style={{padding:"12px 18px",borderBottom:i<remItems.length-1?`1px solid ${T.border}`:"none"}}>
                      <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}><PriorityPill p={r.priority}/><span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>{r.category.toUpperCase()}</span></div>
                      <div style={{fontFamily:FONT,fontSize:13,color:T.ink,lineHeight:1.4}}>{r.question}</div>
                    </div>
                  ))}</div>
                ):(
                  <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
                    <thead><tr style={{background:"#FAFBFC"}}>{["Priority","Category","Finding","Status","Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 14px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                    <tbody>{remItems.map((r,i)=>(
                      <tr key={i} style={{borderBottom:i<remItems.length-1?`1px solid ${T.border}`:"none"}}>
                        <td style={{padding:"11px 14px"}}><PriorityPill p={r.priority}/></td>
                        <td style={{padding:"11px 14px",color:T.ink2,whiteSpace:"nowrap"}}>{r.category}</td>
                        <td style={{padding:"11px 14px",color:T.ink,maxWidth:280}}>{r.question}</td>
                        <td style={{padding:"11px 14px"}}><span style={{fontFamily:MONO,fontSize:11,fontWeight:600,color:r.status==="Missing"?T.err:T.warn}}>{r.status}</span></td>
                        <td style={{padding:"11px 14px",color:T.muted,fontSize:12,maxWidth:180}}>{r.notes||"ΓÇö"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
                <div style={{display:"flex",justifyContent:"space-between",padding:"9px 18px",borderTop:`1px solid ${T.border}`,fontFamily:MONO,fontSize:10,color:T.muted}}>
                  <span>INFOTANK ┬╖ TECHNOLOGY BUSINESS REVIEW ┬╖ CONFIDENTIAL</span>
                  <span>{new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ΓöÇΓöÇΓöÇ REMEDIATION VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function RemediationView({clients,assessments,catalog,techs,archived,isMobile,onArchive,onUnarchive,isArchived,onNavigate}){
  const [filterClient,setFilterClient]=useState("all");
  const [filterStatus,setFilterStatus]=useState("all"); // all, Partial, Missing, Unanswered
  const [filterType,setFilterType]=useState("all"); // all, Internal, External
  const [filterPriority,setFilterPriority]=useState("all");
  const [filterTech,setFilterTech]=useState("all");
  const [showArchived,setShowArchived]=useState(false);
  const [archiveTarget,setArchiveTarget]=useState(null);

  // Gather all remediation items from all started/submitted assessments
  const allItems=[];
  clients.forEach(client=>{
    const hist=assessments[client]||[];
    if(hist.length===0)return;
    // Use latest assessment (submitted or draft)
    const submitted=hist.filter(a=>a.submitted);
    const draft=hist.find(a=>!a.submitted&&Object.values(a.responses||{}).some(r=>r.status));
    const latest=submitted.length>0?submitted[submitted.length-1]:draft;
    if(!latest)return;
    const isSubmitted=!!latest.submitted;
    const effectiveCatalog=catalog.filter(q=>{
      if(q.category==="Entra ID"&&!latest.intake?.hasEntra)return false;
      return true;
    });
    effectiveCatalog.forEach(q=>{
      const r=latest.responses?.[q.id];
      const status=r?.status||null;
      if(status==="Complete"||status==="N/A")return;
      const priority=status?getPriority(q,status):null;
      allItems.push({client,qid:q.id,question:q.question,category:q.category,criticality:q.criticality,remedType:q.remedType,status:status||"Unanswered",priority,assessor:r?.assessor||null,notes:r?.notes||null,answeredAt:r?.answeredAt||null,isSubmitted,archived:isArchived(client,q.id),archiveNote:archived[`${client}__${q.id}`]?.note});
    });
  });

  const activeItems=allItems.filter(i=>!i.archived);
  const archivedItems=allItems.filter(i=>i.archived);

  const filtered=(showArchived?archivedItems:activeItems).filter(i=>{
    if(filterClient!=="all"&&i.client!==filterClient)return false;
    if(filterStatus!=="all"&&i.status!==filterStatus)return false;
    if(filterType!=="all"&&i.remedType!==filterType)return false;
    if(filterPriority!=="all"&&i.priority!==filterPriority)return false;
    if(filterTech!=="all"&&i.assessor!==filterTech)return false;
    return true;
  });

  const sel=(lbl,val,set,opts)=>(
    <select value={val} onChange={e=>set(e.target.value)} style={{fontFamily:FONT,fontSize:12,color:T.ink,border:`1px solid ${T.border}`,borderRadius:7,padding:"6px 10px",background:"white",cursor:"pointer"}}>
      <option value="all">{lbl}: All</option>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );

  const statusColor=s=>s==="Complete"?T.ok:s==="Partial"?T.warn:s==="Missing"?T.err:s==="N/A"?T.na:T.muted;

  return(
    <div style={{padding:isMobile?"0 16px":"0"}}>
      {archiveTarget&&<ArchiveModal item={archiveTarget} onConfirm={note=>{onArchive(archiveTarget.client,archiveTarget.qid,note);setArchiveTarget(null);}} onCancel={()=>setArchiveTarget(null)}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 0 16px",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>Remediation</div>
          <div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:2}}>
            <span style={{color:activeItems.length>0?T.err:T.ok,fontWeight:700}}>{activeItems.length}</span> active ┬╖ {archivedItems.length} archived ┬╖ Drive to zero
          </div>
        </div>
        <button onClick={()=>setShowArchived(s=>!s)} style={{padding:"7px 14px",background:showArchived?T.warnBg:"white",border:`1px solid ${showArchived?T.warnBorder:T.border}`,borderRadius:8,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:showArchived?T.warn:T.muted}}>
          {showArchived?`Hide Archived (${archivedItems.length})`:`Show Archived (${archivedItems.length})`}
        </button>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {sel("Client",filterClient,setFilterClient,clients)}
        {sel("Status",filterStatus,setFilterStatus,["Partial","Missing","Unanswered"])}
        {sel("Type",filterType,setFilterType,["Internal","External"])}
        {sel("Priority",filterPriority,setFilterPriority,["P1","P2","P3"])}
        {sel("Tech",filterTech,setFilterTech,techs)}
        {(filterClient!=="all"||filterStatus!=="all"||filterType!=="all"||filterPriority!=="all"||filterTech!=="all")&&(
          <button onClick={()=>{setFilterClient("all");setFilterStatus("all");setFilterType("all");setFilterPriority("all");setFilterTech("all");}} style={{padding:"6px 12px",background:"white",border:`1px solid ${T.border}`,borderRadius:7,cursor:"pointer",fontFamily:FONT,fontSize:12,color:T.muted}}>Clear</button>
        )}
      </div>

      <div style={{fontFamily:MONO,fontSize:10,color:T.muted,letterSpacing:0.4,marginBottom:10}}>{filtered.length} ITEMS</div>

      {/* Items */}
      {isMobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map((item,i)=>(
            <div key={i} style={{background:T.card,borderRadius:12,border:`1px solid ${item.archived?T.warnBorder:T.border}`,padding:"14px 16px",opacity:item.archived?0.75:1}}>
              <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                {item.priority&&<PriorityPill p={item.priority}/>}
                <TypeBadge t={item.remedType}/>
                <CritBadge kind={item.criticality}/>
                <span style={{marginLeft:"auto",fontFamily:MONO,fontSize:10,fontWeight:700,color:statusColor(item.status)}}>{item.status.toUpperCase()}</span>
              </div>
              <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink,marginBottom:4}}>{item.client}</div>
              <div style={{fontFamily:FONT,fontSize:13,color:T.ink2,lineHeight:1.4,marginBottom:6}}>{item.question}</div>
              {item.assessor&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginBottom:6}}>{item.assessor}</div>}
              {item.archived&&item.archiveNote&&<div style={{fontFamily:FONT,fontSize:12,color:T.warn,fontStyle:"italic",marginBottom:6}}>{item.archiveNote}</div>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>onNavigate(item.client)} style={{flex:1,padding:"8px 0",background:T.accentBg,color:T.accentInk,border:`1px solid ${T.border}`,borderRadius:7,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:12}}>Go to Assessment</button>
                {!item.archived?<button onClick={()=>setArchiveTarget(item)} style={{padding:"8px 12px",background:T.warnBg,color:T.warn,border:`1px solid ${T.warnBorder}`,borderRadius:7,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:12}}>Archive</button>:<button onClick={()=>onUnarchive(item.client,item.qid)} style={{padding:"8px 12px",background:T.bg,color:T.muted,border:`1px solid ${T.border}`,borderRadius:7,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:12}}>Restore</button>}
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:T.muted,fontFamily:FONT,fontSize:15}}>≡ƒÄë {showArchived?"No archived items":"No active findings ΓÇö great work!"}</div>}
        </div>
      ):(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {filtered.length===0?(
            <div style={{textAlign:"center",padding:60,color:T.muted,fontFamily:FONT,fontSize:15}}>≡ƒÄë {showArchived?"No archived items":"No active findings ΓÇö great work!"}</div>
          ):(
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
              <thead>
                <tr style={{background:"#FAFBFC"}}>
                  {["Priority","Client","Category","Finding","Status","Type","Tech","Notes",""].map(h=><th key={h} style={{textAlign:"left",padding:"9px 12px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item,i)=>(
                  <tr key={i} style={{borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none",opacity:item.archived?0.7:1,background:item.archived?"#FFFBF5":undefined}}>
                    <td style={{padding:"10px 12px"}}>{item.priority?<PriorityPill p={item.priority}/>:<span style={{color:T.muted,fontFamily:MONO,fontSize:11}}>ΓÇö</span>}</td>
                    <td style={{padding:"10px 12px",fontWeight:600,color:T.ink,whiteSpace:"nowrap"}}>{item.client}</td>
                    <td style={{padding:"10px 12px",color:T.muted,whiteSpace:"nowrap",fontSize:12}}>{item.category}</td>
                    <td style={{padding:"10px 12px",color:T.ink,maxWidth:260}}>
                      <div style={{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.question}</div>
                      {item.archived&&item.archiveNote&&<div style={{fontFamily:FONT,fontSize:11,color:T.warn,fontStyle:"italic",marginTop:2}}>{item.archiveNote}</div>}
                    </td>
                    <td style={{padding:"10px 12px",whiteSpace:"nowrap"}}><span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:statusColor(item.status)}}>{item.status}</span></td>
                    <td style={{padding:"10px 12px"}}><TypeBadge t={item.remedType}/></td>
                    <td style={{padding:"10px 12px",color:T.muted,fontSize:12,whiteSpace:"nowrap"}}>{item.assessor||"ΓÇö"}</td>
                    <td style={{padding:"10px 12px",color:T.muted,fontSize:12,maxWidth:160}}>{item.notes||"ΓÇö"}</td>
                    <td style={{padding:"10px 12px",whiteSpace:"nowrap"}}>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>onNavigate(item.client)} style={{padding:"5px 10px",background:T.accentBg,color:T.accentInk,border:`1px solid ${T.border}`,borderRadius:6,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:11}}>Open</button>
                        {!item.archived?<button onClick={()=>setArchiveTarget(item)} style={{padding:"5px 10px",background:T.warnBg,color:T.warn,border:`1px solid ${T.warnBorder}`,borderRadius:6,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:11}}>Archive</button>:<button onClick={()=>onUnarchive(item.client,item.qid)} style={{padding:"5px 10px",background:T.bg,color:T.muted,border:`1px solid ${T.border}`,borderRadius:6,cursor:"pointer",fontFamily:FONT,fontWeight:600,fontSize:11}}>Restore</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ΓöÇΓöÇΓöÇ ASSESSORS VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function AssessorsView({assessments,catalog,techs,clients,isMobile,onSaveTechs}){
  const [days,setDays]=useState(90);
  const [newTech,setNewTech]=useState("");
  const [techList,setTechList]=useState(techs);
  const [techDirty,setTechDirty]=useState(false);
  const cutoff=new Date(Date.now()-days*24*60*60*1000);

  const activeClients=clients.filter(client=>{
    const hist=assessments[client]||[];
    return hist.some(a=>Object.values(a.responses||{}).some(r=>r.answeredAt&&new Date(r.answeredAt)>cutoff));
  });

  const stats=techList.map(tech=>{
    let total=0;const perClient={};
    activeClients.forEach(client=>{
      const hist=assessments[client]||[];let cc=0;
      hist.forEach(a=>Object.values(a.responses||{}).forEach(r=>{if(r.assessor===tech&&r.answeredAt&&new Date(r.answeredAt)>cutoff){total++;cc++;}}));
      if(cc>0)perClient[client]=cc;
    });
    const all=clients.flatMap(c=>(assessments[c]||[]).flatMap(a=>Object.values(a.responses||{}).filter(r=>r.assessor===tech&&r.answeredAt).map(r=>r.answeredAt)));
    return{tech,total,perClient,lastActive:all.length>0?all.sort().reverse()[0]:null};
  }).sort((a,b)=>b.total-a.total);

  const addTech=()=>{if(newTech.trim()&&!techList.includes(newTech.trim())){setTechList(p=>[...p,newTech.trim()]);setNewTech("");setTechDirty(true);}};

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>Assessor Performance</div><div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:2}}>{activeClients.length} active clients shown</div></div>
        <select value={days} onChange={e=>setDays(Number(e.target.value))} style={{fontFamily:FONT,fontSize:13,color:T.ink,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",background:"white",cursor:"pointer"}}>
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={365}>Last 12 months</option><option value={9999}>All time</option>
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginBottom:24}}>
        {stats.map(s=>(
          <div key={s.tech} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
            <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink,marginBottom:4}}>{s.tech}</div>
            <div style={{fontFamily:MONO,fontSize:34,fontWeight:600,color:s.total>0?T.accent:T.muted,letterSpacing:-1,lineHeight:1}}>{s.total}</div>
            <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:2}}>questions answered</div>
            {s.lastActive&&<div style={{fontFamily:MONO,fontSize:10,color:T.muted,marginTop:6,letterSpacing:0.3}}>LAST ┬╖ {fmtTime(s.lastActive)}</div>}
          </div>
        ))}
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:32}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <div style={{fontFamily:FONT,fontWeight:600,fontSize:15,color:T.ink}}>Breakdown by Client</div>
          {activeClients.length===0&&<div style={{fontFamily:FONT,fontSize:13,color:T.muted}}>No activity in this period</div>}
        </div>
        {activeClients.length>0&&(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT,fontSize:13}}>
              <thead><tr style={{background:"#FAFBFC"}}>
                <th style={{textAlign:"left",padding:"9px 14px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>Assessor</th>
                {activeClients.map(c=><th key={c} style={{textAlign:"center",padding:"9px 11px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>{c}</th>)}
                <th style={{textAlign:"center",padding:"9px 11px",fontFamily:MONO,fontSize:10,fontWeight:600,color:T.accent,letterSpacing:0.5,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`}}>Total</th>
              </tr></thead>
              <tbody>{stats.map((s,i)=>(
                <tr key={s.tech} style={{borderBottom:i<stats.length-1?`1px solid ${T.border}`:"none"}}>
                  <td style={{padding:"11px 14px",fontWeight:600,color:T.ink,whiteSpace:"nowrap"}}>{s.tech}</td>
                  {activeClients.map(c=><td key={c} style={{padding:"11px 11px",textAlign:"center",fontFamily:MONO,fontSize:13,color:s.perClient[c]?T.accent:T.muted}}>{s.perClient[c]||"ΓÇö"}</td>)}
                  <td style={{padding:"11px 11px",textAlign:"center",fontFamily:MONO,fontSize:14,fontWeight:700,color:T.accent}}>{s.total||"ΓÇö"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{borderTop:`2px solid ${T.border}`,paddingTop:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:18,color:T.ink}}>Manage Technicians</div><div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:2}}>Add or remove assessors from the system</div></div>
          {techDirty&&<button onClick={()=>{onSaveTechs(techList);setTechDirty(false);}} style={{background:T.ok,color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save Changes</button>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14,maxWidth:480}}>
          <input value={newTech} onChange={e=>setNewTech(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTech()} placeholder="Add technician nameΓÇª" style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 13px",fontSize:14,fontFamily:FONT}}/>
          <button onClick={addTech} style={{background:T.navy,color:"white",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14}}>Add</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,maxWidth:800}}>
          {techList.map(t=>(
            <div key={t} style={{background:T.card,borderRadius:9,padding:"11px 14px",border:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink}}>{t}</span>
              <button onClick={()=>{setTechList(p=>p.filter(x=>x!==t));setTechDirty(true);}} style={{background:T.errBg,color:T.err,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:FONT,fontWeight:600}}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ MANAGE VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function ManageView({catalog,techs,isMobile,onSave}){
  const [items,setItems]=useState(catalog);
  const [editId,setEditId]=useState(null);
  const [filter,setFilter]=useState("All");
  const [dirty,setDirty]=useState(false);
  const [adding,setAdding]=useState(false);
  const [newQ,setNewQ]=useState({category:"",question:"",standard:"",weight:1,criticality:"Medium",remedType:"Internal",defaultAssessor:""});
  const categories=[...new Set(items.map(q=>q.category))];
  const update=(id,f,v)=>{setItems(p=>p.map(q=>q.id===id?{...q,[f]:v}:q));setDirty(true);};
  const remove=id=>{setItems(p=>p.filter(q=>q.id!==id));setDirty(true);};
  const addQ=()=>{if(!newQ.category||!newQ.question)return;setItems(p=>[...p,{...newQ,id:"custom_"+Date.now(),weight:Number(newQ.weight)}]);setNewQ({category:"",question:"",standard:"",weight:1,criticality:"Medium",remedType:"Internal",defaultAssessor:""});setAdding(false);setDirty(true);};
  const filtered=items.filter(q=>filter==="All"||q.category===filter);
  const pad=isMobile?"16px":"0";

  return(
    <div style={{padding:`0 ${pad}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0",flexWrap:"wrap",gap:10}}>
        <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>Question Library</div><div style={{fontFamily:FONT,fontSize:13,color:T.muted,marginTop:2}}>{items.length} controls</div></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setAdding(true)} style={{background:T.navy,color:"white",border:"none",borderRadius:8,padding:"9px 14px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>+ Add</button>
          {dirty&&<button onClick={()=>{onSave(items);setDirty(false);}} style={{background:T.ok,color:"white",border:"none",borderRadius:8,padding:"9px 14px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:13}}>Save</button>}
        </div>
      </div>
      {adding&&(
        <div style={{background:T.accentBg,borderRadius:12,padding:16,marginBottom:16,border:`1px solid #B6D7DD`}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input placeholder="Category" value={newQ.category} onChange={e=>setNewQ({...newQ,category:e.target.value})} list="cat-list" style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <datalist id="cat-list">{categories.map(c=><option key={c} value={c}/>)}</datalist>
            <input placeholder="Question text" value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <input placeholder="Expected standard" value={newQ.standard} onChange={e=>setNewQ({...newQ,standard:e.target.value})} style={{border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,fontFamily:FONT}}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <select value={newQ.weight} onChange={e=>setNewQ({...newQ,weight:e.target.value})} style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 10px",fontSize:14,fontFamily:FONT}}><option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option></select>
              <select value={newQ.criticality} onChange={e=>setNewQ({...newQ,criticality:e.target.value})} style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 10px",fontSize:14,fontFamily:FONT}}><option>Medium</option><option>High</option><option>Critical</option></select>
              <select value={newQ.remedType} onChange={e=>setNewQ({...newQ,remedType:e.target.value})} style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 10px",fontSize:14,fontFamily:FONT}}><option value="Internal">Internal</option><option value="External">External</option></select>
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
          <button key={cat} onClick={()=>setFilter(cat)} style={{background:filter===cat?T.navy:T.card,color:filter===cat?"#fff":T.ink2,border:`1px solid ${filter===cat?T.navy:T.border}`,borderRadius:999,padding:"5px 13px",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{cat}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map(q=>(
          <div key={q.id} style={{background:T.card,borderRadius:9,padding:"12px 14px",border:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
            {editId===q.id?(
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                <input value={q.question} onChange={e=>update(q.id,"question",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:14,fontFamily:FONT,fontWeight:600}}/>
                <input value={q.standard||""} onChange={e=>update(q.id,"standard",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:13,fontFamily:FONT}}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <select value={q.weight} onChange={e=>update(q.id,"weight",Number(e.target.value))} style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 9px",fontSize:13,fontFamily:FONT}}><option value={1}>Wt 1</option><option value={2}>Wt 2</option><option value={3}>Wt 3</option></select>
                  <select value={q.criticality} onChange={e=>update(q.id,"criticality",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 9px",fontSize:13,fontFamily:FONT}}><option>Medium</option><option>High</option><option>Critical</option></select>
                  <select value={q.remedType||"Internal"} onChange={e=>update(q.id,"remedType",e.target.value)} style={{border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 9px",fontSize:13,fontFamily:FONT}}><option value="Internal">Internal</option><option value="External">External</option></select>
                  <button onClick={()=>setEditId(null)} style={{background:T.navy,color:"white",border:"none",borderRadius:6,padding:"6px 13px",cursor:"pointer",fontSize:13,fontFamily:FONT,fontWeight:600}}>Done</button>
                </div>
              </div>
            ):(
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:5,marginBottom:4,alignItems:"center",flexWrap:"wrap"}}>
                  <CritBadge kind={q.criticality}/>
                  <TypeBadge t={q.remedType}/>
                  <span style={{fontFamily:MONO,fontSize:10,color:T.muted}}>Wt {q.weight} ┬╖ {q.category}</span>
                </div>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:13,color:T.ink}}>{q.question}</div>
              </div>
            )}
            <div style={{display:"flex",gap:5,flexShrink:0}}>
              <button onClick={()=>setEditId(editId===q.id?null:q.id)} style={{background:T.bg,color:T.muted,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 9px",cursor:"pointer",fontSize:12}}>Γ£Å∩╕Å</button>
              <button onClick={()=>remove(q.id)} style={{background:T.errBg,color:T.err,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"5px 9px",cursor:"pointer",fontSize:12}}>Γ£ò</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ CLIENTS VIEW ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function ClientsView({clients,clientMeta,assessments,catalog,isMobile,onSave,onStart,onDashboard}){
  const [items,setItems]=useState(clients);
  const [newC,setNewC]=useState("");
  const [dirty,setDirty]=useState(false);
  const summaries=items.map(c=>{
    const hist=assessments[c]||[];const submitted=hist.filter(a=>a.submitted);const last=submitted[submitted.length-1];
    const status=getAssessmentStatus(c,assessments,clientMeta[c]?.createdAt);
    return{client:c,pct:last?calcScore(last.responses,catalog).pct:null,grade:last?calcScore(last.responses,catalog).grade:null,date:last?.date,status};
  });
  const add=()=>{
    if(!newC.trim()||items.includes(newC.trim()))return;
    const newItems=[...items,newC.trim()];
    const newMeta={...clientMeta,[newC.trim()]:{createdAt:new Date().toISOString()}};
    setItems(newItems);setNewC("");setDirty(true);
    onSave(newItems,newMeta);
  };
  const remove=c=>{const newItems=items.filter(x=>x!==c);setItems(newItems);setDirty(true);onSave(newItems,clientMeta);};
  const pad=isMobile?"16px":"0";

  return(
    <div style={{padding:`0 ${pad}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0",flexWrap:"wrap",gap:10}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:T.ink}}>{items.length} Clients</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={newC} onChange={e=>setNewC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Add new clientΓÇª" style={{flex:1,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 13px",fontSize:14,fontFamily:FONT}}/>
        <button onClick={add} style={{background:T.navy,color:"white",border:"none",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14}}>Add</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {summaries.map(s=>(
          <div key={s.client} style={{background:T.card,borderRadius:12,border:`1px solid ${s.status==="overdue"?T.errBorder:s.status==="due"?T.warnBorder:T.border}`,overflow:"hidden"}}>
            <div style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:9,background:s.grade?gradeColor(s.grade)+"22":T.bg,display:"grid",placeItems:"center",flexShrink:0}}>
                <span style={{fontFamily:FONT,fontWeight:800,fontSize:17,color:s.grade?gradeColor(s.grade):T.muted}}>{s.grade||"ΓÇö"}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.ink}}>{s.client}</div>
                <div style={{fontFamily:MONO,fontSize:10,color:s.status==="overdue"?T.err:s.status==="due"?T.warn:T.muted,marginTop:2,fontWeight:s.status!=="ok"?700:400}}>
                  {s.pct!=null?`${s.pct}% ┬╖ ${fmtDate(s.date)}`:clientMeta[s.client]?.createdAt?`Added ${fmtDate(clientMeta[s.client].createdAt)}`:"No assessment yet"}
                  {s.status!=="ok"&&<span style={{marginLeft:6}}>{s.status==="overdue"?"┬╖ OVERDUE":"┬╖ DUE SOON"}</span>}
                </div>
              </div>
              <button onClick={()=>remove(s.client)} style={{background:T.errBg,color:T.err,border:`1px solid ${T.errBorder}`,borderRadius:6,padding:"4px 9px",cursor:"pointer",fontSize:12,fontFamily:FONT,fontWeight:600,flexShrink:0}}>Remove</button>
            </div>
            <div style={{display:"flex",borderTop:`1px solid ${T.border}`}}>
              <button onClick={()=>onStart(s.client)} style={{flex:1,padding:"9px 0",background:T.ok,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:700,color:"#fff",borderRadius:"0 0 0 12px"}}>
                {isInProgress(s.client,assessments)?"Resume":"Assess"}
              </button>
              {s.pct&&<button onClick={()=>onDashboard(s.client)} style={{flex:1,padding:"9px 0",background:"transparent",border:"none",borderLeft:`1px solid ${T.border}`,cursor:"pointer",fontFamily:FONT,fontSize:13,fontWeight:600,color:T.muted,borderRadius:"0 0 12px 0"}}>Dashboard</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
