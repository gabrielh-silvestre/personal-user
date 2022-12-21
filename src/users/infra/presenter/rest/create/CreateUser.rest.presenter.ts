import type {
  EmbeddedLink,
  InputRestPresenterDto,
  IRestPresenter,
  OutputRestPresenterDto,
} from '../Rest.presenter.interface';
import type { OutputCreateUserDto } from '@users/useCase/create/CreateUser.dto';

export class CreateUserRestPresenter
  implements IRestPresenter<OutputCreateUserDto>
{
  private static readonly relatedLinks: EmbeddedLink[] = [
    {
      self: { _links: { href: '/users/me' } },
    },
    {
      recoverPassword: { _links: { href: '/users/recover-password/{email}' } },
    },
  ];

  present(
    dto: InputRestPresenterDto<OutputCreateUserDto>,
  ): OutputRestPresenterDto<OutputCreateUserDto> {
    const { selfLink, data } = dto;

    return {
      _links: { self: { href: selfLink } },
      _embedded: CreateUserRestPresenter.relatedLinks,
      data,
    };
  }
}
