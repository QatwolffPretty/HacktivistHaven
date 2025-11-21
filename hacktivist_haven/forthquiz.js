// secondquiz.js
// Hacktivist Haven — Network Basics + MITM Quiz (50 MCQ + 50 Short Answers)
// Overwrites previous logic: supports 'mcq' and 'short' question types.
// MCQs are auto-graded; short answers are saved for instructor review.
// Language Toggle
let currentLang = "EN";
const langToggle = document.getElementById("langToggle");

langToggle.onclick = () => {
  currentLang = currentLang === "EN" ? "BM" : "EN";
  langToggle.textContent = currentLang === "EN" ? "BM" : "EN";
  translateUI();
};

function translateUI() {
  if (currentLang === "BM") {
    document.title = "Hacktivist Haven – Kuis Asas Rangkaian & Serangan MITM";
    document.getElementById("startQuizBtn").textContent = "Mula Kuis";
    document.getElementById("nextBtn").textContent = "Seterusnya";
  } else {
    document.title = "Hacktivist Haven – Network Basics & MITM Quiz";
    document.getElementById("startQuizBtn").textContent = "Start Quiz";
    document.getElementById("nextBtn").textContent = "Next";
  }
}


const questions = [
  // ---------- 50 MCQs (Network Basics + MITM) ----------
  { id: 1, type: "mcq", q: "What does IP stand for?", o: ["Internet Protocol", "Internal Process", "Integrated Platform", "Internet Provider"], a: "Internet Protocol" },
  { id: 2, type: "mcq", q: "Which protocol is connection-oriented?", o: ["UDP", "TCP", "ICMP", "ARP"], a: "TCP" },
  { id: 3, type: "mcq", q: "What is the default port for HTTPS?", o: ["80", "443", "22", "53"], a: "443" },
  { id: 4, type: "mcq", q: "Which layer of the OSI model handles routing between networks?", o: ["Transport", "Application", "Network", "Data Link"], a: "Network" },
  { id: 5, type: "mcq", q: "What does DNS translate?", o: ["IP to MAC", "Domain names to IPs", "Ports to services", "Packets to frames"], a: "Domain names to IPs" },
  { id: 6, type: "mcq", q: "What is ARP used for on a LAN?", o: ["Map IP to MAC", "Encrypt packets", "Route across subnets", "Manage ports"], a: "Map IP to MAC" },
  { id: 7, type: "mcq", q: "Which command shows active TCP/UDP listening ports on Linux?", o: ["ip a", "ping", "ss -tuln", "traceroute"], a: "ss -tuln" },
  { id: 8, type: "mcq", q: "Which of these is a packet capture tool?", o: ["Nginx", "Wireshark", "MySQL", "SSH"], a: "Wireshark" },
  { id: 9, type: "mcq", q: "What does NAT do?", o: ["Encrypt traffic", "Translate private IPs to public IPs", "Scan ports", "Manage certificates"], a: "Translate private IPs to public IPs" },
  { id: 10, type: "mcq", q: "Which address is a MAC address example?", o: ["192.168.1.1", "00:1A:2B:3C:4D:5E", "2001:db8::1", "example.com"], a: "00:1A:2B:3C:4D:5E" },
  { id: 11, type: "mcq", q: "Which protocol is used for secure web traffic?", o: ["HTTP", "FTP", "HTTPS", "Telnet"], a: "HTTPS" },
  { id: 12, type: "mcq", q: "What is the primary goal of a Man-in-the-Middle (MITM) attack?", o: ["Encrypt data", "Intercept or alter communication", "Improve bandwidth", "Authenticate users"], a: "Intercept or alter communication" },
  { id: 13, type: "mcq", q: "Which of these is a common MITM vector on Wi-Fi?", o: ["Evil-Twin AP", "DNSSEC", "IPv6-only network", "SSH key"], a: "Evil-Twin AP" },
  { id: 14, type: "mcq", q: "What is HSTS used for?", o: ["Force HTTPS connections", "Block ARP spoofing", "Map IP to MAC", "Log DNS queries"], a: "Force HTTPS connections" },
  { id: 15, type: "mcq", q: "Which DNS record maps a hostname to an IP (IPv4)?", o: ["MX", "TXT", "A", "CNAME"], a: "A" },
  { id: 16, type: "mcq", q: "What does TTL mean in DNS responses?", o: ["Time To Live", "Total TCP Links", "Transit Time Log", "Transport Layer Type"], a: "Time To Live" },
  { id: 17, type: "mcq", q: "Which tool is commonly used for port scanning?", o: ["Nmap", "scp", "vim", "curl"], a: "Nmap" },
  { id: 18, type: "mcq", q: "Which technique prevents unauthorized ARP replies on managed switches?", o: ["Port security", "Dynamic ARP Inspection (DAI)", "HSTS", "Certificate pinning"], a: "Dynamic ARP Inspection (DAI)" },
  { id: 19, type: "mcq", q: "Which protocol translates domain names at the client resolver level?", o: ["HTTP", "DNS", "SMTP", "ARP"], a: "DNS" },
  { id: 20, type: "mcq", q: "What is the three-way handshake used by TCP?", o: ["SYN, SYN-ACK, ACK", "SYN, FIN, ACK", "GET, POST, PUT", "ARP, RARP, ICMP"], a: "SYN, SYN-ACK, ACK" },
  { id: 21, type: "mcq", q: "Which port does SSH normally use?", o: ["21", "22", "23", "25"], a: "22" },
  { id: 22, type: "mcq", q: "What is a broadcast address used for?", o: ["Single host communication", "Send to all hosts on subnet", "Encrypt traffic", "Map hostnames"], a: "Send to all hosts on subnet" },
  { id: 23, type: "mcq", q: "Which header helps browsers enforce HTTPS?", o: ["Content-Security-Policy", "HSTS header", "X-Frame-Options", "Server"], a: "HSTS header" },
  { id: 24, type: "mcq", q: "Which of these indicates DNS spoofing?", o: ["No DNS responses", "Multiple A records to unexpected IPs", "Proper TLS cert", "ARP caches unchanged"], a: "Multiple A records to unexpected IPs" },
  { id: 25, type: "mcq", q: "Which capture filter would you use to see HTTP traffic in Wireshark?", o: ["tcp port 80", "port 22", "ip proto 1", "icmp"], a: "tcp port 80" },
  { id: 26, type: "mcq", q: "Which is a defensive purpose of Nmap?", o: ["Scan unauthorized third-party servers", "Inventory services on owned hosts", "Deploy malware", "Alter routing tables"], a: "Inventory services on owned hosts" },
  { id: 27, type: "mcq", q: "What does SSL/TLS certificate pinning do?", o: ["Ignore certificates", "Lock a domain to a known certificate/fingerprint", "Encrypt DNS", "Provide DHCP services"], a: "Lock a domain to a known certificate/fingerprint" },
  { id: 28, type: "mcq", q: "Which of these reduces the risk of TLS stripping?", o: ["Turning off HTTPS", "Implementing HSTS", "Using outdated ciphers", "Disabling certificate checks"], a: "Implementing HSTS" },
  { id: 29, type: "mcq", q: "Which protocol is used by Ping?", o: ["TCP", "UDP", "ICMP", "HTTP"], a: "ICMP" },
  { id: 30, type: "mcq", q: "What is the function of a gateway/router?", o: ["Forward traffic between networks", "Encrypt files", "Store certificates", "Assign MAC addresses"], a: "Forward traffic between networks" },
  { id: 31, type: "mcq", q: "Which is an example of link-layer protocol?", o: ["IP", "TCP", "Ethernet", "HTTP"], a: "Ethernet" },
  { id: 32, type: "mcq", q: "Which mechanism can detect ARP spoofing at host level?", o: ["ARP cache inspection", "Certificate pinning", "HSTS", "DNSSEC"], a: "ARP cache inspection" },
  { id: 33, type: "mcq", q: "Which is the correct CIDR for a 256-address IPv4 block?", o: ["/24", "/16", "/32", "/8"], a: "/24" },
  { id: 34, type: "mcq", q: "What does SNI in TLS do?", o: ["Provide DNS resolution", "Allow multiple hostnames on same IP", "Encrypt ARP", "Map MAC addresses"], a: "Allow multiple hostnames on same IP" },
  { id: 35, type: "mcq", q: "Which of these is a sign of a rogue Wi-Fi AP?", o: ["Same SSID with different BSSID", "Same BSSID always", "No DHCP", "TLS pinned"], a: "Same SSID with different BSSID" },
  { id: 36, type: "mcq", q: "Which OSI layer deals with end-to-end communication and reliability?", o: ["Data Link", "Network", "Transport", "Physical"], a: "Transport" },
  { id: 37, type: "mcq", q: "Which log is useful to check for HTTP anomalies on a server?", o: ["syslog", "auth.log", "access.log", "boot.log"], a: "access.log" },
  { id: 38, type: "mcq", q: "What is DNSSEC aimed to prevent?", o: ["ARP spoofing", "DNS cache poisoning", "TLS stripping", "Port scanning"], a: "DNS cache poisoning" },
  { id: 39, type: "mcq", q: "Which of these is NOT a transport protocol?", o: ["UDP", "TCP", "IP", "SCTP"], a: "IP" },
  { id: 40, type: "mcq", q: "Which command shows routing table on Linux?", o: ["ip route", "ss -tuln", "arp -a", "dig"], a: "ip route" },
  { id: 41, type: "mcq", q: "Which header indicates TLS in an HTTP capture (start of TLS handshake)?", o: ["Client Hello", "GET /", "Server: nginx", "User-Agent"], a: "Client Hello" },
  { id: 42, type: "mcq", q: "Which is a valid IPv6 address example?", o: ["192.168.1.1", "00:1A:2B", "2001:0db8::1", "example.com"], a: "2001:0db8::1" },
  { id: 43, type: "mcq", q: "What is the purpose of a firewall rule 'deny all, allow specific'?", o: ["Open everything", "Least privilege - reduce attack surface", "Make network faster", "Encrypt traffic"], a: "Least privilege - reduce attack surface" },
  { id: 44, type: "mcq", q: "Which detection sign could indicate certificate tampering?", o: ["Certificate chain mismatch", "Correct DNS resolve", "Stable ARP", "No HTTP traffic"], a: "Certificate chain mismatch" },
  { id: 45, type: "mcq", q: "What is a 'captive portal' commonly used for?", o: ["Public Wi-Fi authentication", "Encrypting traffic", "Routing tables", "Packet sniffing"], a: "Public Wi-Fi authentication" },
  { id: 46, type: "mcq", q: "Which technique would a defender use to capture packets on a switch without impacting production?", o: ["SPAN/port mirror", "ARP spoofing", "DNS poisoning", "BGP hijack"], a: "SPAN/port mirror" },
  { id: 47, type: "mcq", q: "Which is true about UDP?", o: ["Connection-oriented", "Provides reliability", "Connectionless and low-overhead", "Guaranteed delivery"], a: "Connectionless and low-overhead" },
  { id: 48, type: "mcq", q: "Which protocol is used to securely resolve DNS over TLS?", o: ["DoT", "HTTP", "FTP", "SMTP"], a: "DoT" },
  { id: 49, type: "mcq", q: "Which token best reduces the impact of intercepted credentials?", o: ["Static long-lived password", "Short-lived session tokens", "Plaintext passwords", "Shared credentials"], a: "Short-lived session tokens" },
  { id: 50, type: "mcq", q: "Which practice helps detect sudden network path changes indicative of BGP manipulation?", o: ["Monitor traceroute/route telemetry", "Disable routing", "Increase MTU", "Disable DNS"], a: "Monitor traceroute/route telemetry" },

  // ---------- 50 Short-answer prompts (subjective) ----------
  { id: 51, type: "short", q: "Describe in one paragraph how an ARP spoofing MITM works." , modelAnswer: "Attacker sends forged ARP replies on LAN claiming the IP of a legitimate host (usually gateway), causing victims to update ARP caches and send traffic to attacker, who forwards to real host while intercepting/modifying traffic." },
  { id: 52, type: "short", q: "Explain why using HTTPS with HSTS helps prevent certain MITM attacks." , modelAnswer: "HSTS forces browsers to use HTTPS and reject HTTP, preventing attackers from downgrading or stripping TLS during initial connection." },
  { id: 53, type: "short", q: "List three common indicators of a rogue Wi-Fi access point." , modelAnswer: "Duplicate SSID with different BSSID, unexpected captive portal, inconsistent signal strength or unexpected DHCP server." },
  { id: 54, type: "short", q: "How would you check if a TLS certificate presented by a site is valid?" , modelAnswer: "Inspect certificate chain, validity dates, issuer, revocation status and compare fingerprint against known good; check CT logs if available." },
  { id: 55, type: "short", q: "What is the purpose of DNSSEC and how does it help defenders?" , modelAnswer: "DNSSEC signs DNS records cryptographically so resolvers can verify authenticity and integrity, reducing DNS spoofing/cache poisoning." },
  { id: 56, type: "short", q: "Describe the difference between a router and a switch." , modelAnswer: "Switch operates at link layer to forward frames within same LAN using MAC addresses; router operates at network layer to forward packets between different IP networks." },
  { id: 57, type: "short", q: "Explain what a subnet mask does." , modelAnswer: "Subnet mask separates network and host bits of an IP address to determine which IPs are on the same local network." },
  { id: 58, type: "short", q: "Describe how you would use tcpdump to capture HTTP traffic for 60 seconds." , modelAnswer: "Run `tcpdump -i <iface> tcp port 80 -c <count> -w file.pcap` or capture for time by starting capture and stopping after 60s; then analyze in Wireshark." },
  { id: 59, type: "short", q: "What is 'port' in networking and why does it matter?" , modelAnswer: "Port is an endpoint identifier at transport layer that differentiates services on same host (e.g., 80 for HTTP); it matters as attack surface/entry point." },
  { id: 60, type: "short", q: "Explain why least privilege for service accounts reduces attack impact." , modelAnswer: "Limiting permissions reduces what an attacker can do with a compromised account, preventing lateral movement and data access." },
  { id: 61, type: "short", q: "How can switch port security help prevent MAC-spoofing attacks?" , modelAnswer: "Port security can limit allowed MACs per port and block/disable ports with MAC changes, preventing unauthorized hosts from spoofing." },
  { id: 62, type: "short", q: "Explain what a default gateway is." , modelAnswer: "Default gateway is the router IP that hosts use to send traffic to destinations outside their local subnet." },
  { id: 63, type: "short", q: "Describe a simple detection rule to alert on suspicious ARP activity." , modelAnswer: "Alert when a single IP is claimed by multiple MACs within short timeframe or when MAC→IP mapping changes frequently." },
  { id: 64, type: "short", q: "What is the difference between active and passive reconnaissance?" , modelAnswer: "Active reconnaissance interacts with target (scans) and can be detected; passive collects publicly available data without direct interaction." },
  { id: 65, type: "short", q: "Explain how certificate transparency logs help defenders." , modelAnswer: "CT logs provide public records of certificates issued, enabling detection of unexpected or fraudulent certificates for your domain." },
  { id: 66, type: "short", q: "How can you safely practice MITM detection in a lab?" , modelAnswer: "Use isolated VM network, run benign misconfigurations set by instructor, capture pcaps, avoid running active poisoning tools on shared networks." },
  { id: 67, type: "short", q: "What is DNS over HTTPS (DoH) and one operational caveat?" , modelAnswer: "DoH encrypts DNS queries over HTTPS; caveat: it can bypass local resolver visibility making enterprise monitoring more complex." },
  { id: 68, type: "short", q: "Describe how a transparent proxy could be used for inspection and a mitigation to control it." , modelAnswer: "Transparent proxy intercepts traffic without client config to inspect; mitigation includes using E2E TLS pinning and ensuring proxy trust chain is controlled." },
  { id: 69, type: "short", q: "Explain why using expired or self-signed certificates is risky." , modelAnswer: "They break trust model and allow attackers to impersonate servers or trick users into accepting untrusted certs." },
  { id: 70, type: "short", q: "Describe the role of SNI in TLS and a privacy concern." , modelAnswer: "SNI indicates hostname in ClientHello allowing hosting multiple domains on same IP; it reveals hostname in cleartext (before TLS 1.3 Encrypted SNI)." },
  { id: 71, type: "short", q: "What is the role of DHCP in a LAN?" , modelAnswer: "DHCP assigns IP addresses and other network config to hosts automatically (IP, gateway, DNS)." },
  { id: 72, type: "short", q: "Explain how monitoring DNS query volume can indicate data exfiltration." , modelAnswer: "Unusual high volume or unusual domain patterns (long subdomains) can indicate DNS tunneling used for exfiltration." },
  { id: 73, type: "short", q: "Describe one method to verify a suspect gateway's MAC address." , modelAnswer: "Check switch CAM tables and compare MAC observed on host ARP table to switch port mapping or run 'arp -a' and inspect switch logs." },
  { id: 74, type: "short", q: "How does a VPN protect users on untrusted Wi-Fi?", modelAnswer: "VPN establishes encrypted tunnel between device and trusted server, preventing local MITM from reading traffic between client and VPN endpoint." },
  { id: 75, type: "short", q: "Explain why monitoring certificate churn for critical domains matters.", modelAnswer: "Unexpected certificate changes can signal unauthorized issuance or MITM attempts; monitoring allows rapid detection and response." },
  { id: 76, type: "short", q: "What is the importance of time synchronization (NTP) in network logging?", modelAnswer: "Accurate timestamps across hosts enable correlation of events and timeline reconstruction during incidents." },
  { id: 77, type: "short", q: "Describe a high-level incident response step when you suspect MITM activity.", modelAnswer: "Isolate affected hosts, capture pcaps, collect logs (DHCP, DNS, server logs), preserve evidence, remediate routing/proxy, notify SOC/CERT." },
  { id: 78, type: "short", q: "What is 'promiscuous mode' on a NIC and when is it used?", modelAnswer: "Promiscuous mode allows NIC to capture all traffic on segment (used for packet capture on shared or mirrored networks)." },
  { id: 79, type: "short", q: "Explain why user education reduces success of rogue hotspot attacks.", modelAnswer: "Users who verify SSID, avoid unknown wifi, use VPNs and heed certificate warnings are less likely to connect to malicious hotspots." },
  { id: 80, type: "short", q: "Describe how you would document evidence from a MITM investigation.", modelAnswer: "Record timestamps, capture pcaps, save logs, take screenshots, note commands run, preserve system snapshots and chain of custody." },
  { id: 81, type: "short", q: "How can HTTP Strict Transport Security (HSTS) be deployed for a web application?", modelAnswer: "Serve HSTS header with long max-age and includeSubDomains and ensure site serves HTTPS properly before enabling." },
  { id: 82, type: "short", q: "What is the role of an IDS in detecting MITM?", modelAnswer: "IDS detects anomalies (ARP spoof patterns, DNS anomalies, unusual flows) and raises alerts for investigation." },
  { id: 83, type: "short", q: "Explain why rotating certificates and keys is good practice.", modelAnswer: "Rotation limits exposure if keys are compromised and enforces regular revalidation of trust." },
  { id: 84, type: "short", q: "Describe one challenge when relying on DoH in an enterprise.", modelAnswer: "Encrypted DNS can bypass enterprise DNS monitoring, hindering visibility and detection of DNS-based threats." },
  { id: 85, type: "short", q: "How can you check for unexpected proxy configuration on a Windows endpoint?", modelAnswer: "Inspect Internet Options / proxy settings, check registry keys and environment variables, and view browser config or MDM policy." },
  { id: 86, type: "short", q: "Describe how to use traceroute in troubleshooting a suspected route hijack.", modelAnswer: "Run traceroute to destination before/after, compare hops to known baselines and spot unexpected AS/hop changes." },
  { id: 87, type: "short", q: "Explain the difference between active and passive packet capture.", modelAnswer: "Active capture may inject or alter traffic (e.g., proxy); passive capture only observes mirrored traffic without interfering." },
  { id: 88, type: "short", q: "What is the purpose of DHCP snooping on a switch?", modelAnswer: "DHCP snooping records legitimate DHCP bindings and can block unauthorized DHCP servers to prevent some MITM attacks." },
  { id: 89, type: "short", q: "How does enforcing 'no user CA' in Network Security Config help Android apps?", modelAnswer: "It prevents apps from trusting user-installed CAs that a malicious actor could add to intercept TLS." },
  { id: 90, type: "short", q: "Describe one limitation of certificate pinning.", modelAnswer: "Pinning can complicate certificate rotation or CDN use and may cause outages if pins are not managed properly." },
  { id: 91, type: "short", q: "What network artifact might you look for to spot DNS tunneling?", modelAnswer: "Unusually long subdomains, high frequency of DNS queries to single domain, or abnormally large DNS responses." },
  { id: 92, type: "short", q: "How can a defender safely simulate a captive portal for testing?", modelAnswer: "Use an isolated lab AP with controlled DHCP and web server presenting portal pages; ensure devices are test/dev only." },
  { id: 93, type: "short", q: "Why is logging at multiple layers (network, host, application) important in MITM detection?", modelAnswer: "Multi-layer logs provide corroborating evidence and increase ability to detect anomalies that one layer alone might miss." },
  { id: 94, type: "short", q: "Explain how mutual TLS (mTLS) improves security.", modelAnswer: "mTLS requires both client and server certificates, adding strong mutual authentication and preventing some proxy interceptions." },
  { id: 95, type: "short", q: "What is a good baseline metric to detect abnormal DNS behavior?", modelAnswer: "Average queries per host per minute and typical domain patterns; significant deviation triggers investigation." },
  { id: 96, type: "short", q: "Describe steps to harden a web server against MITM enablement (brief).", modelAnswer: "Enable TLS 1.2+/1.3, HSTS, strong ciphers, certificate monitoring, disable insecure protocols, and use secure cookies." },
  { id: 97, type: "short", q: "How would you use Wireshark to confirm a client is talking to the intended server?", modelAnswer: "Inspect TCP/TLS handshake, SNI, IP addresses, and certificate server name and fingerprint to confirm identity." },
  { id: 98, type: "short", q: "Explain why endpoint integrity agents help detect MITM tools on hosts.", modelAnswer: "They can detect unexpected proxy binaries, network configuration changes, or processes performing packet forwarding." },
  { id: 99, type: "short", q: "Describe the role of an enterprise CA/PKI in preventing impersonation.", modelAnswer: "Enterprise CA issues and manages internal certs, enabling trust validation and revocation for internal services." },
  { id: 100, type: "short", q: "Write a concise 3-step checklist for what to do immediately when MITM is suspected.", modelAnswer: "1) Isolate affected hosts / disable interfaces; 2) Capture pcap & collect logs; 3) Restore correct routing/gateway and change credentials as needed, then escalate." }
];

