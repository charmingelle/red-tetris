export const isNameValid = name => {
  const regex = /^[A-Za-z0-9_-]+$/;

  return name.length >= 0 && name.length <= 15 && regex.test(name);
};

const isHashValid = hash =>
  hash && hash[hash.length - 1] === ']' && hash.split('[').length === 2;

export const getRoomIdAndPlayerName = hash => {
  if (!hash) {
    return null;
  }
  if (!isHashValid(hash)) {
    return { error: true };
  }
  const cutHash = hash.substring(1, hash.length - 1);
  const roomId = cutHash.split('[')[0];
  const playerName = cutHash.split('[')[1];

  return isNameValid(roomId) && isNameValid(playerName)
    ? { roomId, playerName }
    : { error: true };
};

export const transposeSquareMatrix = matrix => {
  let temp;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix.length; j++) {
      temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
};

export const reverseSquareMatrixRows = matrix => {
  let temp;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0, k = matrix.length - 1; j < k; j++, k--) {
      temp = matrix[j][i];
      matrix[j][i] = matrix[k][i];
      matrix[k][i] = temp;
    }
  }
};
