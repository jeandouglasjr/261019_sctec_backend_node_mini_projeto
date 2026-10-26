function validaNome(texto: string | undefined | null): boolean {
  if (!texto || texto.trim() === "") {
    return false;
  }
  return true;
}

// valida email
function validaEmail(email: string | undefined | null): boolean {
  if (!email || email.trim() === "") {
    return false;
  }
  // regex simples
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
}

// formata R$ 0,00 (padrão brasileiro)
function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

// formata data dd/mm/aaaa hh:mm:ss
function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  const segundos = String(data.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

export { validaNome, validaEmail, formatarMoeda, formatarData };
