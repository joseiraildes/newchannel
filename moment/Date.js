const moment = require("moment")
moment.locale("pt-br")

function Date(){
  const dataAtual = moment()
  const dateFormat = dataAtual.format("dddd, D [de] MMMM [de] YYYY")

  return dateFormat
}

module.exports = Date