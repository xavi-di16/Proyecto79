# Anchor79 — Frontend

Base React + TypeScript + Vite para FE-001. Requiere Node.js 22.12+ y npm (ver también los requisitos de las dependencias bloqueadas en package-lock.json).

## Desarrollo

Ejecutar desde frontend/:

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run lint
npm run preview
```

En PowerShell con scripts bloqueados, usar npm.cmd en lugar de npm. No es necesario cambiar la política de ejecución.

## Organización

- src/App.tsx: estructura de página y tema mediante estado React. Tema oscuro inicial; la selección no persiste al recargar.
- src/features/auth/pages/LoginPage.tsx: presentación del login y avisos para registro y recuperación futuros.
- src/features/auth/components/AuthBrandPanel.tsx: logo de código, presentación y beneficios de la plataforma.
- src/features/auth/components/LoginForm.tsx: campos controlados, validación local, visibilidad de contraseña y mensaje demostrativo.
- src/features/auth/pages/RegisterPage.tsx y components/RegisterForm.tsx: registro demostrativo con validación local.
- src/features/auth/components/AuthLayout.tsx y AuthIcon.tsx: composición e iconografía compartidas entre login y registro.
- src/styles/tokens.css: paletas solicitadas y colores de uso con contraste AA.
- src/styles/global.css: composición responsive, controles, foco visible y reducción de movimiento.

No se creó una carpeta components/ui vacía: por ahora no existen componentes compartidos que justifiquen esa abstracción.

## Alcance

No hay autenticación, peticiones a la API, Firebase, almacenamiento de credenciales ni JWT. Un formulario válido muestra únicamente un aviso explícito de demostración pendiente de integración. El enlace de registro abre el formulario local; recuperación conserva su aviso de disponibilidad futura.

Las credenciales existen solamente en el estado del formulario durante la sesión de la página. No se registran en consola ni se guardan en almacenamiento del navegador.

## Accesibilidad

Labels asociados, autocomplete, campos obligatorios, errores textuales con aria-describedby y aria-invalid, foco en el primer campo inválido y regiones alert/status. Los controles son accesibles por teclado y el selector de tema indica su estado mediante aria-pressed.

Se conservan los tokens base solicitados. Para texto secundario claro se utiliza --muted-text (#5B6A7E), ya que #64748B sobre #F5F7FA queda en 4,43:1. Se agregan --control-border y --error-text para contraste suficiente sin alterar la paleta base. Los colores semánticos success/warning quedan definidos, sin presentar estados ajenos al alcance.

## Verificación FE-001

TypeScript estricto, build y Oxlint. Además, se verificaron en Chrome headless mediante un script temporal sin dependencias adicionales: campos vacíos, correo inválido, formulario válido sin recarga, mostrar/ocultar contraseña, avisos de enlaces futuros, selector de tema, orden de tabulación y ausencia de scroll horizontal a 320, 768 y 1440 px en ambos temas. No se detectaron errores de consola ni solicitudes a la API en esos recorridos. Se inspeccionó una captura desktop.

Se midieron contrastes de texto, texto secundario, errores y botón (mínimo 4,5:1), y bordes/foco (mínimo 3:1) en ambas paletas. Estas verificaciones no sustituyen una auditoría completa con lectores de pantalla y dispositivos reales.

## Continuidad

En una tarea posterior: integrar los endpoints de login y registro con el JWT propio del backend, y agregar recuperación. La integración HTTP no forma parte de las pantallas demostrativas actuales.

## FE-001B.1 — Layout de autenticación

Se tomó como referencia principal el segundo boceto aprobado. LoginPage compone el panel de marca y una tarjeta con título, subtítulo, formulario y enlaces. App conserva la configuración general y el estado del tema; la decoración circular se dibuja con CSS usando los tokens existentes y queda recortada en una capa independiente con aria-hidden y pointer-events: none.

- Desde 960 px: dos columnas, contenido limitado a 1120 px y tarjeta de hasta 440 px. La tarjeta no ocupa toda la columna.
- Por debajo de 960 px: una columna. Se mantiene el logo y se oculta el bloque comercial para priorizar el formulario sin comprimirlo. El orden del DOM se conserva.
- Hasta 480 px: padding lateral de 16 px y padding reducido en la tarjeta. No hay alturas fijas para el contenido; se permite scroll vertical natural.

LoginForm.tsx y tokens.css se conservaron sin modificaciones respecto de FE-001. No se agregaron dependencias.

Verificación: typecheck, build y lint correctos. Chrome headless comprobó ambos temas a 320, 368, 390, 768 y 1440 px, incluidos mensajes del formulario, ausencia de scroll horizontal, controles dentro del ancho visible y botón alcanzable mediante scroll vertical. Se verificaron el orden de tabulación, el cambio de tema, la validación, mostrar/ocultar contraseña, los enlaces futuros y el envío sin recarga. La decoración no intercepta los controles. No se detectaron errores de consola ni llamadas a la API. Se revisaron capturas de escritorio (1440 x 900) y móvil (390 x 844) en ambos temas, generadas temporalmente en node_modules/.tmp/fe-001b1-*.png.

Diferencias respecto del boceto: se conservan la paleta y los controles accesibles de FE-001, incluidos el botón textual Mostrar/Ocultar y el enlace de recuperación debajo del botón principal para no modificar el formulario. El círculo es CSS sin textura fotográfica y se conserva el pie de página. Las barras de ventana del boceto no forman parte de la interfaz. No se realizó una prueba con dispositivos físicos o lectores de pantalla.

## FE-001B.2 — Refinamiento visual

Se conserva el layout aprobado, las columnas, el máximo de tarjeta de 440 px y los breakpoints de 960 y 480 px. Sin medidas exactas en los bocetos, se eligieron: logo constante de 22 px con símbolo SVG de 36 x 32 px en todas las pantallas; título comercial de 30–36 px; título de login de 24–26 px; padding desktop de tarjeta de 30 x 28 px; inputs y botón de al menos 44 px para facilitar su uso. Se mantiene la tipografía del sistema, sin fuentes externas.

LoginForm cambia únicamente su presentación: contenedores con iconos SVG de correo/candado, botón de ojo con nombre accesible dinámico, flecha SVG y un espacio recoveryLink de tipo ReactNode antes del botón principal. LoginPage proporciona el mismo enlace y manejador de recuperación que ya existía; no se trasladan estados ni se modifica el comportamiento. Los estados, refs, validación, envío y manejadores de campos/enlaces se compararon con una copia previa y permanecen iguales.

Se refinaron el logo de código, la jerarquía tipográfica, los beneficios, fondos y bordes de la tarjeta, inputs, sombras y círculo CSS. Los tokens base se mantienen; se agregan action-start, action-end y action-text para el tratamiento azul con gradiente. En oscuro se usan #2879BB y #2167A4 con texto blanco (contraste mínimo 4,62:1); en claro se reutilizan primary y primary-hover. El botón incluye estilos hover, focus, active y disabled. No se agregó ninguna dependencia.

Typecheck, build y lint: correctos. El script funcional temporal de Chrome headless pasó nuevamente: campos vacíos, correo inválido, envío válido sin recarga, mensaje demostrativo, mostrar/ocultar contraseña, enlaces futuros, ambos temas y tabulación con foco visible. No se detectó scroll horizontal ni controles recortados a 320, 368, 390, 768 y 1440 px. La decoración no intercepta controles. No se detectaron errores de consola ni solicitudes a la API. Se midió el contraste de ambos extremos del gradiente del botón y de los tokens de texto, errores, bordes y foco.

Capturas revisadas visualmente frente a los dos bocetos: node_modules/.tmp/fe-001b2-{desktop,mobile}-{dark,light}.png. Son artefactos temporales ignorados por Git. También son temporales los scripts de verificación y las copias previas utilizadas para comparar lógica.

Las diferencias de FE-001B.1 sobre el ojo textual y la posición del enlace de recuperación quedan resueltas. Permanecen como diferencias: círculo CSS sin textura fotográfica, tipografía del sistema y pie de página existente. No se reproduce el marco de ventana del boceto ni sus otras pantallas, fuera del alcance. No se probaron lectores de pantalla ni dispositivos físicos.

## FE-001C.1 — Registro demostrativo

App selecciona Sign In o Sign Up mediante #login y #registro, escucha hashchange y conserva el tema al navegar. Los enlaces no recargan el documento y funcionan con Atrás/Adelante y entrada directa a #registro. El título del documento se actualiza. Desde FE-001C.2 los formularios permanecen montados durante el intercambio; los campos se mantienen solo en memoria hasta recargar o cerrar la página, sin persistencia.

AuthLayout comparte el panel de marca, la tarjeta y los títulos; AuthIcon comparte los SVG existentes. LoginForm mantiene su lógica de validación y envío; solo reutiliza esos iconos. RegisterForm conserva sus propios estados y validaciones, sin librerías adicionales. Se reutilizan tokens y CSS existentes; únicamente se agrega el estilo field-hint. Los breakpoints de 960 y 480 px permanecen intactos.

Campos: nombre completo (obligatorio, no solo espacios), correo (obligatorio y formato básico), contraseña (obligatoria, no solo espacios, mínimo 4 caracteres) y confirmación (obligatoria y coincidencia exacta). Los errores se actualizan al editar tras el primer envío y el foco va al primer campo inválido. Cambiar la contraseña vuelve a validar la confirmación. Ambos campos de contraseña tienen controles independientes con nombre accesible y aria-pressed. Los errores tienen aria-invalid/aria-describedby y un aviso alert; el estado demostrativo usa role=status.

No se envían datos, no se crea ninguna cuenta y no se guarda JWT. El nombre se identifica como nombre para facilitar una futura integración con el contrato { nombre, email, password }; confirmPassword pertenece solo a la UI. La API no se implementó.

Verificación: typecheck, build y lint correctos. Chrome headless comprobó errores individuales, nombre en blanco/espacios, email inválido, contraseña de 3 y de 4 caracteres, contraseña de solo espacios, confirmación vacía y distinta, revalidación de coincidencia al editar, ambos controles de visibilidad, envío sin recarga y mensaje demostrativo. También se verificaron labels, asociaciones de errores, regiones dinámicas, tabulación, foco visible, navegación entre pantallas, historial y recarga directa de #registro. Se repitió el recorrido funcional de login.

Ambos temas pasaron a 320, 390, 768 y 1440 px en registro, con datos válidos y errores, sin scroll horizontal ni controles recortados. Login también pasó a 368 px. No se detectaron errores de consola ni solicitudes a la API durante esos recorridos. Se revisaron capturas de registro desktop y mobile; los artefactos y el script de prueba son temporales ignorados dentro de node_modules/.tmp/. No se probaron lectores de pantalla ni dispositivos físicos.

## FE-001C.2 — Sliding Auth

App conserva el tema y la navegación por hash, y asigna un identificador a cada cambio de modo para descartar cierres de animaciones anteriores, incluso cuando se invierte rápidamente la dirección. AuthLayout mantiene ambas páginas montadas dentro de una pila CSS Grid. LoginPage y RegisterPage contienen sus tarjetas y títulos propios, con IDs distintos. AuthBrandPanel adapta el mensaje y el CTA al modo. Los formularios y los tokens no cambian.

Desde 960 px, la pila ocupa la columna izquierda en Sign In y la derecha en Sign Up; la marca recorre la dirección contraria. Dos columnas de igual ancho permiten desplazamientos calculados con transform y el gap existente. La transición dura 500 ms, con opacidad escalonada para reducir la superposición durante el cruce. La transición horizontal se habilita solo durante la navegación, para no animar los cambios de breakpoint. Por debajo de 960 px, la marca se reduce al logo y las tarjetas se alternan con opacidad y desplazamiento vertical en 220 ms. Se conserva el ajuste de padding a 480 px.

La pila reserva la altura del formulario más alto, incluidos sus mensajes, para evitar saltos al cambiar de modo. Esto puede dejar espacio libre debajo de Sign In en pantallas pequeñas. Los campos de ambos formularios se conservan en memoria mientras la página permanezca abierta, sin guardar contraseñas ni JWT en almacenamiento persistente.

Accesibilidad: antes de ocultar un panel que contiene el foco, se mueve el foco al main sin desplazar la vista. El panel inactivo tiene aria-hidden e inert; durante la transición ambos formularios son inert y el layout indica aria-busy. Al terminar se habilita el formulario activo y se enfoca su título, permitiendo que el navegador lo haga visible. El cierre usa un margen de seguridad de 550 ms en desktop y 250 ms en mobile, cancelado al llegar una navegación posterior. Con prefers-reduced-motion se deshabilitan transiciones y animaciones y se habilita/focaliza inmediatamente el destino. También se atiende el cambio de esa preferencia mientras ocurre la transición.

Verificaciones: typecheck, build y lint correctos. Chrome headless comprobó el intercambio en ambas direcciones, enlaces de los formularios, CTA de marca, Atrás/Adelante, hashes directos, conservación de nodos, cambio rápido de dirección, validaciones y controles de visibilidad de ambos formularios, tema, tabulación y foco visible. Ambos modos y temas pasaron a 320, 390, 768, 960 y 1440 px, con posiciones finales verificadas y sin desbordamiento horizontal. Se comprobó movimiento reducido y ausencia de foco en paneles ocultos. No se detectaron errores de consola ni llamadas a la API. Se revisaron capturas desktop/mobile; artefactos temporales ignorados en node_modules/.tmp/sliding-*.png. No se probaron lectores de pantalla ni dispositivos físicos.

## FE-001C.3 — Pulido visual y de interacción

Cambios limitados a global.css, la clase register-card de RegisterPage, inert temporal del branding en AuthBrandPanel/AuthLayout y esta documentación. Se conservan los formularios y sus reglas de validación, tokens, textos de identidad, navegación por hash y breakpoints de 960/480 px. No se agregaron dependencias.

En desktop se reduce el padding exterior de main a 80/64/24 px y el footer a 16 px verticales. El registro usa padding de 24/28 px, margen inferior de campos de 14 px, separación de labels de 7 px, subtítulo de 20 px, ayuda de 4 px y enlace secundario de 18 px. No cambian las fuentes ni los controles de al menos 44 px. Estos ajustes se aplican desde 960 px; mobile conserva su espaciado anterior. No hay alturas fijas ni recortes de contenido.

Mediciones en Chrome con registro realmente vacío después de recargar: altura aproximada de tarjeta 570,3 px; borde inferior a 650,3 px en 1440x720 y a 673,6 px en 1366x768. La tarjeta completa queda visible. Los errores o mensajes más largos pueden requerir scroll vertical natural, igual que el footer en ventanas bajas.

El CTA de branding ahora tiene borde, fondo sutil, área de al menos 44 px y estados hover/active; conserva el foco visible existente. Sigue siendo secundario frente al botón azul de envío. Los enlaces secundarios dentro de los formularios se mantienen.

El intercambio horizontal conserva 500 ms con una curva equilibrada cubic-bezier(.4,0,.2,1). El formulario saliente desaparece en 140 ms antes de la entrada del siguiente. Dos nombres de keyframe con el mismo fundido reinician correctamente la opacidad del branding al invertir la dirección durante una transición. La entrada mantiene el escalonado existente y mobile conserva 220 ms. Mientras el branding se desplaza/funde, también es inert para impedir foco sobre CTA o logo invisibles; se reactiva al finalizar. El foco final al título activo, aria-hidden/inert de formularios y prefers-reduced-motion se conservan.

Verificación final: typecheck, build y lint correctos; hashes de LoginForm y RegisterForm idénticos antes y después del pulido. Chrome headless probó 320x700, 390x844, 768x1024, 960x720, 1366x768 y 1440x720 en ambos temas y modos. Se verificaron el intercambio en ambas direcciones, posiciones finales, reversas a 160/260/360 ms, hashes directos, Atrás/Adelante, validaciones y visibilidad de contraseñas, tabulación, foco visible, branding sin foco durante el fundido y movimiento reducido. Sin scroll horizontal, controles recortados, errores de consola ni solicitudes a la API detectados. Capturas temporales revisadas dentro de node_modules/.tmp/polish-*.png. No se probaron lectores de pantalla ni dispositivos físicos. Pendiente aprobación visual.
