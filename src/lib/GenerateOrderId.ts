interface Prop {
  restaurantId: string;
}

export const GenerateOrderId = (restaurantId: string): string => {
  const idSuffix = restaurantId.slice(-4).toUpperCase().padStart(4, "X");

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

  return `#${seconds}${minutes}${hours}${idSuffix}${randomPart}`;
};
