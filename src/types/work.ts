import type { Cpu } from "./cpu";
import type { DeviceStatus } from "./device_status";
import type { DeviceType } from "./device_type";
import type { RamType } from "./ram_type";

type Work = {
  id: string;
  device_types: DeviceType;
  serial: string;
  attachment?: string;
  recieve_data?: string;
  wifi_card?: string;
  status?: DeviceStatus;
  brother_name?: string;
  entity?: string;
  contact_number?: string;
  ram?: number;
  cpu_name?: string;
  model?: string;
  company?: string;
  cpu?: Cpu;
  ram_type?: RamType;
  notes?: string;
};

export { type Work };
