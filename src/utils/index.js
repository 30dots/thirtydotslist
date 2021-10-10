import React from "react"

export const truncate = (x, y = 8) => {
  return x ? `${x.substring(0, y)}...${x.slice(-y)}` : ""
}

export const format = (x, precision = 0) => {
  return precision
    ? parseInt(x)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (parseFloat(x) - parseInt(x))
          .toFixed(precision)
          .toString()
          .replace("0.", ".")
    : parseInt(x)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatValue = (value, postfix = "") => {
  return (
    <span>
      {value || "—"}
      {value && postfix ? postfix : ""}
    </span>
  )
}

export const randomHSL = () => {
  return `hsla(${~~(360 * Math.random())},70%,70%,1)`
}
