// const apiUrl = "http://localhost:5204/api/pecas";
const apiUrl = "https://sizi6wc3ci.execute-api.us-east-2.amazonaws.com/prod/api/pecas";

let lastOpenedMenu = null;

document.getElementById('toggleSidebar').addEventListener('click', function() {
    toggleSidebar();
});

document.querySelectorAll('.sub-menu li a').forEach(item => {
    item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {  // Define o limite para telas pequenas
            toggleSidebar();
        }
    });
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('closed');
    mainContent.classList.toggle('shifted');
}

// Funções para alternar o submenu e mostrar seções
function toggleSubMenu(id) {
    const submenu = document.getElementById(id);
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}

function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    const activeSection = document.getElementById(id);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }
}


// Função para exibir resultados
function displayResults(data, containerId) {
    const resultsContainer = document.getElementById(containerId);
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum resultado encontrado</p>';
        return;
    }

    if(containerId == "resultsInduzido"){
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <p><strong>IND:</strong> ${item.codigo} &nbsp; 
                <strong>Marca:</strong> ${item.marca} &nbsp; 
                <strong>Coletor:</strong> ${item.coletor} &nbsp;
                <strong>Comp:</strong> ${item.comprimento} &nbsp;  
                <strong>Diam:</strong> ${item.diametro} &nbsp;
                <strong>Qtd de Dentes:</strong> ${item.dentes} &nbsp; 
                <strong>${item.voltagem}v</strong> </p>
            `;
            resultsContainer.appendChild(div);
        });
    }
    else if(containerId == "resultsRotor"){
        const resultsContainer = document.getElementById(containerId);
        data.forEach(item => {
            const div = document.createElement('div');
            var helice = "Não";

            if(item.helice)
                helice = "Sim"

            div.className = 'result-item';
            div.innerHTML = `
                <p><strong>ROT:</strong> ${item.codigo} &nbsp; 
                <strong>Marca:</strong> ${item.marca} &nbsp; 
                <strong>Coletor:</strong> ${item.coletor} &nbsp; 
                <strong>Comp:</strong> ${item.comprimento} &nbsp; 
                <strong>Diam:</strong> ${item.diametro} &nbsp; 
                <strong>Mont:</strong> ${item.montagem} &nbsp; 
                <strong>Helice:</strong> ${helice} &nbsp; 
                <strong>${item.voltagem}v</strong></p>
                
            `;
            resultsContainer.appendChild(div);
        });
    }
    else if (containerId == "resultsEstator"){
        const resultsContainer = document.getElementById(containerId);
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <p><strong>ID:</strong> ${item.codigo} &nbsp; 
                <strong>Marca:</strong> ${item.marca} &nbsp;     
                <strong>Ext:</strong> ${item.externo} &nbsp; 
                <strong>Int:</strong> ${item.interno} &nbsp; 
                <strong>Pacote:</strong> ${item.pacote} &nbsp; 
                <strong>Fios:</strong> ${item.fios} &nbsp; </p>


            `;
            resultsContainer.appendChild(div);
        });

    }else if(containerId == "Criado"){
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = '<h2><strong>Criado com sucesso</strong></h2>'
        resultsContainer.appendChild(div);
    }

    

  
}

// Função para exibir erros
function displayError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerText = message;
    document.body.appendChild(errorContainer);

    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

// Função para buscar Induzidos
async function searchInduzidos() {
    const marca = document.getElementById('marcaInduzido').value;
    const comprimentoMin = document.getElementById('comprimentoMinInduzido').value;
    const comprimentoMax = document.getElementById('comprimentoMaxInduzido').value;
    const quantidadeDeDentes = document.getElementById('dentesInduzido').value;

    const params = new URLSearchParams();

    if (marca) params.append('marca', marca);
    if (comprimentoMin) params.append('minComprimento', comprimentoMin);
    if (comprimentoMax) params.append('maxComprimento', comprimentoMax);
    if (quantidadeDeDentes) params.append('quantidadeDeDentes', quantidadeDeDentes);

    try {
        
        const response = await fetch(`${apiUrl}/induzido?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        displayResults(data, 'resultsInduzido');
    } catch (error) {

        console.error('Erro na requisição:', error.message);
        displayError('Erro ao conectar com a API. Por favor, verifique se a API está online.');
    }
}

// Função para criar Induzido
async function createInduzido() {
    const id = document.getElementById('createIDInduzido').value;
    const marca = document.getElementById('createMarcaInduzido').value;
    const coletor = document.getElementById('createColetorInduzido').value;
    const comprimento = document.getElementById('createComprimentoInduzido').value;
    const diametro = document.getElementById('createDiametroInduzido').value;
    const dentes = document.getElementById('createDentesInduzido').value;
    const voltagem = document.getElementById('createVoltagemInduzido').value;

    const induzido = {
        codigo: id,
        marca: marca,
        coletor: parseFloat(coletor),
        comprimento: parseFloat(comprimento),
        diametro: parseFloat(diametro),
        dentes: parseInt(dentes, 10),
        voltagem: parseInt(voltagem, 10)
    };

    try {
        const response = await fetch(`${apiUrl}/induzido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(induzido)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.message);
        location.reload();
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao criar induzido.');
    }
}