// DOM elements
const el = (id) => document.getElementById(id);
const nameCard = el("nameCard");
const usernameInput = el("usernameInput");
const startQuizBtn = el("startQuizBtn");
const nameError = el("nameError");
const quizCard = el("quizCard");
const questionText = el("questionText");
const answersContainer = el("answersContainer");
const nextBtn = el("nextBtn");
const progressText = el("progressText");
const progressBar = el("progressBar");
const resultModal = el("resultModal");
const resultText = el("resultText");
const rankText = el("rankText");
const answersReview = el("answersReview");
const returnDashboard = el("returnDashboard");
const retryQuiz = el("retryQuiz");
const userNameText = el("userNameText");
const adminAccess = el("adminAccess");
const adminModal = el("adminModal");
const adminLogin = el("adminLogin");
const adminCancel = el("adminCancel");
const adminMsg = el("adminMsg");
const adminPass = el("adminPass");

let current = 0;
let score = 0;
let username = "";
let selectedAnswers = []; // store {q,a,user,correct,type,shortAnswer}

startQuizBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name || name.toLowerCase() === "guest") {
    nameError.style.display = "block";
    return;
  }
  username = name;
  nameError.style.display = "none";
  nameCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  showQuestion();
};

adminAccess.onclick = () => {
  adminModal.style.display = "flex";
};
adminCancel.onclick = () => {
  adminModal.style.display = "none";
  adminPass.value = "";
  adminMsg.style.display = "none";
};
adminLogin.onclick = () => {
  if (adminPass.value === "rootaccess") {
    alert("Welcome, admin.");
    adminModal.style.display = "none";
    adminPass.value = "";
    adminMsg.style.display = "none";
  } else {
    adminMsg.style.display = "block";
  }
};

