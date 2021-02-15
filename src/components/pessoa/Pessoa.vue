<template>
  <q-form ref="myForm" @submit="salvar">
    <div class="q-xl">
      <div class="row q-pa-xs q-ma-sm ">
        <div class="col-sm-3">
          <q-select
            class="q-pa-xs"
            filled
            v-model="tipoPessoa"
            :options="options"
            label="Tipo Pessoa"
            emit-value
            map-options
          />
        </div>
        <div class="col-sm-3">
          <q-input
            class="q-pa-xs"
            :mask="tipoPessoa == 'PF' ? '###.###.###-##' : '##.###.###/####-##'"
            v-model="documento1"
            filled
            unmasked-value
            type="text"
            :label="tipoPessoa == 'PF' ? 'CPF' : 'CNPJ'"
            :rules="tipoPessoa == 'PF' ? ruleCpf : ruleCpnj"
          />
        </div>
        <div class="col-sm-3">
          <q-input
            class="q-pa-xs"
            v-model="documento2"
            filled
            type="text"
            :label="tipoPessoa == 'PF' ? 'RG' : 'Inscrição Estadual'"
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
        <div class="col-sm-3">
          <q-input
            class="q-pa-xs"
            v-if="tipoPessoa == 'PJ'"
            v-model="documento3"
            filled
            type="text"
            label="Inscrição Municipal"
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
      </div>

      <div class="row q-pa-xs q-ma-sm">
        <div class="col-8">
          <q-input
            class="q-pa-xs"
            v-model="name"
            filled
            type="text"
            :label="tipoPessoa == 'PF' ? 'Nome' : 'Razão Social'"
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
        <div class="col-4">
          <q-input
            class="q-pa-xs"
            v-model="nascimento"
            filled
            type="text"
            mask="##/##/####"
            :label="
              tipoPessoa == 'PF' ? 'Data de Nascimento' : 'Data de Fundação'
            "
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
      </div>
      <div class="row q-pa-xs q-ma-sm">
        <div class="col-6 q-pa-xs">
          <q-input
            class="q-pa-xs"
            v-model="nickName"
            filled
            type="text"
            :label="tipoPessoa == 'PF' ? 'Apelido' : 'Nome Fantasia'"
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
        <div class="col-6 q-pa-xs">
          <q-input
            class="q-pa-xs"
            v-model="email"
            filled
            :rules="[val => !!val || 'Email is missing', isValidEmail]"
            type="email"
            label="E-mail"
          />
        </div>
      </div>
      <div class="row q-pa-xs q-ma-sm">
        <div class="col-4">
          <q-input
            class="q-pa-xs"
            v-model="telefone1"
            filled
            mask="(##) # ####-####"
            type="tel"
            label="Telefone"
            :rules="[val => (val && val.length > 0) || 'Campo Obrigatório']"
          />
        </div>
        <div class="col-4">
          <q-input
            class="q-pa-xs"
            v-model="telefone2"
            filled
            mask="(##) # ####-####"
            type="tel"
            label="Telefone (Opcional)"
          />
        </div>
        <div class="col-4">
          <q-input
            class="q-pa-xs"
            v-model="telefone3"
            filled
            mask="(##) # ####-####"
            type="tel"
            label="Telefone (Opcional)"
          />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script>
import { mapState, mapActions } from 'Vuex';
import { validateBr } from 'js-brasil';
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'Cadastro',
  computed: {
    ...mapFields('pessoas', [
      'pessoa.name',
      'pessoa.nickName',
      'pessoa.documento1',
      'pessoa.documento2',
      'pessoa.documento3',
      'pessoa.telefone1',
      'pessoa.telefone2',
      'pessoa.telefone3',
      'pessoa.tipoPessoa',
      'pessoa.nascimento',
      'pessoa.email'
    ]),
    indexend: function() {
      return 0;
    },
    pessoa: {
      get() {
        return this.$store.state.pessoas.pessoa;
      }
    }
  },
  data() {
    return {
      idEnd: 0,
      isValidEmail(val) {
        const emailPattern = /^(?=[a-zA-Z0-9@.%+-]{6,254}$)[a-zA-Z0-9.%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'Invalid email';
      },
      ruleCpnj: [
        val => val.length > 0 || val.length < 18 || 'Campo Obrigatório',
        val => validateBr.cnpj(val) || 'CNPJ Inválido!'
      ],
      ruleCpf: [
        val => val.length > 0 || val.length < 14 || 'Campo Obrigatório',
        val => validateBr.cpf(val) || 'CPF Inválido!'
      ],
      model: null,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      options: [
        {
          label: 'Pessoa Física',
          value: 'PF'
        },
        {
          label: 'Pessoa Jurídica',
          value: 'PJ'
        }
      ],

      creating: false,
      isEdit: false
      /* pessoa: {
        id: '',
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
        nascimento: ''
       }*/
    };
  },
  mounted() {
    console.log(this.pessoa);
  },
  /*  created() {
    const datas = JSON.parse(localStorage.getItem('datasApp'));
    const pessoa = datas.find(
      pessoaMap => pessoaMap.documento1 == this.$route.params.id
    );
    if (pessoa) {
      //this.pessoa = pessoa;
      pessoa.enderecos.push({
        id: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      });
      this.setPessoa(pessoa);
      this.isEdit = true;
    } else {
      this.creating = true;
      let novaPessoa = this.novaPessoa();
      novaPessoa.enderecos.push({
        id: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      });
      this.setPessoa(novaPessoa);
      this.documento1 = this.$route.params.id;

      this.isEdit = false;
      if (this.documento1.length == 11) {
        this.tipoPessoa = 'PF';
      } else {
        this.tipoPessoa = 'PJ';
      }
    }
  },
 */ methods: {
    ...mapActions('pessoas', ['setPessoa']),
    createPessoa() {
      this.creating = true;
    },
    validat() {
      if (this.email == '') {
        this.errorEmail = 'Por favor insira o E-mail';
      } else if (!this.reg.test(this.email)) {
        this.errorEmail = 'Por favor use um E-mail correto';
      }
    },
    updatePessoa(pessoa) {
      this.creating = false;
      this.pessoa = pessoa;
      this.isEdit = true;
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
      console.log('refs', this.$refs);
      this.$refs.myForm.validate().then(success => {
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
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped></style>
