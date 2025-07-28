const ramType = ["ddr2", "ddr3", "ddr4", "ddr5", "ddr6"] as const;
type RamType = (typeof ramType)[number];

export { ramType, type RamType };
