const PROTO_PATH = "./info-financeiras.proto";
const grpc = require("grpc");
const carregarProto = require("@grpc/proto-loader");
global.Mongoose = require("mongoose");
Mongoose.connect("mongodb://localhost:27017/local");
const { v4: uuidv4 } = require("uuid");
const financeiraModel = require("./models/financeira");
const definicao = carregarProto.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const Proto = grpc.loadPackageDefinition(definicao);
const server = new grpc.Server();

server.addService(Proto.Gerenciar.service, {
  get: (_, callback) => {
    // TODO: implement get method
  },
  getById: (call, callback) => {
    //TODO: implement getById implement
  },
  insert: (call, callback) => {
    let info = {
      nome_banco: call.request.nome_banco,
      tipo_conta: call.request.tipo_conta,
      nome_titular: call.request.nome_titular,
      limite_cartao: call.request.limite_cartao,
      _id: uuidv4(),
      id_cliente: call.request.id_cliente,
    };

    if (call.request.id_cliente != undefined) {
      new financeiraModel(info).save();
      callback(null, info);
    } else {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "id_cliente nao informado",
      });
    }
  },
  update: (call, callback) => {
    //TODO: implement update implement
  },
  delete: (call, callback) => {
    //TODO: implement delete implement
  },
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
