const constantsModule = require('expo-constants');
const Constants = constantsModule?.default ?? constantsModule;

const DEFAULT_PORT = '3001';
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}`;

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const isIpV4 = (value) => /^(\d{1,3}\.){3}\d{1,3}$/.test(value);

const isLikelyLanHost = (value) =>
  value === 'localhost' ||
  value === '127.0.0.1' ||
  value === '::1' ||
  isIpV4(value) ||
  value.endsWith('.local');

const extractHost = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    return parsed.hostname || null;
  } catch {
    const withoutScheme = trimmed.replace(/^[a-z]+:\/\//i, '');
    const withoutPath = withoutScheme.split('/')[0];
    if (!withoutPath) return null;
    if (withoutPath.startsWith('[')) {
      const closingIndex = withoutPath.indexOf(']');
      if (closingIndex > 1) return withoutPath.slice(1, closingIndex);
    }
    return withoutPath.split(':')[0] || null;
  }
};

const getExpoHost = () => {
  const candidates = [
    Constants?.expoConfig?.hostUri,
    Constants?.manifest2?.extra?.expoGo?.debuggerHost,
    Constants?.manifest?.debuggerHost,
    Constants?.manifest?.hostUri,
    Constants?.linkingUri,
  ];

  for (const candidate of candidates) {
    const host = extractHost(candidate);
    if (host) return host;
  }

  return null;
};

const withDetectedHostIfLocal = (envBaseUrl) => {
  try {
    const parsed = new URL(envBaseUrl);
    const isLocalHost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1';

    if (!isLocalHost) return trimTrailingSlash(envBaseUrl);

    const detectedHost = getExpoHost();
    if (
      !detectedHost ||
      detectedHost === 'localhost' ||
      detectedHost === '127.0.0.1' ||
      !isLikelyLanHost(detectedHost)
    ) {
      return trimTrailingSlash(envBaseUrl);
    }

    const detectedPort = parsed.port || DEFAULT_PORT;
    return `http://${detectedHost}:${detectedPort}`;
  } catch {
    return trimTrailingSlash(envBaseUrl);
  }
};

const getApiBaseUrl = () => {
  const envBaseUrl = process.env.EXPO_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (envBaseUrl && envBaseUrl.trim()) {
    return withDetectedHostIfLocal(envBaseUrl.trim());
  }

  const detectedHost = getExpoHost();
  if (detectedHost) return `http://${detectedHost}:${DEFAULT_PORT}`;

  return DEFAULT_BASE_URL;
};

module.exports = {
  getApiBaseUrl,
};
