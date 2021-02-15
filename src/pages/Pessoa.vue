<template>
  <div>
    <Tabs ref="tabs"></Tabs>
    <div class="q-pa-sm">
      <q-btn
        class="q-ml-sm"
        v-if="!isEdit"
        type="submit"
        @click.prevent="salvar()"
        color="yellow-9"
        text-color="black"
        icon="person_add"
        label="Continuar"
      >
      </q-btn>
      <q-btn
        class="q-ml-sm"
        v-if="isEdit"
        @click.prevent="updat(pessoa)"
        color="yellow-9"
        text-color="black"
        type="submit"
        icon="system_update_alt"
        label="Atualizar"
      >
      </q-btn>
      <q-btn
        class="q-ml-sm"
        to="/"
        color="yellow-9"
        text-color="black"
        icon="arrow_back"
        label="Voltar"
      >
      </q-btn>
    </div>
  </div>
</template>

<script>
import Tabs from 'src/components/pessoa/Tabs.vue';
import { mapActions } from 'Vuex';
export default {
  components: { Tabs },
  computed: {
    pessoa: {
      get() {
        return this.$store.state.pessoas.pessoa;
      }
    }
  },
  methods: {
    ...mapActions('pessoas', ['setPessoa']),
    novaPessoa() {
      return {
        tipoPessoa: '',
        name: '',
        nickName: '',
        email: '',
        documento1: '',
        documento2: '',
        documento3: '',
        telefone1: '',
        telefone2: '',
        telefone3: '',
        nascimento: '',
        enderecos: []
      };
    },
    updat(pessoa) {
      let pessoas = JSON.parse(localStorage.getItem('datasApp'));
      let datas = pessoas.map(pessoaMap => {
        if (pessoaMap.documento1 == pessoa.documento1) {
          return pessoa;
        } else {
          return pessoaMap;
        }
      });
      this.isEdit = false;

      localStorage.setItem('datasApp', JSON.stringify(datas));
      this.pessoa = this.novaPessoa();
      this.$router.go(-1);
    },
    voltar() {
      this.$router.go(-1);
    },

    salvar() {
      if (this.pessoa.enderecos.length > 0) {
        this.$refs.tabs.tab = 'cadastro';
        this.$refs.tabs.$refs.pessoa.$refs.myForm.validate().then(success => {
          if (success) {
            let datas = localStorage.getItem('datasApp');

            if (datas) {
              datas = JSON.parse(datas);
            } else datas = [];

            datas.push(this.pessoa);
            this.pessoas = datas;

            localStorage.setItem('datasApp', JSON.stringify(datas));

            this.$router.go(-1);
          } else {
            this.$q.notify('Por favor informe obrigatórios da Pessoa');
          }
        });
      } else {
        this.$refs.tabs.tab = 'endereco';
        this.$q.notify('Por favor informe pelo menos um endereço');
      }
    }
  },
  created() {
    const datas = JSON.parse(localStorage.getItem('datasApp'));
    const pessoa = datas
      ? datas.find(pessoaMap => pessoaMap.documento1 == this.$route.params.id)
      : null;
    if (pessoa) {
      //this.pessoa = pessoa;
      // pessoa.enderecos.push({
      //   id: '',
      //   cep: '',
      //   logradouro: '',
      //   numero: '',
      //   complemento: '',
      //   bairro: '',
      //   cidade: '',
      //   uf: ''
      // });
      this.setPessoa(pessoa);
      this.isEdit = true;
    } else {
      this.creating = true;
      let novaPessoa = this.novaPessoa();
      // novaPessoa.enderecos.push({
      //   id: '',
      //   cep: '',
      //   logradouro: '',
      //   numero: '',
      //   complemento: '',
      //   bairro: '',
      //   cidade: '',
      //   uf: ''
      // });
      novaPessoa.documento1 = this.$route.params.id;
      if (novaPessoa.documento1.length == 11) {
        novaPessoa.tipoPessoa = 'PF';
      } else {
        novaPessoa.tipoPessoa = 'PJ';
      }
      this.setPessoa(novaPessoa);

      this.isEdit = false;
    }
  }
};
</script>

<style></style>
