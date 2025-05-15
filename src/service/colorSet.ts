export const colorSet = (n: number) => {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const color = `hsl(${(i * 360) / n}, 100%, 66%)`;
    colors.push(color);
  }
  return colors;
};
