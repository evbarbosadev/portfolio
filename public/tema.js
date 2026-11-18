/*
    Se ejecuta antes del primer pintado. Va en un fichero propio (y no en línea) para que la
    CSP pueda quedarse en script-src 'self'. Las claves coinciden con las de src/constantes.ts.
*/
(function () {
    var raiz = document.documentElement;
    var temaGuardado;
    var idiomaGuardado;

    try {
        temaGuardado = localStorage.getItem("tema");
        idiomaGuardado = localStorage.getItem("idioma");
    } catch {
        // Con el almacenamiento bloqueado (modo privado estricto) se sigue el tema del sistema.
    }

    // Quien entra en / sin haber elegido idioma con el botón y no prefiere español pasa a /en.
    // Solo en / a secas: /en, los proyectos y los enlaces con ancla se respetan. replace() no
    // deja / en el historial, así que «atrás» no vuelve a redirigir. Los buscadores (Google
    // renderiza en inglés) se quedan en /, para que la portada en español siga indexada.
    var idiomaDelNavegador = (navigator.languages && navigator.languages[0]) || navigator.language;
    var prefiereEspañol = !idiomaDelNavegador || /^es(-|$)/i.test(idiomaDelNavegador);
    var esBuscador = /bot|crawl|spider|slurp/i.test(navigator.userAgent);

    if (
        location.pathname === "/" &&
        !location.hash &&
        !idiomaGuardado &&
        !prefiereEspañol &&
        !esBuscador
    ) {
        location.replace("/en" + location.search);
        return;
    }

    if (temaGuardado === "claro" || temaGuardado === "oscuro") {
        raiz.dataset.tema = temaGuardado;
    } else {
        raiz.dataset.tema = matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
    }

    // Marca que hay JavaScript: los controles que lo necesitan solo se muestran con esta clase.
    raiz.classList.add("js");
})();
