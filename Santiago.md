# GUION DE EXPOSICIÓN — FLUJO "CREAR / ACTUALIZAR TAREA"

> Cómo hablar cada punto, qué mostrar en la web y qué pasa si hago Ctrl+Enter (Ctrl + clic) a una función.
> Las líneas referenciadas son las del archivo **app.js** (rama `feat/comentarios-exposicion`).

---

## 1. El formulario de tareas escucha el evento submit (app.js:223-232)

**Qué decir:**
"El `taskForm` es el formulario de tareas, el elemento `<form>` que está en esta vista (la referencia llega desde `config.js`). Le agregamos un `addEventListener` — un oyente — que está pendiente del evento `submit`: cada vez que se pulsa el botón de enviar, se dispara esta función. Es `async` porque por dentro va a esperar peticiones con `await`, y recibe `event`, que es el objeto con la información del envío."

**En la web:** señala el formulario de tareas (título, descripción, estado, selector de usuarios y el botón). Escribe algo en el título para que vean el campo "vivo".

**Ctrl+Enter a `taskForm`:** va a `src/services/config.js` → ahí dice `export const taskForm = document.getElementById("task-form")`, es decir: la referencia directa al `<form id="task-form">` del HTML.

---

## 2. event.preventDefault() (app.js:229-232)

**Qué decir:**
"Lo primero que hago es `event.preventDefault()`, que le dice al navegador: *no hagas lo que harías por defecto*, que sería recargar la página completa al hacer submit. Con esto el envío lo manejamos nosotros desde JavaScript y la página no se reinicia."

**En la web:** explica: "Si esto no estuviera, al darle guardar la página se refrescaría y perderíamos todo el estado".

---

## 3. Leer los valores del formulario (app.js:234-243)

**Qué decir:**
- `taskTitle.value` toma lo que el usuario escribió en el input del título; `.trim()` le quita los espacios de los lados y el resultado se guarda en la variable `title` para validarlo y mandarlo después.
- Igual con `taskDesc.value`: lee el textarea de la descripción y queda en `description`.
- `taskStatus.value` lee la opción elegida en el select del estado (pendiente, en progreso, completada) y queda en `status`.

**En la web:** mientras hablas, escribe en el input del título y muestra cómo se "captura" el valor.

---

## 4. getEditingTaskId() (app.js:245-248)

**Qué decir:**
"`getEditingTaskId()` devuelve lo que esté guardado en la memoria del proyecto: si devuelve `null`, el formulario está en modo crear; si devuelve un id, ese es el de la tarea que vamos a actualizar."

**Ctrl+Enter:** `src/services/config.js` → `let editingTaskId = null` con su getter y setter: es solo una variable de estado en memoria.

**Demo de edición:** haz clic en "Actualizar" de una tarjeta → se llena el formulario y el botón dice "Actualizar Tarea". Ese id quedó guardado con `setEditingTaskId(taskId)`.

---

## 5. getSelectedUserIds() (app.js:250-253)

**Qué decir:**
"`getSelectedUserIds()` lee el estado interno de los usuarios marcados como chips y devuelve solo sus ids en un arreglo. Esos ids se usan después para asignarle la tarea a esos usuarios."

**En la web:** abre el select "Asignar a usuarios", elige uno y muestra el chip que aparece.

**Ctrl+Enter:** `src/ui/userSelectUI.js` → `selectedUsers` guarda `{ id, name }` y la función hace `selectedUsers.map(u => u.id)`: convierte la lista en solo ids.

---

## 6. Limpiar mensajes de error (app.js:255-261)

**Qué decir:**
"`setTextContent(elemento, "")` escribe un texto en el elemento; acá lo dejamos vacío, o sea que se borran los mensajes de error que hayan quedado de una validación anterior: el del título, el de la descripción, el del estado y el de los usuarios."

**En la web:** si dejas el título vacío y guardas, aparece el error rojo; luego vuelve a guardar y muestra cómo se limpia al reintentar.

---

## 7. Validaciones (app.js:263-301)

