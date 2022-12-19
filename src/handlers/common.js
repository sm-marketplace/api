import { STAGE } from "../config.js"

export const handleHello = (req, res) => {
  res.json({
    msg: "Hello friend",
  })
}

export const handleMe = (req, res) => {
  res.json({
    name: "Roger Ramos Paredes",
    student: true,
    age: 24
  })
}

export const handleInfo = (req, res) => {
  res.json({
    env: STAGE,
    version: "v1.0.0"
  })
}