export const isNameValid = name => {
  const regex = /^[A-Za-z0-9_-]+$/;

  return name.length >= 0 && name.length <= 15 && regex.test(name);
};
