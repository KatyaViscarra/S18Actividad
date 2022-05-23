const fs = require('fs')

const save = (newUser) => {
    fs.readFile ("userData.js", (err, data) => {
        if (err) {
            throw err
        } 

        var datos = data.toString();
        var indice = 0
        for (let index = 0; index < datos.length; index++) {
        if (datos[index]==="]") {
            indice = index
            break
        } 
    }

    var registro = datos.slice(0, indice-1)
    var writeUser = registro + newUser + "];" + "module.exports= {data}"

        fs.writeFile("userData.js", writeUser, (err) => {
            if (err) {throw err}
        })
    })
}

module.exports= {save}