// Função para deletar Induzido
async function deleteInduzido() {
    const id = document.getElementById('deleteIdInduzido').value;

    try {
        const response = await fetch(`${apiUrl}/induzido/${id}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert("Rotor Deletado com sucesso");
        location.reload();

    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao deletar induzido.');
    }
}

//--------------------------------------------------------------------------------------------
// Função para buscar Rotores
async function searchRotores() {
    const marca = document.getElementById('marcaRotor').value;
    const comprimentoMin = document.getElementById('comprimentoMinRotor').value;
    const comprimentoMax = document.getElementById('comprimentoMaxRotor').value;
    const diametroMin = document.getElementById('diametroMinRotor').value;
    const diametroMax = document.getElementById('diametroMaxRotor').value;

    const params = new URLSearchParams();

    if (marca) params.append('marca', marca);
    if (comprimentoMin) params.append('minComprimento', comprimentoMin);
    if (comprimentoMax) params.append('maxComprimento', comprimentoMax);
    if (diametroMin) params.append('minDiametro', diametroMin);
    if (diametroMax) params.append('maxDiametro', diametroMax);

    try {
        const response = await fetch(`${apiUrl}/rotor?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados recebidos:', data);
        displayResults(data, 'resultsRotor');
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao conectar com a API. Por favor, verifique se a API está online.');
    }
    
}

// Função para criar Rotor
async function createRotor() {
    const id = document.getElementById('createIDRotor').value;
    const marca = document.getElementById('createMarcaRotor').value;
    const coletor = document.getElementById('createColetorRotor').value;
    const comprimento = document.getElementById('createComprimentoRotor').value;
    const diametro = document.getElementById('createDiametroRotor').value;
    const montagem = document.getElementById('createMontagemRotor').value;
    const heliceRepost = document.getElementById('createHeliceRotor').value;
    const voltagem = document.getElementById('createVoltagemRotor').value;
    var helice = false
    
    if(heliceRepost == "true")
        helice = true


    const rotor = {
        codigo: id,
        marca: marca,
        coletor: coletor,
        comprimento: parseFloat(comprimento),
        diametro: parseFloat(diametro),
        montagem: parseFloat(montagem),
        helice: helice,
        voltagem: voltagem
    };

    try {
        const response = await fetch(`${apiUrl}/rotor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rotor)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert("Rotor Criado com sucesso");
        location.reload();
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao criar rotor.');
    }
}

// Função para deletar Rotor
async function deleteRotor() {
    const id = document.getElementById('deleteIdRotor').value;

    try {
        const response = await fetch(`${apiUrl}/rotor/${id}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert("Rotor Deletado com sucesso");
        location.reload();
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao deletar rotor.');
    }
}
//-----------------------------------------------------------------------
// Função para buscar Estatores
async function searchEstatores() {
    const marca = document.getElementById('marcaEstator').value;
    const diametroInternoMin = document.getElementById('diametroInternoMinEstator').value;
    const diametroInternoMax = document.getElementById('diametroInternoMaxEstator').value;
    const diametroExternoMin = document.getElementById('diametroExternoMinEstator').value;
    const diametroExternoMax = document.getElementById('diametroExternoMaxEstator').value;

    const params = new URLSearchParams();

    if (marca) params.append('marca', marca);
    if (diametroInternoMin) params.append('minTamanhoInterno', diametroInternoMin);
    if (diametroInternoMax) params.append('maxTamanhoInterno', diametroInternoMax);
    if (diametroExternoMin) params.append('minTamanhoExterno', diametroExternoMin);
    if (diametroExternoMax) params.append('maxTamanhoExterno', diametroExternoMax);

    try {
        const response = await fetch(`${apiUrl}/estator?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayResults(data, 'resultsEstator');

    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao conectar com a API. Por favor, verifique se a API está online.');
    }
}

// Função para criar Estator
async function createEstator() {
    const id = document.getElementById('createIDEstator').value;
    const marca = document.getElementById('createMarcaEstator').value;
    const tamanhoInterno = document.getElementById('createDiametroInternoEstator').value;
    const tamanhoExterno = document.getElementById('createDiametroExternoEstator').value;
    const tamanhoPacote = document.getElementById('createDiametroExternoEstator').value;
    const Fios = document.getElementById('createFiosEstator').value;
    const voltagem = document.getElementById('createVoltagemEstator').value;

    const estator = {
        codigo: id,
        marca: marca,
        externo: parseFloat(tamanhoExterno),
        interno : parseFloat(tamanhoInterno),
        pacote: parseFloat(tamanhoPacote),
        fios: parseInt(Fios, 10),
        voltagem: parseInt(voltagem, 10)
    };

    try {
        const response = await fetch(`${apiUrl}/estator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estator)         
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.message);
        location.reload(); 
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao criar estator.');
    }
}

// Função para deletar Estator
async function deleteEstator() {
    const id = document.getElementById('deleteIdEstator').value;

    try {
        const response = await fetch(`${apiUrl}/estator/${id}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert("Rotor Deletado com sucesso");
        location.reload(); 
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayError('Erro ao deletar estator.');
    }
}
