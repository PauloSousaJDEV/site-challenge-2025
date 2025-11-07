// js/validacao-contato.js
(function () {
  const form = document.getElementById('contatoForm') || document.querySelector('form');
  if (!form) return;

  const fields = {
    nome: form.querySelector('#nome'),
    email: form.querySelector('#email'),
    contato: form.querySelector('#contato'),
    assunto: form.querySelector('#assunto'),
    mensagem: form.querySelector('#mensagem'),
  };

  // ==== Helpers de acessibilidade/erros ====
  function setError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    let err = form.querySelector(`#${input.id}-error`);
    if (!err) {
      err = document.createElement('small');
      err.id = `${input.id}-error`;
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', err);
    }
    input.setAttribute('aria-describedby', err.id);
    err.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.removeAttribute('aria-invalid');

    const err = form.querySelector(`#${input.id}-error`);
    if (err) err.textContent = '';
  }

  // ==== Máscara e validações ====
  function soDigitos(v) {
    return (v || '').replace(/\D/g, '');
  }

  function maskTelefoneBR(v) {
    const d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  function validaNome(v) {
    // Letras (com acentos), espaço, apóstrofo e hífen; 3+ chars
    return /^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]{3,}$/.test((v || '').trim());
  }

  function validaEmail(v) {
    // Simples, robusto o suficiente para front-end
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());
  }

  function validaTelefoneBR(v) {
    const d = soDigitos(v);
    // Aceita 10 (fixo) ou 11 (celular) dígitos; se 11, o 3º dígito deve ser 9
    if (d.length === 10) return true;
    if (d.length === 11) return d[2] === '9';
    return false;
  }

  function validaAssunto(v) {
    const t = (v || '').trim();
    return t.length >= 3 && t.length <= 120;
  }

  function validaMensagem(v) {
    const t = (v || '').trim();
    return t.length >= 10 && t.length <= 2000;
  }

  // ==== Eventos de input (validação em tempo real) ====
  fields.contato?.addEventListener('input', (e) => {
    e.target.value = maskTelefoneBR(e.target.value);
  });

  function validarCampo(input) {
    const id = input.id;
    const val = input.value;

    switch (id) {
      case 'nome':
        return validaNome(val) ? (clearError(input), true) : (setError(input, 'Informe um valor válido.'), false);
      case 'email':
        return validaEmail(val) ? (clearError(input), true) : (setError(input, 'Digite um e-mail válido.'), false);
      case 'contato':
        return validaTelefoneBR(val) ? (clearError(input), true) : (setError(input, 'Telefone inválido.'), false);
      case 'assunto':
        return validaAssunto(val) ? (clearError(input), true) : (setError(input, 'Assunto deve ter entre 3 e 120 caracteres.'), false);
      case 'mensagem':
        return validaMensagem(val) ? (clearError(input), true) : (setError(input, 'Mensagem deve ter entre 10 e 2000 caracteres.'), false);
      default:
        return true;
    }
  }

  Object.values(fields).forEach((el) => {
    if (!el) return;
    el.addEventListener('blur', () => validarCampo(el));
    el.addEventListener('input', () => {
      // melhora UX: limpa erro quando ficar válido
      if (el.classList.contains('is-invalid')) validarCampo(el);
    });
  });

  // ==== Submit ====
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;
    Object.values(fields).forEach((el) => {
      if (!el) return;
      if (!validarCampo(el)) ok = false;
    });

    if (!ok) {
      // Foca no primeiro campo inválido
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Aqui você pode enviar os dados (fetch/AJAX) ou permitir o submit normal.
    // Exemplo com fetch simulando envio (substitua URL por sua rota real):
    const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
    submitBtn && (submitBtn.disabled = true);

    const payload = {
      nome: fields.nome.value.trim(),
      email: fields.email.value.trim(),
      contato: fields.contato.value.trim(),
      assunto: fields.assunto.value.trim(),
      mensagem: fields.mensagem.value.trim(),
    };

    // DEMO: apenas mostra sucesso. Troque por fetch(...) se tiver backend.
    alert('Formulário válido! Pronto para enviar.\n' + JSON.stringify(payload, null, 2));
    submitBtn && (submitBtn.disabled = false);
    form.reset();
    Object.values(fields).forEach((el) => el && el.classList.remove('is-valid', 'is-invalid'));
  });
})();
