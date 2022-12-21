import * as ejs from 'ejs';
import { join } from 'path';

import type { ITemplateEngineAdapter } from '../TemplateEngine.adapter.interface';

export class TemplateEngineEjsAdapter implements ITemplateEngineAdapter {
  constructor(private readonly engine = ejs) {}

  render(
    template: string,
    variables: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = join(
      __dirname,
      '../../../../../..',
      'users/infra/presenter/mail',
      `${template}.template.ejs`,
    );

    return this.engine.renderFile(templatePath.toString(), variables, {
      async: true,
      beautify: false,
    });
  }
}
