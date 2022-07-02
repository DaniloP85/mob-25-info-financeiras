const Schema = Mongoose.Schema;

let financeira = new Schema({
  _id: { type: String, unique: true  },
  nome_banco: { type: String },
  tipo_conta: { type: String },
  nome_titular: { type: String },
  limite_cartao: { type: String },
  id_cliente: { type: String },
}, {strict: true, _id: false, versionKey: false });

module.exports = Mongoose.model('financeira', financeira);
