export const epochToDate = (epoch: string | number) => {
  epoch = typeof epoch === "string" ? Number(epoch.replace(/\,/g, "")) : epoch
  if (epoch < 10000000000) epoch *= 1000
  return new Date(epoch)
}
