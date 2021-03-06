<template>
  <div class="q-pa-md">
    <q-table
      dense
      title="Pessoas"
      :data="pessoas"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-documento1="props">
        <q-td :props="props">
          <div v-if="props.row.tipoPessoa == 'PF'">
            {{ props.row.documento1 | vueBrazil('cpf') }}
          </div>
          <div v-else>
            {{ props.row.documento1 | vueBrazil('cnpj') }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-option="props">
        <q-td :props="props">
          <div class="q-pa-sm q-gutter-sm">
            <q-btn
              size="sm"
              color="yellow-9"
              @click="update(props.row)"
              icon="create"
            />
            <q-btn
              size="sm"
              color="red"
              @click="remove(props.row.documento1)"
              text-color="white"
              icon="delete_forever"
            >
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
    <div class="q-pa-md q-gutter-xl">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          style="margin-right: 40px;"
          label="Adicionar"
          color="yellow-9"
          class="text-black"
          @click="medium = true"
        />
        <q-form>
          <q-dialog v-model="medium">
            <q-card style="width: 300px; ">
              <q-card-section> </q-card-section>
              <template>
                <div class="q-pa-md" style="max-width: 300px">
                  <div class="q-gutter-md">
                    <q-select
                      filled
                      v-model="tipoPessoa"
                      :options="options"
                      option-value="value"
                      option-label="label"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </template>

              <q-input
                v-if="tipoPessoa == 'PF'"
                dense
                outlined
                v-model="documento1"
                square
                mask="###.###.###-##"
                unmasked-value
                placeholder="Pesquisar CPF"
                class="bg-white col"
                :rules="ruleCpf"
              />

              <q-input
                v-else
                dense
                outlined
                v-model="documento1"
                square
                mask="##.###.###-####-##"
                unmasked-value
                placeholder="Pesquisar CPNJ"
                class="bg-white col"
                :rules="ruleCpnj"
              />

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn
                  type="submit"
                  flat
                  label="Continuar"
                  v-close-popup
                  @click.prevent="search()"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validateBr } from 'js-brasil';
import { mapState, mapActions } from 'Vuex';

export default {
  name: 'PageIndex',
  created() {
    let datas = localStorage.getItem('datasApp');
    if (datas) {
      datas = JSON.parse(datas);
      this.addPessoas(datas);
    }
  },
  methods: {
    ...mapActions('pessoas', ['addPessoas', 'addEndereco']),
    search() {
      this.$router.push('cadastro/' + this.documento1);
    },
    createPessoa() {
      this.creating = true;
    },

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
        nascimento: ''
      };
    },
    update(pessoa) {
      this.$router.push('cadastro/' + pessoa.documento1);
    },
    remove(pessoaId) {
      this.$swal({
        icon: 'question',
        title: 'Tem certeza que deseja EXCLUIR?',

        showCancelButton: true,
        confirmButtonText: `Excluir`,
        cancelButtonText: `Cancelar`
      }).then(result => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let datas = localStorage.getItem('datasApp');
          if (!datas) return;

          datas = JSON.parse(datas);

          datas = datas.filter(pessoa => {
            return pessoa.documento1 != pessoaId;
          });

          this.addPessoas(datas);

          localStorage.setItem('datasApp', JSON.stringify(datas));
        }
      });
    },
    salvar(pessoa) {
      let datas = localStorage.getItem('datasApp');

      pessoa.id = new Date().getTime();

      if (datas) {
        datas = JSON.parse(datas);
      } else datas = [];

      if (this.creating) {
        //aqui vai fazer a logica para quando for nova pessoa
        datas.push(pessoa);
        this.pessoas = datas;
      } else {
        //codigo para alterar os dados. logica para alterar a pessoa
        //achar o indice no array
        //index do datas
        //subistituir a pessoa pela atualizacao
      }

      localStorage.setItem('datasApp', JSON.stringify(datas));
      this.pessoa = this.novaPessoa();
    }
  },
  computed: {
    ...mapState('pessoas', ['pessoas'])
  },
  data() {
    return {
      ruleCpnj: [
        val => val.length > 0 || val.length < 18 || 'Campo Obrigatório',
        val => validateBr.cnpj(val) || 'CNPJ Inválido!'
      ],
      ruleCpf: [
        val => val.length > 0 || val.length < 14 || 'Campo Obrigatório',
        val => validateBr.cpf(val) || 'CPF Inválido!'
      ],
      tipoPessoa: 'PF',
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
      prompt: false,

      address: '',

      medium: false,
      creating: false,
      isEdit: false,
      columns: [
        {
          name: 'tipoPessoa',
          label: 'Tipo',
          align: 'left',
          field: 'tipoPessoa',
          sortable: true
        },
        {
          name: 'nome',
          align: 'left',
          label: 'Nome',
          field: 'name',
          sortable: true
        },
        {
          name: 'nickName',
          align: 'left',
          label: 'Apelido',
          field: 'nickName',
          sortable: true
        },
        { name: 'email', align: 'center', label: 'E-mail', field: 'email' },
        {
          name: 'telefone1',
          align: 'center',
          label: 'Telefone',
          field: 'telefone1'
        },
        {
          name: 'documento1',
          align: 'center',
          label: 'CPF ou CNPJ',
          field: 'documento1'
        },
        {
          name: 'nascimento',
          align: 'center',
          label: 'Data de Nascimento',
          field: 'nascimento',
          sortable: true
        },

        { name: 'option', align: 'center', label: 'Opções', sortable: false }
      ],

      documento1: ''
    };
  }
};
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

