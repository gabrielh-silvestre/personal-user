export type InputDeliveryInfo = {
  email: string;
  username: string;
};

export type InputRecoverPasswordInfo = {
  email: string;
  username: string;
  token: string;
};

export interface IMailGateway {
  welcomeMail(user: InputDeliveryInfo): Promise<void>;
  recoverPasswordMail(data: InputRecoverPasswordInfo): Promise<void>;
}