function updateProgress() {
  progressText.textContent = `Question ${current + 1} of ${questions.length}`;
  progressBar.style.width = `${((current) / questions.length) * 100}%`;
}

function showQuestion() {
  updateProgress();
  const q = questions[current];
  questionText.textContent = q.q;
  answersContainer.innerHTML = "";

  if (q.type === "mcq") {
    // render mcq options in randomized order
    const opts = q.o ? shuffle([...q.o]) : [];
    opts.forEach(opt => {
      const div = document.createElement("div");
      div.className = "answer";
      div.textContent = opt;
      div.onclick = () => selectOption(div, opt === q.a);
      answersContainer.appendChild(div);
    });
  } else if (q.type === "short") {
    // render a textarea for short answers
    const ta = document.createElement("textarea");
    ta.id = "shortAnswer";
    ta.placeholder = "Type your short answer here... / Taip jawapan ringkas anda di sini...";
    answersContainer.appendChild(ta);
  }
}

function selectOption(elDiv, correct) {
  // deselect all
  document.querySelectorAll(".answer").forEach(b => b.classList.remove("selected"));
  elDiv.classList.add("selected");
  elDiv.dataset.correct = correct;
}

// helper: shuffle
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

nextBtn.onclick = () => {
  const q = questions[current];
  if (q.type === "mcq") {
    const chosen = document.querySelector(".answer.selected");
    if (!chosen) {
      alert("Please select an answer!");
      return;
    }
    const correct = chosen.dataset.correct === "true";
    selectedAnswers.push({
      q: q.q,
      a: q.a,
      user: chosen.textContent,
      correct: correct,
      type: q.type
    });
    if (correct) score++;
  } else if (q.type === "short") {
    const ta = document.getElementById("shortAnswer");
    const ans = ta ? ta.value.trim() : "";
    selectedAnswers.push({
      q: q.q,
      a: q.modelAnswer || "",
      user: ans,
      correct: null,
      type: q.type
    });
  }

  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
};

