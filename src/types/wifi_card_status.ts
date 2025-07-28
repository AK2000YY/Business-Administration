const wifiCardStatus = ["نعم", "لا تم فكه مسبقا", "لا الجهاز للتواصل"] as const;
type WifiCardStatus = (typeof wifiCardStatus)[number];

export { wifiCardStatus, type WifiCardStatus };
