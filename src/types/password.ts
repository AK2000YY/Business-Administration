const passwordType = ["ويندوز", "لينيكس"];
type PasswordType = (typeof passwordType)[number];

type Password = {
  id: string;
  type: PasswordType;
  number: number;
};

export { type Password, passwordType, type PasswordType };
