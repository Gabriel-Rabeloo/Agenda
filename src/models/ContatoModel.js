const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    createdIn: { type: Date, default: Date.now },
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body) {
    this.body = body
    this.errors = []
    this.contato = null
}

Contato.searchById = async function (id) {
    if (typeof id !== 'string') return
    const user = await ContatoModel.findById(id)
    return user
}

Contato.prototype.register = async function () {
    this.valid()
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valid = function () {
    this.cleanUp()
    // Validação de campos
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
    if (!this.body.name) this.errors.push('Nome é um campo obrigatório')
    if (!this.body.email && !this.body.phone) {
        this.errors.push('Pelo menos um contato precisa ser enviado(e-mail ou telefone)')
    }
}

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = ''
        }
    }

    this.body = {
        name: this.body.name,
        lastName: this.body.lastName,
        email: this.body.email,
        phone: this.body.phone,
    }
}

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return
    this.valid()
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}

// Métodos estáticos(não vão para o prototype)


Contato.searchById = async function (id) {
    if (typeof id !== 'string') return
    const contato = await ContatoModel.findById(id)
    return contato
}

Contato.searchContacts = async function () {
    const contatos = await ContatoModel.find()
        .sort({ createdIn: -1 }) // Ordem decrescente
    return contatos
}

Contato.delete = async function (id) {
    if (typeof id !== 'string') return
    const contact = await ContatoModel.findOneAndDelete({_id: id})
    return contact
}
module.exports = Contato