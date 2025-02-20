document.addEventListener("DOMContentLoaded", function () {
    // Verificar si los elementos existen antes de asignar eventos para evitar errores
    const tipoInstitucion = document.getElementById("tipo_institucion");
    const areaEmpresa = document.getElementById("area_empresa");
    const tamanoEmpresaSector = document.getElementById("tamano_empresa_sector");
    const empresaTi = document.getElementById("empresa_ti");

    if (tipoInstitucion) tipoInstitucion.addEventListener("change", mostrarOtroInstitucion);
    if (areaEmpresa) areaEmpresa.addEventListener("change", mostrarSubareas);
    if (tamanoEmpresaSector) tamanoEmpresaSector.addEventListener("change", mostrarTamanoEmpresa);
    if (empresaTi) empresaTi.addEventListener("change", mostrarPreguntasEmprendimiento);

    // Función para mostrar el campo "Otro tipo de institución"
    function mostrarOtroInstitucion() {
        const otroTipo = document.getElementById("otro_tipo");
        if (!otroTipo) return;
        otroTipo.style.display = tipoInstitucion.value === "otro" ? "block" : "none";
    }

    // Función para mostrar subáreas según la categoría de la empresa
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

    // Función para mostrar tamaños de empresa según el sector seleccionado
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

    // Función para mostrar preguntas adicionales sobre emprendimiento
    function mostrarPreguntasEmprendimiento() {
        const preguntasDiv = document.getElementById("preguntas_emprendimiento");
        if (!preguntasDiv) return;
        preguntasDiv.style.display = empresaTi.value === "si" ? "block" : "none";
    }

    // Capturar valores de preguntas con radio buttons de la Sección C
    function obtenerValoresRadio(name) {
        const opciones = document.getElementsByName(name);
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                return opciones[i].value;
            }
        }
        return null; // Si no se selecciona ninguna opción
    }

    // Manejo del formulario y envío a la API
    const form = document.getElementById("surveyForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonObject = {};

        // Capturar valores de input y selects normalmente
        formData.forEach((value, key) => {
            jsonObject[key] = value.trim();
        });

        // Capturar valores de las preguntas de la Sección C (Radio Buttons)
        const competenciasGenericas = [
            "pensamiento_critico", "resolucion_problemas", "comunicacion_oral", "comunicacion_escrita",
            "trabajo_equipo", "liderazgo", "aprendizaje_continuo", "adaptabilidad", "etica_profesional",
            "innovacion_emprendimiento", "trabajo_bajo_presion"
        ];

        competenciasGenericas.forEach((competencia) => {
            jsonObject[competencia] = obtenerValoresRadio(competencia);
        });

        // Capturar valores de las preguntas de la Sección C (Selects)
        const competenciasEspecificas = [
            "desarrollo_software", "admin_sistemas_redes", "base_datos", "seguridad_informatica",
            "gestion_proyectos_ti", "arquitectura_ti", "cloud_virtualizacion",
            "devops_automatizacion", "adaptacion_nuevas_tecnologias"
        ];

        competenciasEspecificas.forEach((competencia) => {
            jsonObject[competencia] = formData.get(competencia);
        });

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
