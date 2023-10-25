export type TokenPayload = {
  userId: string;
};

export interface ITokenGateway {
  validate(token: string): Promise<TokenPayload | null>;
  generate(userId: string): Promise<string>;
}
