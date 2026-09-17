/**
 * Deterministic Risk Engine
 * Max score: 100
 * Score components:
 * - Permission Sensitivity: 0-20
 * - Context Mismatch: 0-20
 * - Historical Anomaly: 0-15
 * - Permission Combination: 0-15
 * - Behavioral Change: 0-15
 * - Device Evidence: 0-15
 */

const SENSITIVITY_MAP = {
  CAMERA: 20,
  MICROPHONE: 20,
  LOCATION: 20,
  CONTACTS: 20,
  FILES: 20,
  CLIPBOARD: 20
};

const CONTEXT_RULES = {
  TAKING_PHOTO: { CAMERA: 0, LOCATION: 5 },
  RECORDING_AUDIO: { MICROPHONE: 0 },
  NAVIGATION: { LOCATION: 0 },
  CALCULATING: { MICROPHONE: 20, CONTACTS: 20, CAMERA: 20, LOCATION: 20 },
  READING_NOTES: { CAMERA: 15, LOCATION: 15, MICROPHONE: 15 },
  BROWSING: { LOCATION: 10, CAMERA: 10, MICROPHONE: 10 },
  IDLE: { CAMERA: 20, MICROPHONE: 20, LOCATION: 20, CONTACTS: 20 }
};

const calculatePermissionRisk = (permission) => {
  return SENSITIVITY_MAP[permission] || 10;
};

const calculateContextMismatch = (permission, context) => {
  if (CONTEXT_RULES[context] && CONTEXT_RULES[context][permission] !== undefined) {
    return CONTEXT_RULES[context][permission];
  }
  return 10; // default mismatch
};

const calculateHistoricalAnomaly = (app, permission) => {
  const usage = app.permissionUsage[permission] || 0;
  if (usage === 0) return 15;
  if (usage <= 5) return 10;
  return 0;
};

const calculatePermissionCombinationRisk = (app, permission) => {
  // E.g., a Utility app asking for Camera/Microphone/Contacts is generally unusual
  if (app.category === 'Utility' && ['CAMERA', 'MICROPHONE', 'CONTACTS', 'LOCATION'].includes(permission)) {
    return 15;
  }
  return 0;
};

const calculateBehavioralChangeRisk = (app, recentEvents) => {
  // Check if recent events contradict baseline
  let score = 0;
  let reasons = [];
  
  const baseline = app.baselineBehavior || {};
  
  const hasCpuSpike = recentEvents.some(e => e.eventType === 'CPU_INCREASE');
  const hasNetworkSpike = recentEvents.some(e => e.eventType === 'NETWORK_INCREASE');
  const hasBatterySpike = recentEvents.some(e => e.eventType === 'BATTERY_INCREASE');
  
  if (hasCpuSpike && baseline.cpuActivity === 'LOW') {
    score += 5;
    reasons.push('CPU activity is above normal baseline.');
  }
  
  if (hasNetworkSpike && baseline.networkActivity === 'LOW') {
    score += 10;
    reasons.push('Network activity is above normal baseline.');
  }
  
  return { score: Math.min(score, 15), reasons };
};

const calculateDeviceEvidenceRisk = (recentEvents) => {
  // Look for suspicious sequences like APP_BACKGROUND followed by request
  let score = 0;
  let reasons = [];
  
  const hasBackground = recentEvents.some(e => e.eventType === 'APP_BACKGROUND');
  const hasSensitiveAccess = recentEvents.some(e => e.eventType === 'SENSITIVE_RESOURCE_ACCESS');
  
  if (hasBackground) {
    score += 5;
    reasons.push('App was recently moved to the background.');
  }
  
  if (hasSensitiveAccess) {
    score += 10;
    reasons.push('App accessed other sensitive resources around this time.');
  }
  
  return { score: Math.min(score, 15), reasons };
};

const calculateRisk = (app, permission, context, recentEvents = []) => {
  const pRisk = calculatePermissionRisk(permission);
  const cMismatch = calculateContextMismatch(permission, context);
  const hAnomaly = calculateHistoricalAnomaly(app, permission);
  const pCombo = calculatePermissionCombinationRisk(app, permission);
  
  const bChange = calculateBehavioralChangeRisk(app, recentEvents);
  const dEvidence = calculateDeviceEvidenceRisk(recentEvents);
  
  const totalScore = pRisk + cMismatch + hAnomaly + pCombo + bChange.score + dEvidence.score;
  const clampedScore = Math.min(totalScore, 100);
  
  let riskLevel = 'LOW';
  let recommendation = 'ALLOW';
  
  if (clampedScore >= 80) {
    riskLevel = 'CRITICAL';
    recommendation = 'BLOCK';
  } else if (clampedScore >= 60) {
    riskLevel = 'HIGH';
    recommendation = 'BLOCK';
  } else if (clampedScore >= 30) {
    riskLevel = 'MEDIUM';
    recommendation = 'ASK';
  }
  
  const reasons = [];
  if (pRisk >= 20) reasons.push(`The ${permission} permission is highly sensitive.`);
  if (cMismatch >= 15) reasons.push(`The requested ${permission} access does not match the current ${context.toLowerCase().replace('_', ' ')} activity.`);
  if (hAnomaly === 15) reasons.push(`This app has not previously used ${permission} access.`);
  if (hAnomaly === 10) reasons.push(`This app rarely uses ${permission} access.`);
  if (pCombo > 0) reasons.push(`This permission is unusual for a ${app.category} app.`);
  
  reasons.push(...bChange.reasons);
  reasons.push(...dEvidence.reasons);
  
  return {
    riskScore: clampedScore,
    riskLevel,
    recommendation,
    scoreBreakdown: {
      permissionSensitivity: pRisk,
      contextMismatch: cMismatch,
      historicalAnomaly: hAnomaly,
      permissionCombination: pCombo,
      behavioralChange: bChange.score,
      deviceEvidence: dEvidence.score
    },
    reasons,
    behavioralChange: bChange.score > 0
  };
};

module.exports = { calculateRisk };
