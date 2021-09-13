export const epochToDate = (epoch: any) => {
  if (epoch < 10000000000) epoch *= 1000
  return new Date(epoch)
}
