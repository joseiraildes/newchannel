const express = require("express")
const app = require("./config/config.js")
const fetchIP = require("./infra/ip.js")
const User = require("./models/User.js")
const hbs = require("express-handlebars")
const path = require("path")
const formatUser = require("./user/formatUser.js")
const Date = require("./moment/Date.js")
const moment = require("moment")
const { marked } = require("marked")
const Post = require("./models/Post.js")
const MySql = require("./infra/mysql.js")
const Comments = require("./models/Comment.js")

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
  const mysql = await MySql()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  const [ post, rowsPost ] = await mysql.query(`
    SELECT *
    FROM posts
    ORDER BY RAND() LIMIT 30
  `)

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("home", {
      buttons,
      post
    })
  }else{
    res.render("home", {
      buttons: `
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/@${user['nome']}'"><strong>@${user["nome"]}</strong></button>
      `,
      post
    })
  }
})

app.get("/cadastro", async(req, res)=>{
  const ip = await fetchIP()

  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render(
      "cadastro",
      {
        buttons
      }
    )
  }else{
    res.redirect("/")
  }
})
app.post("/cadastro", async(req, res)=>{
  const ip = await fetchIP()
  const { email, senha } = req.body
  const nome = formatUser(req.body.nome)

  const findUser = await User.findOne({
    where: {
      nome,
      email
    }
  })

  if(findUser === null){
    const user = await User.create({
      nome,
      email,
      senha,
      biografia: "",
      ip: ip.ip,
      data: Date()
    })
    res.redirect("/")
  }else{
    const error = `
    <div class="alert aler-danger" rule="alert">
      <strong>Email ou Senha já cadastrados!</strong>
    </div>
    `
    res.render("cadastro", {
      buttons: `
      <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
      `,
      error
    })
  }
})
app.get("/login", async(req, res)=>{
  const ip = await fetchIP()

  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("login", {
      buttons
    })
  }else{
    res.redirect("/")
  }
})
app.post("/login", async(req, res)=>{
  const ip = await fetchIP()
  const { email, senha } = req.body

  const user = await User.findOne({
    where: {
      email,
      senha
    }
  })
  
  if(user === null){
    const error = `
    <div class="alert alert-danger" role="alert">
      <strong>Email ou Senha inválidos!</strong>
    </div>
    `
    res.render("login", {
      buttons: `
      <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
      `,
      error
    })
  }else{
    await User.update({
      ip: ip.ip
    }, {
      where: {
        email,
        senha
      }
    })
    res.redirect("/")
  }
})
app.get("/pesquisar", async(req, res)=>{
  const ip = await fetchIP()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("pesquisar", {
      buttons
    })
  }else{
    res.render("pesquisar", {
      buttons: `
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/@${user['nome']}'"><strong>@${user["nome"]}</strong></button>
      `
    })
  }
})
app.get("/publicar", async(req, res)=>{
  const ip = await fetchIP()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("error/not_access", {
      buttons
    })
  }else{
    res.render("publicar", {
      buttons: `
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/@${user['nome']}'"><strong>@${user["nome"]}</strong></button>
      `
    })
  }
})
app.post("/publicar", async(req, res)=>{
  const ip = await fetchIP()
  const { titulo, fonte } = req.body
  const conteudo = marked(req.body.conteudo)
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("error/not_access", {
      buttons
    })
  }else{
    const post = await Post.create({
      nome: user["nome"],
      titulo,
      conteudo,
      fonte,
      data: Date()
    })
    res.redirect("/")
  }
})

app.get("/@:nome/:id/:titulo", async(req, res)=>{
  const ip = await fetchIP()
  const mysql = await MySql()
  const { nome, id, titulo } = req.params
  const user = await User.findOne({
    where: {
      nome
    }
  })
  const [ comments, rowsComment ] = await mysql.query(`
    SELECT *
    FROM comentarios
    WHERE post_id = "${id}"
    `)
  const [ post, rows ] = await mysql.query(`
    SELECT *
    FROM posts
    WHERE nome = "${nome}" AND id = "${id}"
  `)
  if(user === null){
    const buttons = `
    <button type="button" class="btn btn-sm btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
    <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/cadastro'">Registrar-se</button>
    `
    res.render("post", {
      buttons,
      posts,
      comments
    })
  }else{
    res.render("post", {
      buttons: `
      <button type="button" class="btn btn-sm btn-dark" onclick="location.href='/@${user['nome']}'"><strong>@${user["nome"]}</strong></button>
      `,
      post,
      comments
    })
  }
})
app.post("/@:nome/:id/:titulo/comentar", async(req, res)=>{
  const ip = await fetchIP()
  const mysql = await MySql()
  const { nome, id, titulo } = req.params
  const comentario = marked(req.body.comentario)
  const user = await User.findOne({
    where: {
      nome
    }
  })

  if(user === null){
    res.send(`
      <script>
        alert("Você precisa estar logado para comentar.")
      </script>
    `)
  }else{
    await Comments.create({
      nome: user["nome"],
      comentario,
      data: Date(),
      post_id: id
    })
    res.redirect(`/@${nome}/${id}/${titulo}`)
  }
})