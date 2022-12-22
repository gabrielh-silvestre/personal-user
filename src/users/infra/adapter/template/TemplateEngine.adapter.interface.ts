export interface ITemplateEngineAdapter {
  render(template: string, variables: Record<string, unknown>): Promise<string>;
}
