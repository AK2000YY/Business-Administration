const passwordType = ["ويندوز", "لينيكس"] as const;
type PasswordType = (typeof passwordType)[number];

type Password = {
  id: string;
  type: PasswordType;
  number: number;
  username: string;
  bios: string;
  ice: string;
  system: string;
  file?: string;
};

export { type Password, passwordType, type PasswordType };
