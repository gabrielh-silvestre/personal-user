import type {
  InputRestPresenterDto,
  IRestPresenter,
  OutputRestPresenterDto,
} from '../Rest.presenter.interface';
import type { OutputGetMeDto } from '@users/useCase/getMe/GetMe.dto';

export class GetMePresenter implements IRestPresenter<OutputGetMeDto> {
  present(
    dto: InputRestPresenterDto<OutputGetMeDto>,
  ): OutputRestPresenterDto<OutputGetMeDto> {
    const { selfLink, data } = dto;

    return {
      _links: { self: { href: selfLink } },
      _embedded: [],
      data,
    };
  }
}
