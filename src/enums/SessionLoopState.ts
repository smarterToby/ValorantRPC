export enum SessionLoopState {
  MENUS = 'MENUS',
  PREGAME = 'PREGAME',
  INGAME = 'INGAME',
}

export const convertStringToSessionLoopState = (
  value: string
): SessionLoopState | null => {
  if (value in SessionLoopState) {
    return SessionLoopState[value as keyof typeof SessionLoopState];
  }
  return null;
};
