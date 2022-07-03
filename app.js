const PROTO_PATH = "./info-financeiras.proto";
const grpc = require("grpc");
const carregarProto = require("@grpc/proto-loader");
global.Mongoose = require("mongoose");
Mongoose.connect("mongodb://localhost:27017/local");
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
    financeiraModel.find((erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: "parameters invalid",
        });
      }

      callback(null, {InfoFinanceiras});

    });
  },
  getById: (call, callback) => {
    financeiraModel.find({ id_cliente: call.request.id_cliente }, (erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: "parameters invalid",
        });
      }
      
      callback(null, {InfoFinanceiras});
    });
  },
  insert: (call, callback) => {
    let info = {
      nome_banco: call.request.nome_banco,
      tipo_conta: call.request.tipo_conta,
      nome_titular: call.request.nome_titular,
      limite_cartao: call.request.limite_cartao,
      id_cliente: call.request.id_cliente,
    };

    if (call.request.id_cliente != undefined) {
      new financeiraModel(info).save(function(err, InfoFinanceiras) {
        if (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "id_cliente nao informado",
          });          
        }
        callback(null, InfoFinanceiras);
      });
    } else {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "id_cliente nao informado",
      });
    }
  },
  update: (call, callback) => {
    financeiraModel.findByIdAndUpdate( call.request._id, call.request, { new: true }, (erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: "nao foi possivel atualizar",
        });
      }
      
      callback(null, InfoFinanceiras);
    });
  },
  delete: (call, callback) => {
    //TODO: implement delete implement
  },
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
