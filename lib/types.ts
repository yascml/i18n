
export type PassagePatch = {
  /**
   * Start position of the original text
   */
  position: number,

  /**
   * The original text used for replacement
   */
  from: string,

  /**
   * The new text used for replacement
   */
  to: string,
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
