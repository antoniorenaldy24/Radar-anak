export type SubjectProfile = {
  id: string;
  initials: string;
  age: string;
  location: string;
  dateLocked: string;
  rootProblem: string;
  dream: string;
  advocacyNote: string;
  rw: string;
  pos: [number, number];
  cases: number;
};

export const SUBJECT_DATA: SubjectProfile[] = [];
