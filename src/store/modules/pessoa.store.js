import Router from '../../router/index';
import { getField, updateField } from 'vuex-map-fields';

export const namespaced = true;

export const state = {
  pessoas: [],
  pessoa: {
    enderecos: []
  }
};

export const getters = {
  getField,
  getEnderecos: state => state.pessoa.enderecos,
  getPessoas: state => state.pessoas,
  getPessoa: state => state.pessoa
};

export const mutations = {
  updateField,
  setCpf: (state, cpf) => (state.pessoa = cpf),
  setPessoas: (state, pessoas) => (state.pessoas = pessoas),
  setPessoa: (state, pessoa) => (state.pessoa = pessoa),
  setAddPessoa: (state, pessoa) => state.pessoas.push(pessoa),
  setIndexEnd: (state, indexEnd) => (state.indexEnd = indexEnd),
  setAddEndereco: (state, endereco) => {
    const indexEnd = state.pessoa.enderecos.findIndex(
      ende => ende.id == endereco.id
    );
    indexEnd == -1 ? state.pessoa.enderecos.push(endereco) : null;
  },
  setDeleteEndereco: (state, endereco) => {
    const newEnd = state.pessoa.enderecos.filter(end => {
      return endereco.id !== end.id;
    });
    state.pessoa.enderecos = newEnd;
  }
};
//dispatch - executar uma acao
//commit - executar uma mutation
//{commit,dispatch}
export const actions = {
  addPessoa: async ({ commit }, pessoa) => {
    commit('setAddPessoa', pessoa);
    // commit('conveniados/SET_LOGADO', data)
  },
  addPessoas: async ({ commit }, pessoas) => {
    commit('setPessoas', pessoas);
  },
  addEndereco: async ({ commit }, enderecos) => {
    commit('setAddEndereco', enderecos);
  },
  setPessoa: async ({ commit }, pessoa) => {
    commit('setPessoa', pessoa);
  },
  setIndexEnd: async ({ commit }, index) => {
    commit('setIndexEnd', index);
  },
  deleteEndereco: async ({ commit }, endereco) => {
    commit('setDeleteEndereco', endereco);
  }
};
