<template>
  <div class="q-pa-md">
    <q-table
      dense
      title="Endereços"
      :data="pessoa.enderecos"
      :columns="columns"
      row-key="id"
    >
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
              @click="del(props.row)"
              text-color="white"
              icon="delete_forever"
            />
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
          @click="novoendereco()"
        />
        <q-form>
          <q-dialog
            rounded-borders
            v-model="toolbar"
            maximized
            persistent
            :full-width="isMobile"
            :full-height="isMobile"
            class="q-pa-none q-ma-none"
          >
            <q-card
              rounded-borders
              class="q-ma-md"
              style="width:750px;height:380px; border-radius: 50px;"
            >
              <q-toolbar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>

                <q-toolbar-title
                  ><span class="text-weight-bold">Meu</span>
                  Plano.APP</q-toolbar-title
                >

                <q-btn flat round dense icon="close" v-close-popup />
              </q-toolbar>
              <q-card-section>
                <EnderecosForm
                  :endereco="endereco"
                  @fechar="salvarEndereco"
                ></EnderecosForm>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import EnderecosForm from './EnderecosForm';
import { Platform } from 'quasar';
import { mapState, mapActions } from 'Vuex';
export default {
  name: 'EnderecosTable',
  components: { EnderecosForm },
  data() {
    return {
      endereco: [],
      icon: false,
      bar: false,
      bar2: false,
      toolbar: false,
      columns: [
        {
          name: 'CEP',
          required: true,
          label: 'CEP',
          align: 'left',
          field: 'cep',
          sortable: true
        },
        {
          name: 'Logradouro',
          align: 'center',
          label: 'Rua',
          field: 'logradouro',
          sortable: true
        },
        { name: 'Bairro', label: 'Bairro', field: 'bairro', sortable: true },
        { name: 'Cidade', label: 'Cidade ', field: 'cidade' },
        { name: 'Numero', label: 'Número ', field: 'numero' },
        { name: 'UF', label: 'UF ', field: 'uf' },
        {
          name: 'Complemento',
          label: 'Complemento',
          field: 'complemento',
          sortable: true
        },
        { name: 'option', align: 'center', label: 'Opções', sortable: false }
      ]
    };
  },
  methods: {
    ...mapActions('pessoas', ['addEndereco', 'deleteEndereco']),
    salvarEndereco(endereco) {
      this.addEndereco(endereco);
      this.toolbar = false;
    },
    del(endereco) {
      this.$swal({
        icon: 'question',
        title: 'Tem certeza que deseja EXCLUIR?',

        showCancelButton: true,
        confirmButtonText: `Excluir`,
        cancelButtonText: `Cancelar`
      }).then(result => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.deleteEndereco(endereco);
        }
      });
    },
    novoendereco() {
      this.endereco = {
        id: Date.now().toString(),
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      };
      /*    this.addEndereco({
        id: Date.now().toString(),
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      }); */
      this.toolbar = true;
    },

    update(endereco) {
      this.endereco = endereco;
      this.toolbar = true;
    },
    remove(enderecoId) {
      let datas = localStorage.getItem('datasApp');
      if (!datas) return;

      datas = JSON.parse(datas);

      datas = datas.filter(endereco => {
        return endereco.id != enderecoId;
      });

      this.enderecos = datas;

      localStorage.setItem('datasApp', JSON.stringify(datas));
    },
    salvar(endereco) {
      let datas = localStorage.getItem('datasApp');

      endereco.id = new Date().getTime();

      if (datas) {
        datas = JSON.parse(datas);
      } else datas = [];

      if (this.creating) {
        //aqui vai fazer a logica para quando for nova pessoa

        this.pessoas = datas;
      } else {
        //codigo para alterar os dados. logica para alterar a pessoa
        //achar o indice no array
        //index do datas
        //subistituir a pessoa pela atualizacao
      }

      localStorage.setItem('datasApp', JSON.stringify(datas));
      this.pessoa = this.addEndereco();
    },

    createPessoa() {
      this.creating = true;
    }
  },

  computed: {
    ...mapState('pessoas', ['pessoa']),
    isMobile: () => Platform.is.mobile || false
  }
};
</script>

<style>
label {
  font-size: 100px;
}
</style>
