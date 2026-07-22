declare module "split-type" {
  export default class SplitType {
    constructor(
      target: string | Element | NodeList | Array<Element>,
      options?: {
        types?: string;
        splitClass?: string;
        absolute?: boolean;
        tagName?: string;
      }
    );
    lines: HTMLElement[] | null;
    words: HTMLElement[] | null;
    chars: HTMLElement[] | null;
    revert(): void;
    static create(
      target: string | Element | NodeList | Array<Element>,
      options?: {
        types?: string;
        splitClass?: string;
        absolute?: boolean;
        tagName?: string;
      }
    ): SplitType;
  }
}
