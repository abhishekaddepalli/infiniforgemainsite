export interface PlatformAlertSettings {
  brand_name: string;
  support_email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_secure: boolean;
  smtp_enabled: boolean;
  wa_provider: string;
  wa_api_url: string;
  wa_api_key: string;
  wa_from_number: string;
  wa_enabled: boolean;
  twilio_enabled: boolean;
  twilio_account_sid: string;
  twilio_auth_token: string;
  twilio_from_number: string;
  alert_on_sale: boolean;
  alert_on_login: boolean;
  alert_on_wallet: boolean;
  alert_recipient_email: string;
  alert_recipient_whatsapp: string;
  alert_recipient_sms: string;
}

export const DEFAULT_ALERT_SETTINGS: PlatformAlertSettings = {
  brand_name: "Infiniforge Technologies",
  support_email: "support@infiniforge.cloud",
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  smtp_from_email: "",
  smtp_from_name: "Infiniforge Technologies",
  smtp_secure: true,
  smtp_enabled: false,
  wa_provider: "twilio",
  wa_api_url: "",
  wa_api_key: "",
  wa_from_number: "",
  wa_enabled: false,
  twilio_enabled: false,
  twilio_account_sid: "",
  twilio_auth_token: "",
  twilio_from_number: "",
  alert_on_sale: true,
  alert_on_login: true,
  alert_on_wallet: true,
  alert_recipient_email: "",
  alert_recipient_whatsapp: "",
  alert_recipient_sms: "",
};

export function normalizePlatformAlertSettings(input: unknown): PlatformAlertSettings {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<PlatformAlertSettings> & Record<string, unknown>;
  return {
    ...DEFAULT_ALERT_SETTINGS,
    ...raw,
    smtp_port: Number(raw.smtp_port ?? DEFAULT_ALERT_SETTINGS.smtp_port) || DEFAULT_ALERT_SETTINGS.smtp_port,
    smtp_secure: Boolean(raw.smtp_secure ?? DEFAULT_ALERT_SETTINGS.smtp_secure),
    smtp_enabled: Boolean(raw.smtp_enabled ?? DEFAULT_ALERT_SETTINGS.smtp_enabled),
    wa_enabled: Boolean(raw.wa_enabled ?? DEFAULT_ALERT_SETTINGS.wa_enabled),
    twilio_enabled: Boolean(raw.twilio_enabled ?? DEFAULT_ALERT_SETTINGS.twilio_enabled),
    alert_on_sale: Boolean(raw.alert_on_sale ?? DEFAULT_ALERT_SETTINGS.alert_on_sale),
    alert_on_login: Boolean(raw.alert_on_login ?? DEFAULT_ALERT_SETTINGS.alert_on_login),
    alert_on_wallet: Boolean(raw.alert_on_wallet ?? DEFAULT_ALERT_SETTINGS.alert_on_wallet),
  };
}
