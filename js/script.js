document.addEventListener('DOMContentLoaded', function() {
    const vestitoInEvidenzaDiv = document.getElementById('vestito-in-evidenza');
    if (!vestitoInEvidenzaDiv) return;

    const dettagliVestitoDiv = vestitoInEvidenzaDiv.querySelector('.dettagli-vestito');
    const chiudiDettagliButton = dettagliVestitoDiv.querySelector('.chiudi-dettagli');
    const dettagliImmagine = dettagliVestitoDiv.querySelector('img');
    const dettagliTitolo = dettagliVestitoDiv.querySelector('h3, h4');
    const dettagliDescrizione = dettagliVestitoDiv.querySelector('.descrizione');
    const dettagliTaglie = dettagliVestitoDiv.querySelector('.taglie');
    const dettagliMateriale = dettagliVestitoDiv.querySelector('.materiale');

    let dettagliData = []; // Array per contenere i dati caricati

    // Carica i dati dal file JSON
    fetch('../data/vestiti.json') // Assicurati che il percorso sia corretto per le pagine nella sottocartella
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore nel caricamento del JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            dettagliData = data;
            populateHomePage();
            populateTuttiIVestiti();
            populateCategorie();
            attachEventListeners();
        })
        .catch(error => {
            console.error('Errore:', error);
        });

    function populateHomePage() {
        const vetrina = document.querySelector('.vetrina');
        if (vetrina && dettagliData.length > 0) {
            const inEvidenza = dettagliData.slice(0, 3);
            vetrina.innerHTML = inEvidenza.map(vestito => getVestitoHTML(vestito)).join('');
        }
    }

    function populateTuttiIVestiti() {
        const catalogo = document.querySelector('.catalogo');
        if (catalogo && dettagliData.length > 0) {
            catalogo.innerHTML = dettagliData.map(vestito => getVestitoCatalogoHTML(vestito)).join('');
        }
    }

    function populateCategorie() {
        const primaveraContainer = document.querySelector('#primavera .vestiti-per-riga');
        const estateContainer = document.querySelector('#estate .vestiti-per-riga');
        const autunnoContainer = document.querySelector('#autunno .vestiti-per-riga');
        const invernoContainer = document.querySelector('#inverno .vestiti-per-riga');

        if (primaveraContainer && estateContainer && autunnoContainer && invernoContainer && dettagliData.length > 0) {
            const primavera = dettagliData.filter(v => v.id >= 1 && v.id <= 4);
            const estate = dettagliData.filter(v => v.id >= 1 && v.id <= 6);
            const autunno = dettagliData.filter(v => v.id >= 1 && v.id <= 10);
            const inverno = dettagliData.filter(v => v.id >= 1 && v.id <= 17);

            primaveraContainer.innerHTML = primavera.map(vestito => getVestitoCategoriaHTML(vestito)).join('');
            estateContainer.innerHTML = estate.map(vestito => getVestitoCategoriaHTML(vestito)).join('');
            autunnoContainer.innerHTML = autunno.map(vestito => getVestitoCategoriaHTML(vestito)).join('');
            invernoContainer.innerHTML = inverno.map(vestito => getVestitoCategoriaHTML(vestito)).join('');
            
            // Aggiungiamo classi specifiche ai contenitori delle stagioni
            document.querySelector('#primavera').classList.add('categoria-primavera');
            document.querySelector('#estate').classList.add('categoria-estate');
            document.querySelector('#autunno').classList.add('categoria-autunno');
            document.querySelector('#inverno').classList.add('categoria-inverno');
        }
    }

    function getVestitoHTML(vestito) {
        return `
            <div class="vestito" data-vestito-id="${vestito.id}">
                <div class="immagine-container">
                    <img src="${vestito.immagine}" alt="${vestito.titolo}">
                </div>
                <h3>${vestito.titolo}</h3>
                <p>${vestito.descrizione ? vestito.descrizione.substring(0, 50) + '...' : 'Descrizione non disponibile'}</p>
                <button class="vedi-dettagli">Visualizza dettagli</button>
            </div>
        `;
    }

    function getVestitoCatalogoHTML(vestito) {
        return `
            <article class="vestito-card" data-vestito-id="${vestito.id}">
                <div class="vestito-card__image-container">
                    <img src="${vestito.immagine}" alt="${vestito.titolo}">
                </div>
                <div class="vestito-card__info">
                    <h3 class="vestito-card__title">${vestito.titolo}</h3>
                    <p class="vestito-card__description">${vestito.descrizione ? vestito.descrizione.substring(0, 80) + '...' : 'Descrizione non disponibile'}</p>
                    <button class="vedi-dettagli vestito-card__button">Visualizza Dettagli</button>
                </div>
            </article>
        `;
    }

    function getVestitoCategoriaHTML(vestito) {
        return `
            <article class="vestito-thumbnail" data-vestito-id="${vestito.id}">
                <div class="vestito-thumbnail__image-container">
                    <img src="${vestito.immagine}" alt="${vestito.titolo}">
                </div>
                <h4 class="vestito-thumbnail__title">${vestito.titolo}</h4>
                <button class="vedi-dettagli vestito-thumbnail__button">Visualizza Dettagli</button>
            </article>
        `;
    }

    function attachEventListeners() {
        const vediDettagliButtons = document.querySelectorAll('.vedi-dettagli');
        vediDettagliButtons.forEach(button => {
            button.addEventListener('click', function() {
                const vestitoDiv = this.closest('[data-vestito-id]');
                if (!vestitoDiv) return;

                const vestitoId = vestitoDiv.dataset.vestitoId;
                const vestitoDettagli = dettagliData.find(item => item.id === vestitoId);

                if (vestitoDettagli) {
                    dettagliImmagine.src = vestitoDettagli.immagine;
                    dettagliTitolo.textContent = vestitoDettagli.titolo;
                    dettagliDescrizione.textContent = vestitoDettagli.descrizione || 'Descrizione non disponibile';
                    dettagliTaglie.textContent = vestitoDettagli.taglie ? `Taglie disponibili: ${vestitoDettagli.taglie}` : 'Taglie non disponibili';
                    dettagliMateriale.textContent = vestitoDettagli.materiale ? `Materiale: ${vestitoDettagli.materiale}` : 'Materiale non disponibile';
                    vestitoInEvidenzaDiv.style.display = 'flex';
                }
            });
        });

        if (chiudiDettagliButton) {
            chiudiDettagliButton.addEventListener('click', function() {
                vestitoInEvidenzaDiv.style.display = 'none';
            });
        }

        if (vestitoInEvidenzaDiv) {
            vestitoInEvidenzaDiv.addEventListener('click', function(event) {
                if (event.target === this) {
                    this.style.display = 'none';
                }
            });
        }
    }
});