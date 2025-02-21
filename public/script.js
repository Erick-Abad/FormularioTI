document.addEventListener("DOMContentLoaded", function () {
    // Verificar si los elementos existen antes de asignar eventos
    const tipoInstitucion = document.getElementById("tipo_institucion");
    const areaEmpresa = document.getElementById("area_empresa");
    const tamanoEmpresaSector = document.getElementById("tamano_empresa_sector");
    const empresaTi = document.getElementById("empresa_ti");

    if (tipoInstitucion) tipoInstitucion.addEventListener("change", mostrarOtroInstitucion);
    if (areaEmpresa) areaEmpresa.addEventListener("change", mostrarSubareas);
    if (tamanoEmpresaSector) tamanoEmpresaSector.addEventListener("change", mostrarTamanoEmpresa);
    if (empresaTi) empresaTi.addEventListener("change", mostrarPreguntasEmprendimiento);

    function mostrarOtroInstitucion() {
        const otroTipo = document.getElementById("otro_tipo");
        if (!otroTipo) return;
        otroTipo.style.display = tipoInstitucion.value === "otro" ? "block" : "none";
    }

    function mostrarSubareas() {
        const subareaSelect = document.getElementById("subarea");
        if (!subareaSelect) return;
        subareaSelect.innerHTML = "";
        subareaSelect.style.display = "block";
        subareaSelect.required = true;

        const opciones = {
            agropecuario: ["Agricultura", "Ganadería", "Silvicultura", "Pesca y Acuicultura"],
            industria: ["Industria Manufacturera", "Industria Extractiva", "Electricidad, Gas y Agua"],
            comercio: ["Comercio Mayorista", "Comercio Minorista", "Comercio Internacional"],
            servicios: ["Transporte", "Tecnología", "Finanzas", "Salud", "Educación"],
            edificacion: ["Obras públicas", "Infraestructura residencial", "Infraestructura comercial"],
            inmobiliarias: ["Venta y alquiler de propiedades", "Administración de propiedades", "Inversiones inmobiliarias"]
        };

        const areaSeleccionada = areaEmpresa.value;
        if (opciones[areaSeleccionada]) {
            opciones[areaSeleccionada].forEach(subarea => {
                let option = document.createElement("option");
                option.value = subarea.toLowerCase().replace(/ /g, "_");
                option.textContent = subarea;
                subareaSelect.appendChild(option);
            });
        }
    }

    function mostrarTamanoEmpresa() {
        const tamanoSelect = document.getElementById("tamano_empresa");
        if (!tamanoSelect) return;
        tamanoSelect.innerHTML = "";
        tamanoSelect.style.display = "block";
        tamanoSelect.required = true;

        const opcionesTamano = {
            industria: ["Micro (0-30 empleados)", "Pequeña (31-100 empleados)", "Mediana (101-500 empleados)", "Grande (501 en adelante)"],
            comercio: ["Micro (0-5 empleados)", "Pequeña (6-20 empleados)", "Mediana (21-100 empleados)", "Grande (101 en adelante)"],
            servicios: ["Micro (0-20 empleados)", "Pequeña (21-50 empleados)", "Mediana (51-100 empleados)", "Grande (101 en adelante)"]
        };

        const sectorSeleccionado = tamanoEmpresaSector.value;
        if (opcionesTamano[sectorSeleccionado]) {
            opcionesTamano[sectorSeleccionado].forEach(tamano => {
                let option = document.createElement("option");
                option.value = tamano.toLowerCase().replace(/ /g, "_");
                option.textContent = tamano;
                tamanoSelect.appendChild(option);
            });
        }
    }

    function mostrarPreguntasEmprendimiento() {
        const preguntasDiv = document.getElementById("preguntas_emprendimiento");
        if (!preguntasDiv) return;
        preguntasDiv.style.display = empresaTi.value === "si" ? "block" : "none";
    }

    function obtenerValoresRadio(name) {
        const opciones = document.getElementsByName(name);
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                return opciones[i].value;
            }
        }
        return null;
    }

    const form = document.getElementById("surveyForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const requiredFields = [
            "primer_empleo",
            "importancia_conocimientos",
            "como_encontro_empleo",
            "tipo_contrato",
            "modalidad_actual",
            "modalidad_preferida",
            "nivel_desempeno",
            "rango_salarial"
        ];

        for (let field of requiredFields) {
            if (!obtenerValoresRadio(field)) {
                alert(`Por favor, complete la pregunta: ${field.replace(/_/g, " ")}`);
                document.querySelector(`input[name="${field}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }

        const checkboxGroups = [
            "dificultades_empleo",
            "conocimientos_faltantes",
            "pruebas_seleccion"
        ];

        for (let group of checkboxGroups) {
            const checkboxes = document.querySelectorAll(`input[name="${group}"]:checked`);
            if (checkboxes.length === 0) {
                alert(`Por favor, seleccione al menos una opción en: ${group.replace(/_/g, " ")}`);
                document.querySelector(`input[name="${group}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }

        const requiredSectionE = [
            "calidad_academica",
            "instalaciones_recursos",
            "ambiente_universitario",
            "oportunidades_investigacion",
            "intercambio_relaciones",
            "insercion_laboral",
            "adaptabilidad_innovacion",
            "responsabilidad_social",
            "reputacion_universidad",
            "preparacion_docentes",
            "metodologia_docentes",
            "apoyo_docentes",
            "nivel_conocimiento",
            "gestion_administrativa_tramites",
            "gestion_administrativa_personal",
            "gestion_administrativa_normativas",
            "gestion_recursos",
            "resolucion_problemas",
            "satisfaccion_desarrollo",
            "herramientas_adaptacion",
            "frecuencia_eventos",
            "identificacion_ug",
            "recomienda_ug"
        ];

        for (let question of requiredSectionE) {
            if (!obtenerValoresRadio(question)) {
                alert(`Por favor, responda la pregunta: ${question.replace(/_/g, " ")}`);
                document.querySelector(`input[name="${question}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }

        const formData = new FormData(form);
        const jsonObject = {};
        formData.forEach((value, key) => { jsonObject[key] = value.trim(); });

        try {
            const response = await fetch(`${window.location.origin}/api/sendEmail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonObject),
            });

            if (!response.ok) throw new Error(`Error en el servidor: ${await response.text()}`);

            alert("Encuesta enviada con éxito ✅");
            form.reset();
        } catch (error) {
            alert("Hubo un problema al enviar el formulario ❌");
            console.error(error);
        }
    });
});
