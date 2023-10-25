import { TokenGateway } from './Token.gateway';

describe('Unit test for Token gateway', () => {
  let jwtService: any;

  let tokenGateway: TokenGateway;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 'any_id' }),
      signAsync: jest.fn().mockResolvedValue('any_token'),
    };

    tokenGateway = new TokenGateway(jwtService);
  });

  it('should validate a token', async () => {
    const result = await tokenGateway.validate('any_token');

    expect(result).toEqual({ userId: expect.any(String) });
    expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
  });

  it('should generate a token', async () => {
    const result = await tokenGateway.generate('any_id');

    expect(result).toEqual(expect.any(String));
    expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
  });
});
