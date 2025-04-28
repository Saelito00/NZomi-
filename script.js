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
// Função para mostrar o mapa
async function mostrarMapa() {
    // Inicializar o mapa
    const plataforma = new H.service.Platform({
        apikey: 'cFfYkiac-CgWvfYv0JEAeMoYJpe9ZImiEDiHBrGeIi4' // Tua API do Here
    });

    const tiposMapa = plataforma.createDefaultLayers();
    const mapa = new H.Map(
        document.getElementById('mapa'),
        tiposMapa.vector.normal.map,
        {
            zoom: 12,
            center: { lat: -8.839988, lng: 13.289437 } // Centro inicial (Luanda, Angola)
        }
    );

    // Ativar comportamento e UI
    const comportamento = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapa));
    const ui = H.ui.UI.createDefault(mapa, tiposMapa);

    // Buscar imóveis cadastrados no Supabase
    const { data: imoveis, error } = await supabase
        .from('imoveis')
        .select('*');

    if (error) {
        console.error('Erro ao buscar imóveis:', error.message);
        return;
    }

    // Colocar marcadores no mapa
    imoveis.forEach(imovel => {
        const marcador = new H.map.Marker({ lat: imovel.latitude, lng: imovel.longitude });
        marcador.setData(`<b>${imovel.nome}</b><br>${imovel.descricao}`);
        marcador.addEventListener('tap', (evt) => {
            const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                content: evt.target.getData()
            });
            ui.addBubble(bubble);
        });
        mapa.addObject(marcador);
    });
}

// Mostrar o mapa depois que o site carregar
document.addEventListener('DOMContentLoaded', () => {
    mostrarMapa();
});
