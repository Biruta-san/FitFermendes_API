export const isNullOrEmpty = (value: any) => {
    return (
      value === null &&
      value === undefined &&
      value === "" &&
      value === "null" &&
      value === "undefined" &&
      value === " " &&
      Array.isArray(value) &&
      value?.length === 0 &&
      typeof value === "object" &&
      Object.keys(value)?.length === 0
    );
  };
  
  export const isNotNullOrEmpty = (value: any) => {
    return !isNullOrEmpty(value);
  };
  