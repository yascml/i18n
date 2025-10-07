
export type PassagePatch = {
  /**
   * Start position of the original text
   */
  start: number,

  /**
   * End position of the original text
   */
  end: number,

  /**
   * The new text used for replacement
   */
  replace: string,
};

export type ReplaceInfo = {
  pos: number,
  
  /**
   * Target text
   */
  f: string,

  /**
   * Replaced text
   */
  t: string,

  /**
   * Passage name
   */
  pN: string,

  fileName?: string,
  js?: boolean,
  css?: boolean
};


export type I18nJson = {
  typeB: {
    TypeBOutputText?: ReplaceInfo[],
    TypeBInputStoryScript?: ReplaceInfo[],
  },
};
