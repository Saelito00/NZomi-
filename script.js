console.log('Nzomi - Script carregado!');

// Aqui futuramente vamos colocar o código para cadastro de imóveis
// Conectar ao Supabase
const supabaseUrl = 'https://fluammomdatgchlrlzpw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsdWFtbW9tZGF0Z2NobHJsenB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMjAyNDksImV4cCI6MjA2MDU5NjI0OX0.EnDF1WAo9GY58PXemnGtrwIcv--WKxNctIPW-6AcOJc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Função para pedir a localização do usuário
function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (posicao) => {
                    resolve({
                        latitude: posicao.coords.latitude,
                        longitude: posicao.coords.longitude
                    });
                },
                (erro) => {
                    reject('Erro ao obter localização: ' + erro.message);
                }
            );
        } else {
            reject('Geolocalização não é suportada neste navegador.');
        }
    });
}

// Função para cadastrar o imóvel
async function cadastrarImovel() {
    const nomeImovel = prompt('Digite o nome do imóvel:');
    const descricaoImovel = prompt('Digite uma descrição do imóvel:');

    if (!nomeImovel || !descricaoImovel) {
        alert('Nome e descrição são obrigatórios.');
        return;
    }

    try {
        const localizacao = await obterLocalizacao();

        const { data, error } = await supabase
            .from('imoveis')
            .insert([{
                nome: nomeImovel,
                descricao: descricaoImovel,
                latitude: localizacao.latitude,
                longitude: localizacao.longitude
            }]);

        if (error) {
            alert('Erro ao cadastrar imóvel: ' + error.message);
        } else {
            alert('Imóvel cadastrado com sucesso!');
        }
    } catch (erro) {
        alert(erro);
    }
}

// Quando o site carregar, pergunta se quer cadastrar
document.addEventListener('DOMContentLoaded', () => {
    const cadastrar = confirm('Quer cadastrar um novo imóvel agora?');
    if (cadastrar) {
        cadastrarImovel();
    }
});
