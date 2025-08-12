const passwordType = ["ويندوز", "لينيكس", "وحدة تخزين"] as const;
type PasswordType = (typeof passwordType)[number];

type Password = {
  id: string;
  type?: PasswordType;
  number?: number;
  username: string;
  bios: string;
  ice: string;
  system: string;
  file?: string;
  file_arabic?: string;
  is_used: boolean;
  lock: string;
};

export { type Password, passwordType, type PasswordType };
