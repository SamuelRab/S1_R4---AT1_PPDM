import * as SQLite from 'expo-sqlite';

// Criar ou abrir o banco de dados
const db = SQLite.openDatabaseSync('contatos13.db');

// Função para inicializar o banco de dados, criando a tabela se não existir.
export const initDatabase = async () => {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL
        );
    `);
};

// Função para salvar um novo contato.
export const saveContact = async (nome, telefone) => {
  let result = await db.runAsync('INSERT INTO contatos (nome, telefone) VALUES (?, ?);', nome, telefone);
  return result.lastInsertRowId;
};

// Função para Atualizar um contato existente.
export const updateContact = async (id, nome, telefone) => {
  let result = await db.runAsync('UPDATE contatos SET nome = ?, telefone = ? WHERE id = ?;', nome, telefone, id);
  return result.rowsAffected;
};

// Função para lsitar todos os contatos.
export const listContacts = async () => {
  let result = await db.getAllAsync('SELECT id, nome, telefone FROM contatos ORDER BY nome ASC;');
  return result;
};

// Função para excluir todos os contatos.
export const deleteContact = async (id) => {
    let result = await db.runAsync('DELETE FROM contatos WHERE id = ?;', id);
    return result;
};
