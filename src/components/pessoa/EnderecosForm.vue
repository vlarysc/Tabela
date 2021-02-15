<template>
  <q-form @submit="salvar(endereco)" class="q-gutter-md">
    <div class="q-xl">
      <div class="row q-pa-xs q-sm ">
        <div class="col-xs-12 col-md-2">
          <q-input
            class="q-pa-xs"
            filled
            @blur="consultar"
            v-model="endereco.cep"
            label="CEP"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
        </div>
        <div class="col-xs-12 col-md-8">
          <q-input
            class="q-pa-xs"
            filled
            v-model="endereco.logradouro"
            label="Rua"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
        </div>
        <div class="col-xs-12 col-md-2">
          <q-input
            class="q-pa-xs"
            filled
            v-model="endereco.numero"
            label="N°"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
        </div>
      </div>
      <div class="row q-pa-xs q-sm">
        <div class="col-xs-12 col-md-5">
          <q-input
            class="q-pa-xs"
            filled
            v-model="endereco.bairro"
            label="Bairro"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
        </div>
        <div class="col-md-5 col-xs-12 ">
          <q-input
            class="q-pa-xs"
            filled
            v-model="endereco.cidade"
            label="Cidade"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
        </div>
        <div class="col-xs-12 col-md-2">
          <q-select
            class="q-pa-xs q-ma-none"
            filled
            v-model="endereco.uf"
            :options="ufOptions"
            option-value="uf"
            option-label="uf"
            label="UF"
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon size="xs" name="place" />
            </template>
          </q-select>
        </div>
      </div>
      <div class="row q-pa-xs q-sm">
        <div class="col-xs-12">
          <q-input
            class="q-pa-xs"
            filled
            v-model="endereco.complemento"
            label="Complemento"
          />
        </div>
      </div>
    </div>

    <div class="q-pa-sm">
      <q-btn
        label="Finalizar"
        class="add-row"
        @click="salvar()"
        color="yellow-9"
        text-color="black"
      />
    </div>
  </q-form>
</template>

<script>
import { ufoptions } from 'src/utils/uf';
export default {
  name: 'endereco',
  props: ['endereco'],

  computed: {
    ufOptions: () => ufoptions
  },
  data() {
    return {
      model: null
    };
  },

  methods: {
    salvar() {
      this.$emit('fechar', this.endereco);
    },
    async consultar() {
      console.log(this.endereco);
      const result = await this.$axios
        .get(`http://viacep.com.br/ws/${this.endereco.cep}/json/`)
        .then(res => res)
        .catch(error => error);
      if (result.status == 200 && !result.data.erro) {
        const data = result.data;
        this.endereco.logradouro = data.logradouro;
        this.endereco.bairro = data.bairro;
        this.endereco.cidade = data.localidade;
        this.endereco.uf = data.uf;
      } else {
        this.$q.notify('Erro ao consultar o CEP');
      }
      console.log(result);
    }
  }
};
</script>

<style></style>