**Qué decir (clave, despacio):**
"`if (!isValidInput(title))` es *si el título NO es válido*. `isValidInput()` devuelve `true` solo cuando el valor no está vacío; el signo `!` invierte esa respuesta, así que la condición se cumple cuando el título está vacío. Si se cumple: `setTextContent` escribe el aviso debajo del input, `showErrorMessage` lanza un toast de error y el `return` corta la función acá, nada de lo que sigue se ejecuta."

"Lo mismo para la descripción, el estado y los usuarios (`selectedUserIds.length` es la cantidad de elementos: 0 cuando no se eligió nadie, y el `!` lo convierte en verdadero, entonces entra y pide mínimo un usuario)."

**En la web:** deja el formulario vacío y dale guardar: muestra el error bajo el input + toast rojo. Luego completa todo y muestra que pasa.

**Ctrl+Enter a `isValidInput`:** `src/utils/validateInput.js` → `return value != null && value.trim() !== ""`: "si no es null y, después de quitar espacios, no es una cadena vacía".

---

## 8. El try y el modo edición (app.js:303-343)

**Qué decir:**
"Dentro del `try` se intenta la petición; si algo sale mal, el error cae en el `catch`. `if (editingId)` pregunta: *¿hay una tarea en edición?* Si trae un id, entramos en modo editar."

"`await updateTaskWithAssignments(editingId, {...})` llama a la función que actualiza la tarea: el **primer parámetro** es el id de la tarea a modificar y el **segundo** es un objeto con los datos — `userIds` (los usuarios a asignar), `title`, `description` y `status`. El `await` espera la respuesta del backend."

**En la web:** con el formulario en modo edición (con la tarea cargada), cambia el título y dale guardar: aparece el toast verde y la tarjeta se actualiza.

---

## 9. La limpieza después de la petición (app.js:321-343)

**Qué decir (6 pasos, en orden):**
1. `setEditingTaskId(null)` — borra el id guardado: el formulario vuelve a modo crear.
2. `taskForm.reset()` — resetea el formulario: borra todo lo que había en los inputs.
3. `clearSelectedUsers()` — vacía los chips de usuarios marcados.
4. `setTextContent(..., "Guardar Tarea")` — el botón vuelve a decir "Guardar Tarea".
5. `showMessage("Tarea actualizada correctamente")` — notificación de éxito (toast verde).
6. `allTasks = await loadAllTasks()` — vuelve a pedir todas las tareas y se pinta la tabla de nuevo.

**En la web:** después de actualizar, muestra que el formulario quedó vacío, el botón dice "Guardar Tarea" y no hay chips.

**Ctrl+Enter a `loadAllTasks`:** `src/services/renderService.js` → llama a `getAllTasksWithUsers()` (que junta tareas + asignaciones + usuarios con `Promise.all`), actualiza el contador y vuelve a dibujar las tarjetas.

---

## 10. El else: modo creación (app.js:344-362)

**Qué decir:**
"`else`: si `editingId` no trae ningún id, no hay tarea en edición, entonces es una tarea nueva. `createTaskWithAssignments({...})` manda a guardar la tarea nueva con el mismo objeto: `userIds` son los ids de los usuarios a los que se le asigna, más `title`, `description` y `status`. Después hace la misma limpieza: reset, limpiar usuarios, notificación y recarga."

**En la web:** con el formulario en limpio, registra una tarea completa y muestra el toast verde + la tarjeta nueva.

---

## 11. SI EL PROFE HACE CTRL+ENTER (o Ctrl + clic) a una función

> Ojo: al hacer Ctrl+Enter sobre un import en `app.js` el editor salta primero a un archivo **index.js** (el "barrel"), que solo re-exporta. Hay que seguir al archivo real:

| Función | Archivo real | Qué decir |
|---|---|---|
| `taskForm`, `taskTitle`, `taskStatus`, `tasksTable` | `src/services/config.js` | "Son referencias directas a los elementos del HTML, obtenidas con `document.getElementById`." |
| `getEditingTaskId` / `setEditingTaskId` | `src/services/config.js` | "Getter y setter de una variable de memoria que guarda el id en edición." |
| `getSelectedUserIds`, `clearSelectedUsers`, `setSelectedUsers` | `src/ui/userSelectUI.js` | "Manejan el estado `selectedUsers` (los ids de los chips) y redibujan los chips." |
| `isValidInput` | `src/utils/validateInput.js` | "Devuelve true si el valor no es null y no está vacío después de quitar espacios." |
| `setTextContent` | `src/ui/setTextContent.js` | "Doble función: si le pasan un valor lo escribe; si no, devuelve el texto del elemento (se usa para leer el título al editar)." |
| `showMessage` / `showErrorMessage` | `src/ui/notifications.js` | "Crean los toasts: mensajes flotantes que desaparecen solos a los 2 segundos; verde = éxito, rojo = error." |
| `updateTaskWithAssignments` | `src/services/taskService.js` | Ver punto 12. |
| `createTaskWithAssignments` | `src/services/taskService.js` | "Separa `userIds` del resto, crea la tarea y luego crea una asignación por cada usuario con una pausa de 1 segundo entre peticiones." |
| `tasksApi.update` | `src/api/tasksApi.js` | Ver punto 13. |
| `fetchApi` | `src/utils/fetchApi.js` | Ver punto 14. |
| `loadAllTasks` / `renderFilteredTasks` | `src/services/renderService.js` | "Recargan y pintan la tabla: traen tareas con sus usuarios, aplican filtros y dibujan cada tarjeta." |

---

## 12. updateTaskWithAssignments (src/services/taskService.js)

**Qué decir (paso a paso):**
"Esta función es la orquesta del actualizar. Primero separa el id del resto del cuerpo: `userIds` queda aparte y `taskPayload` queda con `{ title, description, status }`. Luego trae todas las asignaciones (`assignmentsApi.get()`), filtra las de esta tarea y calcula diferencias: `toAdd` son los usuarios nuevos a asignar y `toRemove` son las asignaciones que ya no se quieren. Crea las nuevas con `assignmentsApi.create`, borra las viejas con `assignmentsApi.delete` (con una pausa de 1 segundo para no saturar el servidor) y, al final, actualiza los datos de la tarea con `tasksApi.update(taskId, taskPayload)`."

---

## 13. tasksApi.update (src/api/tasksApi.js)

**Qué decir (importante, es el cierre):**
"`update` recibe dos parámetros: `id` — el id de la tarea a tocar — y `taskData` — el cuerpo con los datos ya actualizados. Hace una petición **PATCH** al endpoint `/tasks/{id}` y le manda el cuerpo convertido a JSON con `JSON.stringify` (convierte el objeto JavaScript a texto). **Y hasta acá llega el frontend: el PATCH pasa al backend, que es el flujo que explica el siguiente compañero.**"

**Ctrl+Enter a `tasksApi`:** cae en `src/api/index.js` (barrel) → seguir a `src/api/tasksApi.js`.

---

## 14. fetchApi (src/utils/fetchApi.js)

**Qué decir:**
"`fetchApi` es la 'mensajera' del proyecto: todas las APIs la usan para hablar con el backend. Hace el `fetch`, y si la respuesta salió bien (`response.ok`) devuelve los datos en JSON. Si el servidor no responde, lanza 'Servicio no disponible'. Si responde con error (404, 500), intenta leer el mensaje del cuerpo de la respuesta y lo lanza como un `Error`, que el `catch` del flujo muestra como toast."

---

## 15. Cierre

**Qué decir:**
"Entonces el flujo completo de actualizar es: el formulario escucha el submit → se evita la recarga → se leen y validan los datos → se revisa si es edición o creación → si es edición, `updateTaskWithAssignments` separa el id, sincroniza las asignaciones y al final llama a `tasksApi.update` → que hace un PATCH al endpoint `/tasks/{id}` con los datos en JSON. Ahí termina el frontend; el PATCH pasa al backend, que lo explica mi compañero."

---
