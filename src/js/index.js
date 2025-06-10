const ulCartas = document.querySelector(".cartas");
const botaoFiltrar = document.querySelector(".btn-filtrar");
const selectCategoria = document.querySelector("#categoria");
const inputPreco = document.querySelector("#preco");
const selectOrdenacao = document.querySelector("#ordenacao"); // NOVO: Referência ao select de ordenação

/**
 * Função para renderizar as cartas no HTML.
 * @param {Array} cartasParaRenderizar - Um array de objetos de carta a serem exibidos.
 */
function renderizarCartas(cartasParaRenderizar) {
    // Limpa o conteúdo atual da UL para evitar duplicação ou exibir cartas antigas
    ulCartas.innerHTML = "";

    if (cartasParaRenderizar.length === 0) {
        ulCartas.innerHTML = "<p>Nenhuma carta encontrada com os filtros aplicados.</p>";
        return;
    }

    cartasParaRenderizar.forEach(carta => {
        const li = document.createElement("li");
        li.classList.add("carta");
        // Usamos dataset para armazenar informações para filtros futuros, se necessário
        li.dataset.categoria = carta.categoria;
        li.dataset.preco = carta.preco;

        // Monta o HTML interno da carta usando template literals
        li.innerHTML = `
            <img src="${carta.imagem}" alt="Carta ${carta.nome}" />
            <div class="informacoes">
                <h2 class="nome-personagem">${carta.nome}</h2>
                <span class="categoria">Categoria: ${carta.categoria}</span>
                <span class="preco">R$ ${carta.preco.toFixed(2).replace('.', ',')}</span>
                <a href="http://wa.me/5511999999999?text=Olá, quero comprar a carta ${carta.nome}!"
                    class="btn-comprar" target="_blank">Comprar</a>
            </div>
        `;
        ulCartas.appendChild(li);
    });
}

// Escuta o clique no botão de aplicar filtros
botaoFiltrar.addEventListener("click", function () {
    const categoriaSelecionada = selectCategoria.value;
    const precoMaximoDigitado = inputPreco.value;
    const ordenacaoSelecionada = selectOrdenacao.value; // NOVO: Pega o valor da ordenação

    let cartasProcessadas = [...todasAsCartas]; // Começa com uma cópia de todas as cartas

    // 1. Aplica filtro de categoria
    if (categoriaSelecionada !== "") {
        cartasProcessadas = cartasProcessadas.filter(carta =>
            carta.categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
        );
    }

    // 2. Aplica filtro de preço
    const precoMaximoNumerico = parseFloat(precoMaximoDigitado);
    if (!isNaN(precoMaximoNumerico) && precoMaximoDigitado !== "") {
        cartasProcessadas = cartasProcessadas.filter(carta =>
            carta.preco <= precoMaximoNumerico
        );
    }

    // 3. NOVO: Aplica a ordenação
    if (ordenacaoSelecionada !== "") {
        cartasProcessadas.sort((a, b) => {
            switch (ordenacaoSelecionada) {
                case "nome_asc":
                    return a.nome.localeCompare(b.nome); // Nome (A-Z)
                case "nome_desc":
                    return b.nome.localeCompare(a.nome); // Nome (Z-A)
                case "preco_asc":
                    return a.preco - b.preco; // Preço (Menor ao Maior)
                case "preco_desc":
                    return b.preco - a.preco; // Preço (Maior ao Menor)
                default:
                    return 0; // Nenhuma ordenação específica se valor inválido
            }
        });
    }

    // Renderiza as cartas que passaram pelos filtros E foram ordenadas
    renderizarCartas(cartasProcessadas);
});

// Evento que garante que o DOM esteja completamente carregado antes de manipular elementos
document.addEventListener("DOMContentLoaded", () => {
    // Renderiza todas as cartas quando a página é carregada inicialmente
    renderizarCartas(todasAsCartas);
});
