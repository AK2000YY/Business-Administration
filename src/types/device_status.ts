const deviceStatus = ["جيد", "جيد جدا", "ممتاز"] as const;
type DeviceStatus = (typeof deviceStatus)[number];

export { deviceStatus, type DeviceStatus };
