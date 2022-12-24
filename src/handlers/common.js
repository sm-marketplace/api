import { STAGE } from "../config.js"

export const handleHello = (req, res, next) => {
  res.json({
    msg: "Hello friend",
  })

  next()
}

export const handleMe = (req, res, next) => {
  res.json({
    name: "Roger Ramos Paredes",
    student: true,
    age: 24
  })

  next()
}

export const handleInfo = (req, res, next) => {
  res.json({
    env: STAGE,
    version: "v1.0.0",
    cambioDePrueba: "Expo final 24-12-2022"
  })

  next()
}