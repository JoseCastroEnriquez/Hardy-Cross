/* SISTEMA PARA DISTRIBUCIÓN DE CAUDAL, HARDY CROSS */
/* Funsiones del programa */
/* Calculo perdidad de energia por tramo */
function calcPerdidadEnergia(Q, C, D, L) {
    /* Ecuación para el calculo de energia por tramo */
    return ((Q/(0.278*C*(D**(2.63))))**(1/0.54))*L
}

/* Calculo de hi/Q */
function calcHiEQ(hi, Q) {
    /* Ecuación para el calculo */
    return hi/Q
}

/* La tarea de ahora es realizar las comentaciones al codifo ######################################################################## */

/* Funsión para crear el array de hi */
function crearArraHi (arrayCaudales,arrayDiam, arrayLong, cteC) {
    // Array para el almacenamiento de la sumatoria de energia
    let hi = []
    // Numero usado para insertar en el array final
    let inser = 0;
    // Es el ciclo de calculo de cada uno de los datos
    for (i in arrayCaudales) {
        /* Debido a los conflictos de signo presentes se crea el condicional if */
        if(arrayCaudales[i] <= 0) {
            inser = -calcPerdidadEnergia(-arrayCaudales[i]/1000, cteC, arrayDiam[i], arrayLong[i]);
        }

        else {
            inser = calcPerdidadEnergia((arrayCaudales[i]/1000).toFixed(8), cteC, arrayDiam[i], arrayLong[i]);
        }
        /* Agrega la perdida calculada al array */
        hi.push(inser);
    }
    // Retorna el array final
    return hi
}


/* REALIZAR EL EJERCICIO DE EXCEL EN JS */


/* Variables Para Calcular */
// Sistema para el calculo de sumatoria de un array
function calcSumatoria(arraySumar) {
    // Es el valor del resultado final
    let acumulador = 0;
    // Mediante este ciclo se toma el numero y lo suma
    for (i of arraySumar) {
        acumulador += i;
    }
    // Retorna el resultado de la sumatoria
    return acumulador
}

// Calculo la expresion hi / Q
function arrayHiEQ(arrayPerdidas, arrayQ) {
    // Es el array de retorno
    let arrayFinal = [];
    // Es un parametro para insertar terminos de cada uno de los arrays
    let inser = 0;
    // Mediante este ciclo se reliza la operación (Hi / Q)
    for (i in arrayPerdidas) {
        inser = arrayPerdidas[i] / (arrayQ[i]);
        arrayFinal.push(inser);
    }
    // Retorna el array final de las operaciones
    return arrayFinal
}


/* Calculo de gama Q */
function calcGQ(ArrayCaudal, arrayDia, arrayLon, C) {
    // Realiza las sumatorias de las energias y de los caudales
    let sumahi = calcSumatoria(crearArraHi(ArrayCaudal, arrayDia, arrayLon, C));
    let sumahiEQ = calcSumatoria(arrayHiEQ(crearArraHi(ArrayCaudal, arrayDia, arrayLon, C), ArrayCaudal));
    /* Retorna el gama Q en base a la ecuación */
    return -(sumahi / (1.85*sumahiEQ));
}

/* Calculo de Q corregido */
function calcQCorre(Q, GQ) {
    /* Ecuacion para el calculo */
    return Q - GQ
}



// Funsión incompleta ###################################################################################################
/* Funcion para pasar los tramos a un array manejable */
function separarCircuitos(arraCircuitos, arraSepa) {
    /* Variable en la que se almacena la separacion */
    let arra = []
    /* Repite el ciclo en base a los circuitos */
    for (i in arraCircuitos) {
        /* En el primer ciclo */
        if (i == arraCircuitos.length -1) {
            let o = arraSepa.slice(arraSepa.indexOf("Circuito " + (parseInt(i)+1)) +1);
            /* Crea un nuevo array desde 0 hasta la posicion de circuito*/
            arra.push(o);
        }

        /* Define la ultima posicion del elemento */
        else {
            let o = arraSepa.slice(arraSepa.indexOf("Circuito " + (parseInt(i)+1))+1, arraSepa.indexOf("Circuito " + (parseInt(i)+2)));
            arra.push(o);
        }
        
    }
    // Retorna el array con
    return arra
}

