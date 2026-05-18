import { useState, useEffect } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import { saveContact, updateContact } from '../../database/Database'

const REGEX_APENAS_DIGITOS = /^\d+$/;

const validarNome = (nome) => {
    if (!nome) return 'Informe o nome.';
    if (nome.length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
    return null;
};

const validarTelefone = (telefone) => {
    if (!telefone) return 'Informe o telefone.';
    if (!REGEX_APENAS_DIGITOS.test(telefone)) return 'O telefone deve conter apenas dígitos numéricos.';
    if (telefone.length < 9) return 'O telefone deve ter pelo menos 9 dígitos.';
    return null;
};

export default function Cadastro({navigation, route}) {
    const contato = route.params?.contato ?? null;

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    useEffect(() => {
        if (contato) {
            setNome(contato.nome ?? '');
            setTelefone(contato.telefone ?? '');
        } else {
            setNome('');
            setTelefone('');
        }
    }, [contato]);

    const salvar = async () => {
        const nomeLimpo = nome.trim();
        const telefoneLimpo = telefone.trim();

        const erroN = validarNome(nomeLimpo);
        const erroT = validarTelefone(telefoneLimpo);

        if (erroN) { Alert.alert('Validação', erroN); return; }
        if (erroT) { Alert.alert('Validação', erroT); return; }

        const acao = contato?.id ?
        updateContact(contato.id, nomeLimpo, telefoneLimpo) :
        saveContact(nomeLimpo, telefoneLimpo);

        acao
        .then(() => navigation.goBack())
        .catch((error) => {
            console.warn('Erro ao salvar contato', error);
            Alert.alert('Erro', 'Nao foi possivel salvar o contato.');
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.botao} onPress={salvar}>
            <Text style={styles.botaoTexto}>{contato?.id ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  botao: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});