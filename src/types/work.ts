import type { DeviceType } from "./device_type"
import type { Service } from "./service";

type Work = {
  id: string;
  device_name: string;
  device_types: DeviceType;
  owning_entity: string;
  notes: string;
  services: Service[];
  serial: string;
};


export { type Work }