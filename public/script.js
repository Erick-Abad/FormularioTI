document.addEventListener("DOMContentLoaded", function () {
    // Verificar si los elementos existen antes de asignar eventos para evitar errores
    const tipoInstitucion = document.getElementById("tipo_institucion");
    const areaEmpresa = document.getElementById("area_empresa");
    const tamanoEmpresaSector = document.getElementById("tamano_empresa_sector");
    const tamanoEmpresa = document.getElementById("tamano_empresa"); // Nuevo: Referencia al select de tamaño de empresa
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

        // Nueva validación: Verificar si el usuario ha respondido "Área en la que se desempeña la empresa"
        if (!areaEmpresa.value) {
            alert("Por favor, seleccione el área en la que se desempeña la empresa donde labora/laboró.");
            areaEmpresa.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // Nueva validación: Verificar si el usuario ha respondido "Tamaño de la empresa"
        if (!tamanoEmpresaSector.value) {
            alert("Por favor, seleccione el sector de la empresa.");
            tamanoEmpresaSector.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (!tamanoEmpresa.value) {
            alert("Por favor, seleccione el tamaño de la empresa.");
            tamanoEmpresa.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

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