/* Esta es la funcion mediante se hace el calculo final para un circuito */
function arrayCaudalFinal(arrCauda, arraDiam, arraLon, C) {
    /* Array en el que se almacenaran los valores finales */
    let caudalesFinales = [];
    /* Es el calculo de gama Q para el tramo */
    let Gqq = calcGQ(arrCauda, arraDiam, arraLon, C);
    /* Corrige el valor de cada caudal */
    for (i in arrCauda) {
        let inser = calcQCorre(arrCauda[i],- Gqq);
        caudalesFinales.push(inser);
    }

    return caudalesFinales
}

/* Funcion para el calculo de array de gamaQ */
function circuitCalGQ (cauls, dimas, lons, C) {
    // Es para el retorno filan
    let arraGamaQs = []
    // Ciclo para el calculo por circuitos
    for (i in cauls) {
        // Realiza el calculo para la posterior insersion
        let a = calcGQ(cauls[i], dimas[i], lons[i], C);
        // Inserta el elemento calculado en el array
        arraGamaQs.push(a)
    }

    // Retorna el array final con los gamaQ en cada uno de los circuitos
    return arraGamaQs;
}


// EJEMPLO PARA LA SIMULACIÓN Y CREACIÓN DEL PROGRAMA
/* Datos de entrada */
let circuitos = ["Circuito 1", "Circuito 2"];
let tramos = ["Circuito 1" ,"AB", "BE", "DE", "AD", "Circuito 2" ,"BC", "CF", "EF", "BE"];
let caudalLps = ["Circuito 1", 35, 13, -8, -30, "Circuito 2", 12, 2, -6, -13];
let longiM = ["Circuito 1", 300, 230, 305, 230, "Circuito 2", 325, 230, 325, 230];
let diametroM = ["Circuito 1", 0.25, 0.25, 0.2, 0.3, "Circuito 2", 0.2, 0.15, 0.15, 0.25];
let tramosCom = ["BE"];

/* DESDE AQUI EMPIEZA EL CALCULO EN LOS DIFERENTES PUNTOS ######## */
/* Se usa para el calculo de dos circuitos se tiene que ampliar ######################################### */
/* Separacion de circuitos */
let tramosSepaComu = separarCircuitos(circuitos, tramos);
let cauSepa = separarCircuitos(circuitos, caudalLps);
let lonSep = separarCircuitos(circuitos, longiM);
let diamSepa = separarCircuitos(circuitos, diametroM);

// Esta es la simplificacion del ejercicio para la posterior intruduccion en los diferentes ciclos ########################
/* Posiciones de los tramos comunes por cicuito */
let uno = tramosSepaComu[0].indexOf(tramosCom[0]);
let dos = tramosSepaComu[1].indexOf(tramosCom[0]);

/* Obtencion del valor total de caudal para tramos comunes */
let gamCircuot = circuitCalGQ(cauSepa, diamSepa, lonSep, 80);
// console.log(gamCircuot)

let arrayResultado = [];

for (i in cauSepa) {
    arrayResultado.push(arrayCaudalFinal(cauSepa[i], diamSepa[i], lonSep[i], 80));
}


/* Modificación en los Tramos Comunes */
arrayResultado[0][uno] = arrayResultado[0][uno] - gamCircuot[1];
arrayResultado[1][dos] = arrayResultado[1][dos] - gamCircuot[0];
// Mediante lo siguiente se ubican los nombres de los nodos en el DOM#############################################
/* Ubicador de los puntos en la grilla */
let puntos = ["A", "B", "C", "D", "E", "F"];
let grillaPuntos = document.querySelector(".grilla");

/* Creacion de los puntos en el DOM*/
for (i in puntos) {
    // crea el nuevo punto en el DOM
    let nuevoPunto = document.createElement("div");
    // Añade la clase para su posterior ubicación
    nuevoPunto.classList.add("puntos");
    // Asigna el contenido de los puntos en base al array de puntos
    nuevoPunto.innerHTML = puntos[i];
    // Introduce el element en la grilla
    grillaPuntos.appendChild(nuevoPunto);
}


/* Ubicacion de puntos en el DOM ################# */
// Selecciona todos los puntos con la clase puntos
let masPuntos = document.querySelectorAll(".puntos");
// Elementos para el posterior uso en la ubicación de elementos
let mx = 0;
let mx2 = 0;

