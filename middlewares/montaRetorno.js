function montaRetorno(dados, menssagem) {

    let alert
    let status = 200
    if (!dados) {
        alert = 'fail'
        status = 404
    } else {
        alert = dados.length == 0 ? 'warning' : 'success'
    }

    return [
        status,
        {
            "alert": alert,
            "message": menssagem,
            "data": dados
        }
    ];
}

module.exports = montaRetorno