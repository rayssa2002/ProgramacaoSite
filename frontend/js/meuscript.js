$(function() {

    var urlX = 'http://rayssacastilhos.pythonanywhere.com/';
    function exibir_produtoras() {
        $.ajax({
            url: urlX+'/listar/Produtora',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            }
        });    
        function listar (resposta) {
            $('#corpoTabelaProdutoras').empty();
            mostrar_conteudo('ListarProdutoras');
            for (var i in resposta) {
                lin = '<tr id="linha_'+resposta[i].id+'">' + 
                '<td>' + resposta[i].nome + '</td>' + 
                '<td>' + resposta[i].pais + '</td>' + 
                '<td>' + resposta[i].ano + '</td>' + 
                '<td><a href=# id="excluir_' + resposta[i].id + '" ' + 
                  'class="excluir_produtora"><img src="img/excluir.png" '+
                  'alt="Excluir produtora" title="Excluir produtora"></a>' + 
                '</td>' + 
                '</tr>';
                $('#corpoTabelaProdutoras').append(lin);
            }
        }
    }
    
    $(document).on("click", "#linkListarProdutoras", function() {
        exibir_produtoras();
    });
    
    function exibir_filmes() {
        $.ajax({
            url: urlX+'/listar/Filme',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            }
        });

        function listar (resposta) {
            $('#corpoTabelaFilmes').empty();
            mostrar_conteudo('ListarFilmes');
            for (var i in resposta) {
                lin = '<tr id="linha_'+resposta[i].id+'">' + 
                '<td>' + resposta[i].nome + '</td>' + 
                '<td>' + resposta[i].genero + '</td>' + 
                '<td>' + resposta[i].ano_de_lancamento + '</td>' + 
                '<td>' + resposta[i].diretor + '</td>' + 
                '<td>' + resposta[i].premio + '</td>' + 
                '<td>' + resposta[i].produtora.nome + '</td>' + 
                '<td><a href=# id="excluir_' + resposta[i].id + '" ' + 
                  'class="excluir_filme"><img src="img/excluir.png" '+
                  'alt="Excluir filme" title="Excluir filme"></a>' + 
                '</td>' + 
                '</tr>';
                $('#corpoTabelaFilmes').append(lin);
            }
        }
    }

    function mostrar_conteudo(identificador) {
        $("#ListarFilmes").addClass('d-none');
        $("#conteudoInicial").addClass('d-none');
        $("#ListarElencos").addClass('d-none');
        $("#ListarProdutoras").addClass('d-none')
        $("#"+identificador).removeClass('d-none');      
    }

    $(document).on("click", "#linkListarFilmes", function() {
        exibir_filmes();
    });

    function carregarCombo(combo_id, nome_classe) {
        $.ajax({
            url: urlX+'/listar/'+nome_classe,
            method: 'GET',
            dataType: 'json',
            success: carregar,
            error: function(problema) {
                alert("erro ao ler dados, verifique o backend");
            }
        });

        function carregar(dados) {
            $('#'+combo_id).empty();
            for (var i in dados) {
                $('#'+combo_id).append(
                    $('<option></option>').attr("value",
                        dados[i].id).text(dados[i].nome));
            }
        }
    }

    $(document).on("click", "#linkInicio", function() {
        mostrar_conteudo("conteudoInicial");
    });

    $(document).on("click", "#btnIncluirFilme", function validarform() {
        if ((document.getElementById("campoNome").value.length < 3) || (document.getElementById("campoGenero").value.length < 5) || 
        (document.getElementById("campoAnodeLancamento").value.length < 1) || (document.getElementById("campoDiretor").value.length < 1) || 
        (document.getElementById("campoPremio").value.length < 1) || (document.getElementById("campoProdutoraId").value.length < 1)) {
            alert('Por favor, preencha todos os campos');
        } 
        else {
            nome = $("#campoNome").val();
            genero = $("#campoGenero").val();
            ano_de_lancamento = $("#campoAnodeLancamento").val();
            diretor = $("#campoDiretor").val();
            premio = $("#campoPremio").val();
            produtora_id = $("#campoProdutoraId").val();
            var dados = JSON.stringify({ nome: nome, genero: genero, ano_de_lancamento: ano_de_lancamento, diretor: diretor,premio: premio, produtora_id: produtora_id});
            $.ajax({
                url: urlX+'/incluir_filme',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: dados,
                success: filmeIncluido,
                error: erroAoIncluir
            });
        }
        function filmeIncluido (retorno) {
            if (retorno.resultado == "ok") {
                alert("Filme incluído com sucesso!");
                $("#campoNome").val("");
                $("#campoGenero").val("");
                $("#campoAnodeLancamento").val("");
                $("#campoDiretor").val("");
                $("#campoPremio").val("");
                $("#campoProdutoraId").val("")
            } 
            else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoIncluir (retorno) {
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    
    $('#modalIncluirFilme').on('show.bs.modal', function (e) {
        carregarCombo("campoProdutoraId", "Produtora");
    });

    mostrar_conteudo("conteudoInicial");

    $(document).on("click", ".excluir_filme", function() { 
        var componente_clicado = $(this).attr('id'); 
        var nome_icone = "excluir_"; 
        var id_filme = componente_clicado.substring(nome_icone.length); 
        $.ajax({ 
            url: urlX+'/excluir_filme/'+id_filme, 
            type: 'delete',
            dataType: 'json', 
            success: filmeExcluido,
            error: erroAoExcluir 
        });
        function filmeExcluido(retorno) {
            if (retorno.resultado == "ok") {
                $("#linha_" + id_filme).fadeOut(1000, function() {
                    alert("Filme removido com sucesso!");
                });
            } else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }
        function erroAoExcluir(retorno) {
            alert("Erro ao excluir dados, verifique o backend: ");
        }
    });

    function exibir_elencos() {
        $.ajax({
            url: urlX+'/listar/Elenco',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            }
        });    
        function listar (resposta) {
            $('#corpoTabelaElencos').empty();
            mostrar_conteudo('ListarElencos');
            for (var i in resposta) {
                lin = '<tr id="linha_'+resposta[i].id+'">' + 
                '<td>' + resposta[i].nome + '</td>' + 
                '<td>' + resposta[i].personagem + '</td>' + 
                '<td>' + resposta[i].categoria + '</td>' + 
                '<td>' + resposta[i].filme.nome + '</td>' + 
                '<td><a href=# id="excluir_' + resposta[i].id + '" ' + 
                  'class="excluir_elenco"><img src="img/excluir.png" '+
                  'alt="Excluir ator/atriz" title="Excluir ator/atriz"></a>' + 
                '</td>' + 
                '</tr>';
                $('#corpoTabelaElencos').append(lin);
            }
        }
    }
    
    $(document).on("click", "#linkListarElencos", function() {
        exibir_elencos();
    });

});