// Ubicacion de los puntos en el DOM
for (let i = 0; i < masPuntos.length; i++) {
    // Ubica los tres elementos superiores
    if (i <= 2) {
        masPuntos[i].style.top = "0px";
        // Ubica los puntos en el eje X
        masPuntos[i].style.left = mx + "px";
        mx += 250;
    }
    // Ubica los tres elementos inferiores
    else {
        masPuntos[i].style.left = mx2 + "px";
        mx2 += 250;
    }
}

// Funcion, transformacion array para el uso
function crearArraADOM (lonDOM, dimDOM, CaudDOM) {
    // Variables para el almacenamiento
    let nueCaud = [];
    let nueLon = [];
    let nueDiam = [];
    let cont = 0
    // Crea el array a partir de datos del DOM (inputs)
    for (let i = 0; i <= dimDOM.length -1; i++) {
        if (dimDOM[i].value == "Circuito 1" || dimDOM[i].value == "Circuito 2") {
            cont++
            nueLon.push("Circuito " + cont);
            nueDiam.push("Circuito " + cont);
            nueCaud.push("Circuito " + cont);
        }

        else {
            nueLon.push(parseFloat(lonDOM[i].value));
            nueDiam.push(parseFloat(diamDom[i].value));
            nueCaud.push(parseFloat(CaudDOM[i].value));
        }
    }

    return [nueCaud, nueLon, nueDiam]
}




/* Obtencion de valores del DOM */
let diamDom = document.querySelectorAll(".diametros");
let caudalDom = document.querySelectorAll(".caudal");
let longDom = document.querySelectorAll(".longitud");

/* Elementos auxiliares para la obtencio de valores */
let diamEntrada = [];
let caudaEntrada = [];
let longitudEntrada = [];
// Elementos para el ejercicio por circuito
let caud = [35, 13, -8, -30];
let lon = [300, 230, 305, 230];
let dia = [0.25, 0.25, 0.2, 0.3];

// Elemento para mostrar la información
let mostradorResultado = document.querySelectorAll(".mostrador");



/*######################################################### */
console.log(calcSumatoria(crearArraHi(caud, dia, lon, 80)).toFixed(4));

// Programación del boton para el calculo de los caudales reales
document.querySelector(".cla").addEventListener("click", function(){
    let columnaCuadro = crearArraADOM (longDom, diamDom, caudalDom);
    // Array para almacenar la energia de cada circuito
    let arraEnergia = [3, 3];
    // Metodo para la separacion de los array
    let cir = ["Circuito 1", "Circuito 2"];
    let tramosComun = ["BE"]
    let tramoss = ["Circuito 1" ,"AB", "BE", "DE", "AD", "Circuito 2" ,"BC", "CF", "EF", "BE"];
    let tramosSepaComu = separarCircuitos(cir, tramoss);
    let cauSepa = separarCircuitos(cir, columnaCuadro[0]);
    let lonSep = separarCircuitos(cir, columnaCuadro[1]);
    let diamSepa = separarCircuitos(cir, columnaCuadro[2]);

    // Define la posicion del elemento comun
    let uno = tramosSepaComu[0].indexOf(tramosComun[0]);
    let dos = tramosSepaComu[1].indexOf(tramosComun[0]);

    while (true) {
        let gamCircuot = circuitCalGQ(cauSepa, diamSepa, lonSep, 80);
        let nuevoCaudal = [];
        
        for (i in cauSepa) {
            arraEnergia[i] = (calcSumatoria(crearArraHi(cauSepa[i], diamSepa[i], lonSep[i], 80)));
        }

        console.warn(arraEnergia)
        
        for (i in cauSepa) {
            nuevoCaudal.push(arrayCaudalFinal(cauSepa[i], diamSepa[i], lonSep[i], 80));
        }

        nuevoCaudal[0][uno] = nuevoCaudal[0][uno] - gamCircuot[1];
        nuevoCaudal[1][dos] = nuevoCaudal[1][dos] - gamCircuot[0];
        
        console.error("Este es el resultado definitivo: ");
        cauSepa = nuevoCaudal;
        console.log(nuevoCaudal);

        if (arraEnergia[0] <= 0.1 && arraEnergia[1] <= 0.1) {
            break;
        }
    }

    console.error("Este es el caudal unido: ")
    console.log(cauSepa[0].concat(cauSepa[1]))
    let caudalesUnidos = cauSepa[0].concat(cauSepa[1]);
    console.error(caudalesUnidos)
    
    for (j in caudalesUnidos) {
        let elementInsertar = document.createElement("td");
        elementInsertar.innerHTML = `${caudalesUnidos[j]}`;
        elementInsertar.classList.add("esti-resulta")
        mostradorResultado[j].appendChild(elementInsertar);

        console.warn(caudalesUnidos[j])
    }

})

