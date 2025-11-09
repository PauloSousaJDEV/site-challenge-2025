const form = document.querySelector(".form");
const apenasTexto = /^[A-Za-zÀ-ÿ\s]+$/;

const telMinimo = (tel) => {
  let numeros = 0;
  for (let i = 0; i < tel.length; i++) {
    if (tel[i] >= '0' && tel[i] <= '9') numeros++;
  }
  return numeros >= 11;
};

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const assunto = document.getElementById("assunto").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();
  const contato = document.getElementById("contato").value.trim();

  if (!apenasTexto.test(nome)) {
    alert("Nome inválido."); return; }
  if (!apenasTexto.test(assunto)) {
    alert("Assunto inválido."); return; }
  if (!apenasTexto.test(mensagem)) {
    alert("Mensagem inválida."); return; }
  if (!telMinimo(contato)) {
    alert("Telefone inválido."); return; }

  const dados = {
    nome: nome,
    contato: contato,
    assunto: assunto,
    mensagem: mensagem
  };

  localStorage.setItem("formContato", JSON.stringify(dados));

  console.log("Dados do formulário:");
  console.log(dados);

  alert("Formulário válido! Enviado com sucesso.");

  form.submit();
});
