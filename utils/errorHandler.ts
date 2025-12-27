export interface AppError {
  title: string;
  message: string;
  status?: number;
}

export const extractMessages = (error: any): string[] => {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors)) return data.errors;
  if (typeof data?.message === "string") return [data.message];
  if (typeof error?.message === "string") return [error.message];

  return ["Unexpected error occurred"];
};

export const handleNullUndefined = (word: any) => {
  if (word === null || word === undefined) {
    return "-";
  } else {
    return word;
  }
};