// FALTA HACER QUE EL RESULTADO SE MUESTRE EN LA TABLA DEL DOM











/* Bloque de Codigo ID Tramos Comunes */
{
    //     /* Solución para los dos circuitos */
    // /* Separación de las diferentes variables en circuitos */

    // let tramosEnsayo = ["Circuito 1" ,"AB", "AD", "BE", "DE", "Circuito 2" ,"BC", "BE", "EF", "CF", "Circuito 3" ,"DE", "DG", "EH", "GH", "Circuito 4" ,"EF", "GH", "HI", "FI"];
    // let cr = ["Circuito 1" ,"Circuito 2", "Circuito 3", "Circuito 4"]
    // let tramosSeparadoCircuitos = separarCircuitos(circuitos, tramos);
    // let caudalSeparadoCircuitos = separarCircuitos(circuitos, caudalLps);
    // let diametroSeparadoCircuitos = separarCircuitos(circuitos, diametroM);
    // let longitudSeparadaCircuitos = separarCircuitos(circuitos, longiM);

    // console.log(tramosSeparadoCircuitos)
    // // console.log(caudalSeparadoCircuitos)
    // // console.log(diametroSeparadoCircuitos)
    // // console.log(longitudSeparadaCircuitos)

    // let tramosComunes = ["BE"]

    // let gaamaQ = [];
    // /* Calculo de Gama Q por tramo */
    // for (i in caudalSeparadoCircuitos) {
    //     let mm = calcGQ(caudalSeparadoCircuitos[i], diametroSeparadoCircuitos[i], longitudSeparadaCircuitos[i], 80);
    //     gaamaQ.push(mm)
    // }
    // console.log(gaamaQ)

    // for (i in caudalSeparadoCircuitos) {
    //     console.log(arrayCaudalFinal(caudalSeparadoCircuitos[i], diametroSeparadoCircuitos[i], longitudSeparadaCircuitos[i], 80));
    // }

    // /* Cuando se termine de realizar un programa dejar
    // comentado que es lo que se va a hacer en dias posteriores */



    // /* Programa para la identificacion de tramos semejantes */
    // let tramosSepara = separarCircuitos(cr, tramosEnsayo);
    // console.group("Este es el tramo de ensyo");
    // console.log(tramosSepara);

    // /* Función Comparacion por Tramos */

    // function tramosComu(trSt, trMov, copaArr) {
    //     for (i of copaArr[trSt]) {
    //         for (j of copaArr[trMov]) {
    //             if (i == j) {
    //                 return i;
    //             }
    //         }
    //     }
    // }

    // /* Comparación Para el Primer Circuito */
    // console.groupEnd()
    // console.group("Comparación Para el tramo 0");
    // console.log(tramosComu(0, 1, tramosSepara));
    // console.log(tramosComu(0, 2, tramosSepara));
    // console.log(tramosComu(0, 3, tramosSepara));

    // /* Comparación Para el Segundo Circuito */
    // console.groupEnd()
    // console.group("Comparación Para el tramo 1");
    // console.log(tramosComu(1, 0, tramosSepara));
    // console.log(tramosComu(1, 2, tramosSepara));
    // console.log(tramosComu(1, 3, tramosSepara));

    // /* Comparación Para el Tercer Circuito */
    // console.groupEnd()
    // console.group("Comparación Para el tramo 2");
    // console.log(tramosComu(2, 0, tramosSepara));
    // console.log(tramosComu(2, 1, tramosSepara));
    // console.log(tramosComu(2, 3, tramosSepara));

    // /* Comparación Para el Cuarto Circuito */
    // console.groupEnd()
    // console.group("Comparación Para el tramo 2");
    // console.log(tramosComu(3, 0, tramosSepara));
    // console.log(tramosComu(3, 1, tramosSepara));
    // console.log(tramosComu(3, 2, tramosSepara));

    // /* Una de las mejores formas podira ser que el user ingrese los tramos
    // comunes */

    // /* Lo primordial ahora seria crear un sistema para restar el caudal en tramos comunes */


}
