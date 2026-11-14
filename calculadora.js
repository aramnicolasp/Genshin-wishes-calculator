const formulario = document.getElementById("formulario");

function calcularTiradas(protogemas, deseos, brillo, recompensa, reserva, pityInicial) {
    let tiradas = 0;
    let contador = pityInicial;
    let brilloRestante = brillo;

    function realizarTiradas(cantidad) {
        for (let i = 0; i < cantidad; i++) {
            tiradas++;
            contador++;

            if (contador === 10) {
                brilloRestante += recompensa;
                contador = 0;
            }
        }
    }

    // Primero deseos y después protogemas
    realizarTiradas(deseos);
    realizarTiradas(Math.floor(protogemas / 160));

    // Finalmente, brillo respetando la reserva
    while (brilloRestante - reserva >= 5) {
        brilloRestante -= 5;
        realizarTiradas(1);
    }

    return {
        tiradas,
        cuatroEstrellas: Math.floor((pityInicial + tiradas) / 10),
        pityFinal: contador,
        brilloFinal: brilloRestante,
        protogemasSobrantes: protogemas % 160,
        pitys90: Math.floor(tiradas / 90),
        tiradasRestantes: tiradas % 90
    };
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const protogemas = Number(document.getElementById("protogemas").value);
    const deseos = Number(document.getElementById("deseos").value);
    const brillo = Number(document.getElementById("brillo").value);
    const reserva = Number(document.getElementById("brilloReservado").value || 0);
    const pity4 = Number(document.getElementById("pity4").value);

    if (
        !Number.isInteger(protogemas) || protogemas < 0 ||
        !Number.isInteger(deseos) || deseos < 0 ||
        !Number.isInteger(brillo) || brillo < 0 ||
        !Number.isInteger(reserva) || reserva < 0 ||
        !Number.isInteger(pity4) || pity4 < 0 || pity4 > 9
    ) {
        alert("Comprueba que todos los valores sean números enteros válidos.");
        return;
    }

    // Escenarios mínimo y máximo
    const minimo = calcularTiradas(protogemas, deseos, brillo, 2, reserva, pity4);
    const maximo = calcularTiradas(protogemas, deseos, brillo, 5, reserva, pity4);

    // Resumen general
    document.getElementById("resumenPity").innerHTML = `
        <div class="pity-resumen">
            <p><strong>Pity inicial de 4★:</strong> ${pity4}</p>
            <p><strong>Protogemas sobrantes:</strong> ${minimo.protogemasSobrantes}</p>
            <p><strong>Brillo reservado:</strong> ${reserva}</p>
        </div>
    `;

    const contenedor = document.getElementById("resultadosEscenarios");
    contenedor.innerHTML = "";

    const escenarios = [
        { nombre: "Mínimo", resultado: minimo, recompensa: 2 },
        { nombre: "Máximo", resultado: maximo, recompensa: 5 }
    ];

    escenarios.forEach(escenario => {
        const r = escenario.resultado;
        const porcentaje = (r.tiradasRestantes / 90) * 100;
        const faltantes = 90 - r.tiradasRestantes;

        const tarjeta = document.createElement("div");
        tarjeta.className = "escenario";

        tarjeta.innerHTML = `
            <h3>${escenario.nombre}</h3>

            <p>Brillo por cada 4★: <strong>${escenario.recompensa}</strong></p>

            <div class="numero">${r.tiradas}</div>
            <p><strong>Tiradas totales</strong></p>

            <div class="estadisticas">
                <p>Personajes/armas 4★: <strong>${r.cuatroEstrellas}</strong></p>
                <p>Brillo final: <strong>${r.brilloFinal}</strong></p>
                <p>Pity 4★ final: <strong>${r.pityFinal}/10</strong></p>
            </div>

            <div class="pity-info">
                <div class="pity-datos">
                    <div>
                        <span>Pitys completos</span>
                        <strong>${r.pitys90}</strong>
                    </div>

                    <div>
                        <span>Tiradas restantes</span>
                        <strong>${faltantes}</strong>
                    </div>
                </div>

                <div class="pity-progreso">
                    <div class="pity-texto">
                        <span>Progreso al siguiente pity</span>
                        <strong>${r.tiradasRestantes}/90</strong>
                    </div>

                    <div class="barra-pity">
                        <div style="width: ${porcentaje}%"></div>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

    document.getElementById("resultado").classList.remove("oculto");
});