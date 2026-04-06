/**
 * SECURITY UTILITIES FOR THE GRAND MAESTRO
 * Provided by Senior Security Architect (50+ years exp)
 */

/**
 * Sanitizes user input to prevent XSS and basic injections.
 * Strips HTML tags and limits string length.
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (!input) return "";
  
  // Strip HTML tags using regex
  const stripped = input.replace(/<[^>]*>?/gm, '');
  
  // Limit length
  return stripped.substring(0, maxLength).trim();
}

/**
 * Obfuscates sensitive data for storage in LocalStorage.
 * Note: This is NOT strong encryption, but it prevents 
 * casual plain-text snooping of API keys.
 */
export function obfuscate(data: string): string {
  if (!data) return "";
  try {
    // Simple base64 encoding as a first layer
    return btoa(data);
  } catch (e) {
    return data;
  }
}

/**
 * Deobfuscates data from LocalStorage.
 */
export function deobfuscate(data: string): string {
  if (!data) return "";
  try {
    return atob(data);
  } catch (e) {
    return data;
  }
}

/**
 * Validates if an API key looks like a valid format (basic check).
 */
export function isValidApiKey(key: string, provider: string): boolean {
  if (!key) return false;
  if (provider === 'gemini') return key.length > 30; // Gemini keys are usually long
  if (provider === 'openai') return key.startsWith('sk-');
  return key.length > 10;
}
