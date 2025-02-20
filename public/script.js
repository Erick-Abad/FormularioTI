document.addEventListener("DOMContentLoaded", function () {
    // Mostrar campo "Otro" para tipo de institución
    document.getElementById("tipo_institucion").addEventListener("change", function () {
        document.getElementById("otro_tipo").style.display = this.value === "otro" ? "block" : "none";
    });

    // Mostrar subcategoría de área de empresa
    document.getElementById("area_empresa").addEventListener("change", function () {
        mostrarSubareas();
    });

    // Mostrar opciones de tamaño de empresa
    document.getElementById("tamano_empresa_sector").addEventListener("change", function () {
        mostrarTamanoEmpresa();
    });

    // Mostrar preguntas de emprendimiento si responde "Sí"
    document.getElementById("empresa_ti").addEventListener("change", function () {
        mostrarPreguntasEmprendimiento();
    });

    // Función para mostrar subcategorías de área de empresa
    function mostrarSubareas() {
        const subareaSelect = document.getElementById("subarea");
        subareaSelect.innerHTML = ""; // Limpiar opciones anteriores
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

        const areaSeleccionada = document.getElementById("area_empresa").value;
        if (opciones[areaSeleccionada]) {
            opciones[areaSeleccionada].forEach(subarea => {
                let option = document.createElement("option");
                option.value = subarea.toLowerCase().replace(/ /g, "_");
                option.textContent = subarea;
                subareaSelect.appendChild(option);
            });
        }
    }

    // Función para mostrar tamaño de empresa
    function mostrarTamanoEmpresa() {
        const tamanoSelect = document.getElementById("tamano_empresa");
        tamanoSelect.innerHTML = "";
        tamanoSelect.style.display = "block";
        tamanoSelect.required = true;

        const opcionesTamano = {
            industria: ["Micro (0-30 empleados)", "Pequeña (31-100 empleados)", "Mediana (101-500 empleados)", "Grande (501 en adelante)"],
            comercio: ["Micro (0-5 empleados)", "Pequeña (6-20 empleados)", "Mediana (21-100 empleados)", "Grande (101 en adelante)"],
            servicios: ["Micro (0-20 empleados)", "Pequeña (21-50 empleados)", "Mediana (51-100 empleados)", "Grande (101 en adelante)"]
        };

        const sectorSeleccionado = document.getElementById("tamano_empresa_sector").value;
        if (opcionesTamano[sectorSeleccionado]) {
            opcionesTamano[sectorSeleccionado].forEach(tamano => {
                let option = document.createElement("option");
                option.value = tamano.toLowerCase().replace(/ /g, "_");
                option.textContent = tamano;
                tamanoSelect.appendChild(option);
            });
        }
    }

    // Función para mostrar preguntas de emprendimiento
    function mostrarPreguntasEmprendimiento() {
        const preguntasDiv = document.getElementById("preguntas_emprendimiento");
        preguntasDiv.style.display = document.getElementById("empresa_ti").value === "si" ? "block" : "none";
    }

    // Manejo del formulario y envío a API
    const form = document.getElementById("surveyForm");
    const errorDiv = document.createElement("div");
    errorDiv.id = "errorMessage";
    errorDiv.style.color = "red";
    errorDiv.style.display = "none";
    form.insertBefore(errorDiv, form.firstChild);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        errorDiv.innerHTML = "";
        errorDiv.style.display = "none";

        let formData = {
            nombres: document.getElementById("nombres").value.trim(),
            apellidos: document.getElementById("apellidos").value.trim(),
            cedula: document.getElementById("cedula").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            discapacidad: document.getElementById("discapacidad").value,
            estado_civil: document.getElementById("estado_civil").value,
            cargas_familiares: document.getElementById("cargas_familiares").value,
            edad: document.getElementById("edad").value,
            sexo: document.getElementById("sexo").value,
            carrera: document.getElementById("carrera").value,
            anio_graduacion: document.getElementById("anio_graduacion").value,
            situacion_laboral: document.getElementById("situacion_laboral").value,
            tipo_institucion: document.getElementById("tipo_institucion").value,
            area_empresa: document.getElementById("area_empresa").value,
            tamano_empresa: document.getElementById("tamano_empresa").value,
            negocio_ti: document.getElementById("negocio_ti").value,
            empresa_ti: document.getElementById("empresa_ti").value
        };

        // Validaciones
        if (!formData.nombres || !formData.cedula || !formData.correo) {
            errorDiv.innerHTML = "Por favor, complete todos los campos obligatorios.";
            errorDiv.style.display = "block";
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.cedula)) {
            errorDiv.innerHTML = "Ingrese un número de cédula válido de 10 dígitos.";
            errorDiv.style.display = "block";
            return;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(formData.nombres)) {
            errorDiv.innerHTML = "El nombre solo puede contener letras y espacios.";
            errorDiv.style.display = "block";
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.correo)) {
            errorDiv.innerHTML = "Ingrese un correo electrónico válido.";
            errorDiv.style.display = "block";
            return;
        }

        // Enviar los datos al servidor para procesar el correo
        try {
            const response = await fetch(`${window.location.origin}/api/sendEmail`, { // ✅ Se usa URL dinámica para Vercel
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en el servidor: ${errorText}`);
            }

            alert("Encuesta enviada con éxito. ✅");
            form.reset();
        } catch (error) {
            console.error("Error en el envío:", error);
            errorDiv.innerHTML = `Hubo un problema al enviar el formulario ❌. ${error.message}`;
            errorDiv.style.display = "block";
        }
    });
});
