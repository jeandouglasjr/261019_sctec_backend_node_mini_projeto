function validaNome(texto: string): boolean {
  if (texto.trim() === "") {
    console.log("Nome é um campo obrigatório.");
    return false;
  }
  return true;
}

export { validaNome };
