export enum MENSAGEM_GENERICA {
  ENTIDADE_NAO_ENCONTRADA = 'ENTIDADE_NAO_ENCONTRADA',
  EMAIL_CADASTRADO = 'EMAIL_CADASTRADO',
  EMAIL_NAO_CADASTRADO = 'EMAIL_NAO_CADASTRADO',
  ENTIDADE_CADASTRADA = 'ENITDADE_CADASTRADA',
  ENTIDADE_ALTERADA = 'ENTIDADE_ALTERADA',
  ENTIDADE_EXCLUIDA = 'ENITDADE_EXCLUIDA',
  ENTIDADE_LOCALIZADA = 'ENITDADE_LOCALIZADA',
  ENTIDADE_LISTADA = 'ENTIDADE_LISTADA',
  CREDENCIAL_INVALIDA = 'CREDENCIAL_INVALIDA',
  LOGIN_EFETUADO = 'LOGIN_EFETUADO',
}

type MensagemValor = string | ((...args: any[]) => string);

type MensagensGenericas = {
  [key in MENSAGEM_GENERICA]: MensagemValor;
};

const MENSAGENS_GENERICAS: MensagensGenericas = {
  [MENSAGEM_GENERICA.ENTIDADE_NAO_ENCONTRADA]: (entidade: string) =>
    `${entidade} não localizado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_CADASTRADA]: (entidade: string) =>
    `${entidade} foi cadastrado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_ALTERADA]: (entidade: string) =>
    `${entidade} foi alterado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_EXCLUIDA]: (entidade: string) =>
    `${entidade} foi excluído(a) no sistema.`,
  [MENSAGEM_GENERICA.EMAIL_CADASTRADO]: (entidade: string) =>
    `O endereço de e-mail do(a) ${entidade} já está cadastrado no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_LOCALIZADA]: (entidade: string) =>
    `${entidade} foi localizado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_LISTADA]: (entidade: string) =>
    `Listagem de ${entidade} gerada com sucesso.`,
  [MENSAGEM_GENERICA.EMAIL_NAO_CADASTRADO]: (entidade: string) =>
    `${entidade} não está cadastrada no sistma.`,
  [MENSAGEM_GENERICA.CREDENCIAL_INVALIDA]: () =>
    `As credenciais de de acesso está inválida`,
  [MENSAGEM_GENERICA.LOGIN_EFETUADO]: (entidade: string) =>
    `O ${entidade} efetuado.`,
};

export function gerarMensagem(
  chave: MENSAGEM_GENERICA,
  ...params: any[]
): string {
  const mensagem = MENSAGENS_GENERICAS[chave];

  if (typeof mensagem === 'function') {
    return mensagem(...params);
  }

  return mensagem;
}
