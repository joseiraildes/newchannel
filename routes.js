const express = require("express")
const app = require("./config/config.js")
const fetchIP = require("./infra/ip.js")
const User = require("./models/User.js")
const hbs = require("express-handlebars")
const path = require("path")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.engine("hbs", hbs.engine({
  extname: ".hbs",
  defaultLayout: "main",
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname + "/views"))


app.get("/", async(req, res)=>{
  const ip = await fetchIP()

  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark">Registrar-se</button>
    `
    res.render("home", {
      buttons
    })
  }else{
    res.render("home", {
      buttons: `
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/@${user['nome']}'"><strong>@${user["nome"]}</strong></button>
      `
    })
  }
})