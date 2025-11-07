export const threatDetections = [
  { name: 'Phishing', count: 142, color: 'hsl(var(--chart-1))' },
  { name: 'Malware', count: 89, color: 'hsl(var(--chart-2))' },
  { name: 'DDoS', count: 56, color: 'hsl(var(--chart-3))' },
  { name: 'Ransomware', count: 34, color: 'hsl(var(--chart-4))' },
];

export const hourlyThreats = [
  { time: '00:00', threats: 23 },
  { time: '04:00', threats: 45 },
  { time: '08:00', threats: 89 },
  { time: '12:00', threats: 134 },
  { time: '16:00', threats: 178 },
  { time: '20:00', threats: 156 },
];

export const globalThreats = [
  { id: 1, ip: '192.168.1.45', region: 'USA', type: 'Port Scan', status: 'Blocked', severity: 'high' },
  { id: 2, ip: '10.0.0.123', region: 'China', type: 'Malware', status: 'Quarantined', severity: 'critical' },
  { id: 3, ip: '172.16.0.89', region: 'Russia', type: 'Phishing', status: 'Detected', severity: 'medium' },
  { id: 4, ip: '203.0.113.67', region: 'Brazil', type: 'DDoS', status: 'Mitigated', severity: 'high' },
  { id: 5, ip: '198.51.100.22', region: 'UK', type: 'Ransomware', status: 'Blocked', severity: 'critical' },
];

export const nodeHealth = {
  cpu: 67,
  memory: 82,
  uptime: 99.8,
  ping: 12,
};

export const aiThreatScore = {
  risk: 73,
  critical: 12,
  falsePositives: 234,
  accuracy: 96.5,
};

export const activityLogs = [
  { time: '2024-01-15 14:23:45', event: 'Threat detected: Malware variant XYZ-2024', severity: 'critical' },
  { time: '2024-01-15 14:22:12', event: 'System scan completed: 234 files checked', severity: 'info' },
  { time: '2024-01-15 14:20:33', event: 'Firewall rule updated: Block IP 192.168.1.45', severity: 'warning' },
  { time: '2024-01-15 14:18:56', event: 'User authentication: admin@echolock.io', severity: 'info' },
  { time: '2024-01-15 14:15:22', event: 'Phishing attempt blocked from email source', severity: 'high' },
  { time: '2024-01-15 14:12:44', event: 'Database backup completed successfully', severity: 'info' },
  { time: '2024-01-15 14:10:11', event: 'Network anomaly detected: Unusual traffic spike', severity: 'warning' },
  { time: '2024-01-15 14:08:33', event: 'SSL certificate renewed: echolock.io', severity: 'info' },
];
