export type OutputVerifyAuth = {
  userId: string;
};

export interface IAuthGateway {
  verify(token: string): Promise<OutputVerifyAuth | null>;
  generateRecoverPasswordToken(userId: string): Promise<string | never>;
}
