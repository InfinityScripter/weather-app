import moment from "moment";

export const kelvinToCelsius = (kelvin: number) => {
  return Math.round(kelvin - 273.15);
};

export const kelvinToFahrenheit = (kelvin: number) => {
  return Math.round((kelvin - 273.15) * 9 / 5 + 32);
};

export const unixToTime = (unix: number, timezone: number) => {
  return moment
    .unix(unix)
    .utcOffset(timezone / 60)
    .format("HH:mm");
};

export const unixToDay = (unix: number) => {
  return moment.unix(unix).format("ddd");
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num;
  }
};

export const airQulaityIndexText = [
  {
    rating: 10,
    description: "отличное",
  },
  {
    rating: 20,
    description: "хорошее",
  },
  {
    rating: 30,
    description: "удовлетворительное",
  },
  {
    rating: 40,
    description: "достаточное",
  },
  {
    rating: 50,
    description: "среднее",
  },
  {
    rating: 60,
    description: "среднее",
  },
  {
    rating: 70,
    description: "плохое",
  },
  {
    rating: 80,
    description: "плохое",
  },
  {
    rating: 90,
    description: "очень плохое",
  },
  {
    rating: 100,
    description: "очень плохое",
  },
];
