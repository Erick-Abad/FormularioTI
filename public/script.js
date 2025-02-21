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

    // Función para obtener valores de radio buttons
    function obtenerValoresRadio(name) {
        const opciones = document.getElementsByName(name);
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                return opciones[i].value;
            }
        }
        return null; // Si no se selecciona ninguna opción
    }

    // Manejo del formulario y envío a la API con validación de preguntas obligatorias
    const form = document.getElementById("surveyForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const requiredFields = [
            { name: "primer_empleo", label: "¿En qué tiempo obtuvo su primer empleo?" },
            { name: "importancia_conocimientos", label: "¿Qué tan importante considera que son los conocimientos adquiridos en la universidad para su primer empleo?" },
            { name: "como_encontro_empleo", label: "¿Cómo encontró su empleo actual?" },
            { name: "tipo_contrato", label: "Seleccione el tipo de contrato laboral que tuvo en su primer empleo como profesional de TI en Ecuador" },
            { name: "modalidad_actual", label: "Seleccione la modalidad en la que trabaja actualmente." },
            { name: "modalidad_preferida", label: "Seleccione la modalidad de trabajo que usted prefiere." },
            { name: "nivel_desempeno", label: "Seleccione el nivel que desempeña / desempeñó sus actividades dentro de la empresa en el ámbito de Tecnologías de la Información" },
            { name: "rango_salarial", label: "¿Cuál es el rango salarial mensual para profesionales en TI que percibió en su primer empleo?" }
        ];

        for (let field of requiredFields) {
            if (!document.querySelector(`input[name="${field.name}"]:checked`)) {
                alert(`Falta escoger el casillero: ${field.label}`);
                document.querySelector(`input[name="${field.name}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }

        // Verificación de al menos un checkbox en grupos de selección múltiple
        const checkboxGroups = [
            { name: "dificultades_empleo", label: "Seleccione los motivos que dificultan obtener un empleo en su área profesional" },
            { name: "conocimientos_faltantes", label: "¿Qué conocimientos en su área considera que le hicieron falta?" },
            { name: "pruebas_seleccion", label: "Durante sus procesos de búsqueda de empleo, ¿qué tipo de pruebas o instrumentos de selección ha experimentado?" }
        ];

        for (let group of checkboxGroups) {
            const checkboxes = document.querySelectorAll(`input[name="${group.name}"]:checked`);
            if (checkboxes.length === 0) {
                alert(`Falta escoger el casillero: ${group.label}`);
                document.querySelector(`input[name="${group.name}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
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
