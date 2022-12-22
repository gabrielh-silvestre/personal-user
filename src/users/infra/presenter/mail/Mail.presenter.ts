import { Inject, Injectable } from '@nestjs/common';

import type {
  IMailPresenter,
  InputMailPresenterDto,
  OutputMailPresenterDto,
} from './Mail.presenter.interface';
import type { ITemplateEngineAdapter } from '@users/infra/adapter/template/TemplateEngine.adapter.interface';

import { TEMPLATE_ADAPTER } from '@users/utils/constants';

@Injectable()
export class MailPresenter implements IMailPresenter {
  constructor(
    @Inject(TEMPLATE_ADAPTER)
    private readonly templateEngine: ITemplateEngineAdapter,
  ) {}

  async present(
    emailTemplate: string,
    dto: InputMailPresenterDto,
  ): Promise<OutputMailPresenterDto> {
    const html = await this.templateEngine.render(emailTemplate, { ...dto });

    return { html };
  }
}