body,
html {
  height: 100%;
  font-family: Poppins-Regular, sans-serif;
}
.notification {
  font-weight: 600;
  width: 100px;
  size: 500px;
  display: flex;
}
.abc {
  height: 100%;
  width: 100%;
}
/*---------------------------------------------*/
a {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
  outline: none !important;
}

a:hover {
  text-decoration: none;
  color: #57b846;
}

/*---------------------------------------------*/
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
}

p {
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
}

ul,
li {
  margin: 0px;
  list-style-type: none;
}

/*---------------------------------------------*/
input {
  outline: none;
  border: none;
}

textarea {
  outline: none;
  border: none;
}

textarea:focus,
input:focus {
  border-color: transparent !important;
}

input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
input:-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
input::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
input:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

textarea::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
textarea:-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
textarea::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}
textarea:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

/*---------------------------------------------*/
button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

iframe {
  border: none !important;
}

/*//////////////////////////////////////////////////////////////////
[ Contact 2 ]*/
.bg-contact3 {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.container-contact3 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #2945c4;
}

.wrap-contact3 {
  width: 100%;
  background: #2945c4;
  background: -webkit-linear-gradient(45deg, #2945c4, #636fe0);
  background: -o-linear-gradient(45deg, #2945c4, #636fe0);
  background: -moz-linear-gradient(45deg, #2945c4, #636fe0);
  background: linear-gradient(45deg, #2945c4, #636fe0);
}

/*------------------------------------------------------------------
[  ]*/

.contact3-form {
  width: 50%;
  margin-bottom: 110px;
}

.contact3-form-title {
  font-family: Poppins-Bold;

  color: #fff;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
}

/*------------------------------------------------------------------
[  ]*/

.wrap-input3 {
  width: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255, 255, 255, 0.24);
  margin-bottom: 27px;
}

.input3 {
  display: block;
  width: 100%;
  background: transparent;
  font-family: Poppins-Regular;
  font-size: 18px;
  color: #fff;
  line-height: 1.2;
  padding: 0 5px;
}

.focus-input3 {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.focus-input3::before {
  content: '';
  display: block;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;

  background: #fff;
}

/*---------------------------------------------*/
input.input3 {
  height: 45px;
}

textarea.input3 {
  min-height: 115px;
  padding-top: 13px;
  padding-bottom: 13px;
}

.input3:focus + .focus-input3::before {
  width: 100%;
}

.has-val.input3 + .focus-input3::before {
  width: 100%;
}

/*------------------------------------------------------------------
[  ]*/
.container-contact3-form-btn {
}

.contact3-form-btn {
  font-family: Poppins-Medium;
  margin-left: 10px;
  color: #555555;
  line-height: 1.2;
  text-transform: uppercase;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;

  border-radius: 2px;
  position: relative;
  z-index: 1;
  background: #211994;
  background: #2945c4;
  background: -webkit-linear-gradient(45deg, #2945c4, #636fe0);
  background: -o-linear-gradient(45deg, #2945c4, #636fe0);
  background: -moz-linear-gradient(45deg, #2945c4, #636fe0);
  background: linear-gradient(45deg, #2945c4, #636fe0);

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.contact3-form-btn::before {
  content: '';
  display: block;
  position: absolute;
  z-index: -1;
  border-radius: 2px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
  opacity: 1;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.contact3-form-btn:hover {
  color: #fff;
}

.contact3-form-btn:hover:before {
  opacity: 0;
}

/*------------------------------------------------------------------
[ Responsive ]*/

@media (max-width: 576px) {
  .wrap-contact3 {
    padding: 72px 15px 65px 15px;
  }
}

/*------------------------------------------------------------------
[ Alert validate ]*/

.validate-input {
  position: relative;
}

.alert-validate::before {
  content: attr(data-validate);
  position: absolute;
  max-width: 70%;
  background-color: #fff;
  border: 1px solid #c80000;
  border-radius: 2px;
  padding: 4px 25px 4px 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 0px;
  pointer-events: none;

  font-family: Poppins-Regular;
  color: #c80000;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;

  visibility: hidden;
  opacity: 0;

  -webkit-transition: opacity 0.4s;
  -o-transition: opacity 0.4s;
  -moz-transition: opacity 0.4s;
  transition: opacity 0.4s;
}

.alert-validate::after {
  content: '\f12a';
  font-family: FontAwesome;
  display: block;
  position: absolute;
  color: #c80000;
  font-size: 16px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
}

.alert-validate:hover:before {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 992px) {
  .alert-validate::before {
    visibility: visible;
    opacity: 1;
  }
}

/*==================================================================
[ Restyle Radio ]*/
.wrap-contact3-form-radio {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 37px;
}

.input-radio3 {
  display: none;
}

.label-radio3 {
  display: block;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  font-family: Poppins-Medium;
  font-size: 18px;
  color: #fff;
  line-height: 1.2;
}

.label-radio3::before {
  content: '';
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.1);
  left: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.label-radio3::after {
  content: '';
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 6px solid transparent;
  background: rgba(255, 255, 255, 0.5);
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
  left: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  display: none;
}

.input-radio3:checked + .label-radio3::after {
  display: block;
}

/*==================================================================
[ Input3 select ]*/

.input3-select {
  display: none;
}

/*//////////////////////////////////////////////////////////////////
[ Restyle Select2 ]*/

.select2-container {
  display: block;
  max-width: 100% !important;
  width: auto !important;
}

.select2-container .select2-selection--single {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  height: 45px;
  outline: none;
  position: relative;
}

/* in select */
.select2-container .select2-selection--single .select2-selection__rendered {
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #fff;
  line-height: 1.2;
  padding-left: 5px;
  background-color: transparent;
}

.select2-container--default
  .select2-selection--single
  .select2-selection__arrow {
  height: 100%;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.select2-selection__arrow b {
  display: none;
}

.select2-selection__arrow::before {
  content: '';
  display: block;

  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-bottom: 5px solid #e6e6e6;
  margin-bottom: 2px;
}

.select2-selection__arrow::after {
  content: '';
  display: block;

  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-top: 5px solid #e6e6e6;
}

/* dropdown option */
.select2-container--open .select2-dropdown {
  z-index: 1251;
  border: 1px solid #fff;
  border-radius: 0px;
  background-color: white;
}

.select2-container .select2-results__option[aria-selected] {
  padding-top: 10px;
  padding-bottom: 10px;
}

.select2-container .select2-results__option[aria-selected='true'] {
  background: #80c64a;
  background: -webkit-linear-gradient(45deg, #56ab2f, #a8e063);
  background: -o-linear-gradient(45deg, #56ab2f, #a8e063);
  background: -moz-linear-gradient(45deg, #56ab2f, #a8e063);
  background: linear-gradient(45deg, #56ab2f, #a8e063);
  color: white;
}

.select2-container .select2-results__option--highlighted[aria-selected] {
  background: #80c64a;
  background: -webkit-linear-gradient(45deg, #56ab2f, #a8e063);
  background: -o-linear-gradient(45deg, #56ab2f, #a8e063);
  background: -moz-linear-gradient(45deg, #56ab2f, #a8e063);
  background: linear-gradient(45deg, #56ab2f, #a8e063);
  color: white;
}

.select2-results__options {
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
}

.select2-search--dropdown .select2-search__field {
  border: 1px solid #aaa;
  outline: none;
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
}
</style>
