import type { DeviceType } from "./device_type";

type Work = {
  id: string;
  device_types: DeviceType;
  serial: string;
  attachment?: string;
  recieve_data?: string;
  wifi_card?: string;
  status?: "انتظار" | "مكتمل" | "ملغى";
  brother_name?: string;
  entity?: string;
  contact_number?: string;
  ram?: number;
  cpu?: string;
  model?: string;
};

export { type Work };
