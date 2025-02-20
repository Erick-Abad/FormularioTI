document.addEventListener("DOMContentLoaded", function () {
    // Asignación de eventos para mostrar opciones adicionales
    document.getElementById("tipo_institucion").addEventListener("change", mostrarOtroInstitucion);
    document.getElementById("area_empresa").addEventListener("change", mostrarSubareas);
    document.getElementById("tamano_empresa_sector").addEventListener("change", mostrarTamanoEmpresa);
    document.getElementById("empresa_ti").addEventListener("change", mostrarPreguntasEmprendimiento);

    function mostrarOtroInstitucion() {
        document.getElementById("otro_tipo").style.display = document.getElementById("tipo_institucion").value === "otro" ? "block" : "none";
    }

    function mostrarSubareas() {
        const subareaSelect = document.getElementById("subarea");
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

    function mostrarPreguntasEmprendimiento() {
        document.getElementById("preguntas_emprendimiento").style.display =
            document.getElementById("empresa_ti").value === "si" ? "block" : "none";
    }

    // Manejo del formulario y envío a la API
    const form = document.getElementById("surveyForm");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonObject = {};
        formData.forEach((value, key) => { jsonObject[key] = value.trim(); });

        try {
            const response = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonObject),
            });

            if (!response.ok) throw new Error("Error en el servidor");

            alert("Encuesta enviada con éxito ✅");
            form.reset();
        } catch (error) {
            alert("Hubo un problema al enviar el formulario ❌");
            console.error(error);
        }
    });
});
