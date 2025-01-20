export const getImagePath = (fileName: string) => {
  return `${process.env.PUBLIC_URL}/images/${fileName}.png`;
};