function endQuiz() {
  progressBar.style.width = "100%";
  quizCard.classList.add("hidden");
  resultModal.classList.remove("hidden");
  resultText.textContent = `You scored ${score} / ${questions.filter(q => q.type === "mcq").length}`;
  userNameText.textContent = `Well done, ${username}!`;
  const mcqTotal = questions.filter(q => q.type === "mcq").length;
  const pct = mcqTotal === 0 ? 0 : (score / mcqTotal) * 100;
  let rank = "Beginner";
  if (pct >= 80) rank = "Expert";
  else if (pct >= 50) rank = "Intermediate";
  rankText.textContent = `Rank: ${rank} (${pct.toFixed(0)}%)`;

  // build review HTML
  let reviewHTML = "<h3>Review</h3>";
  selectedAnswers.forEach((item, i) => {
    reviewHTML += `<p><strong>Q${i + 1}:</strong> ${escapeHtml(item.q)}<br>`;
    if (item.type === "mcq") {
      reviewHTML += `<span class="${item.correct ? "correct" : "wrong"}">${item.correct ? "✔ Correct" : "✖ Wrong" } — Your answer: ${escapeHtml(item.user)}</span><br>`;
      reviewHTML += `<span class="muted">Correct: ${escapeHtml(item.a)}</span></p>`;
    } else {
      reviewHTML += `<span class="muted">Your answer:</span><br><div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:8px;margin-top:6px;">${escapeHtml(item.user || "(no answer provided)")}</div>`;
      if (item.a) reviewHTML += `<div class="muted" style="margin-top:6px;">Model answer (instructor): ${escapeHtml(item.a)}</div>`;
      reviewHTML += `</p>`;
    }
  });

  answersReview.innerHTML = reviewHTML;
  saveResult();
  startConfetti();
}

// Save results locally (simple leaderboard)
function saveResult() {
  try {
    const key = "hacktivist_haven_leaderboard_v2";
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    if (!existing["Network_MITM"]) existing["Network_MITM"] = [];
    existing["Network_MITM"].push({
      name: username,
      score: score,
      mcqTotal: questions.filter(q => q.type === "mcq").length,
      date: new Date().toLocaleString()
    });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    // ignore storage errors
  }
}

retryQuiz.onclick = () => location.reload();
returnDashboard.onclick = () => location.href = "student-dashboard.html";

// Simple confetti effect (same as previous)
const canvas = el("confettiCanvas");
let ctx = null;
if (canvas) ctx = canvas.getContext("2d");
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startConfetti() {
  if (!ctx) return;
  const confetti = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    d: Math.random() * 2 + 0.5,
    color: `hsl(${Math.random() * 360},100%,65%)`
  }));
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
      c.y += c.d;
      if (c.y > canvas.height) c.y = 0;
    });
    t++;
    if (t < 600) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// small helper to escape HTML when injecting
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
